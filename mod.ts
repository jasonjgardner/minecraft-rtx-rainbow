import "https://deno.land/x/dotenv/load.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { emptyDir, ensureDir } from "https://deno.land/std@0.123.0/fs/mod.ts";
import titleCase from "https://deno.land/x/case@v2.1.0/titleCase.ts";
import { Image } from "https://deno.land/x/imagescript/mod.ts";
import blocks from "./blocks.ts";
import type { RGB } from "./lib/utils.ts";
import { hex2rgb } from "./lib/utils.ts";

const BEHAVIOR_BLOCK_FORMAT_VERSION = "1.16.100";

type LanguageId = "en_US";

type MaterialMultiplier = (idx: number) => number;

type MinecraftEventTypes = boolean | string | number;

type MinecraftEvent = {
  [key: string]:
    | {
      [key: string]:
        | MinecraftEventTypes
        | MinecraftEvent
        | Array<
          MinecraftEventTypes | MinecraftEvent | {
            [key: string]: MinecraftEventTypes | MinecraftEvent;
          }
        >;
    }
    | MinecraftEventTypes
    | MinecraftEvent[];
};

type MultiLingual = {
  [key in LanguageId]: string;
};

interface IMaterial {
  name: MultiLingual;
  label?: string;
  normal?: string;
  sound?: string;
  friction: number;
  flammable?: {
    burn_odds: number;
    flame_odds: number;
  };

  explosionResistance?: number;

  lightAbsorption: MaterialMultiplier;

  lightEmission: MaterialMultiplier;
  metalness: MaterialMultiplier;
  emissive: MaterialMultiplier;
  roughness: MaterialMultiplier;

  minimumLevel: number;
  maximumLevel: number;

  endStep: number;

  step: number;
}

const res = [];
const ns = "rainbow";
const packName = "RAINBOW!!";
const packDescription = "RTX-enabled solid color blocks";
const STEPS = 25;
const LOWEST_STEP = 50;
const MINIMUM_TINT = 300;
const MAXIMUM_TINT = 900;

const buildId = {
  TARGET_VERSION: [1, 18, 2],
  RP: {
    pack: {
      uuid: Deno.env.get("RP_PACK_UUID"),
      version: [1, 0, 0],
    },
    modules: {
      uuid: Deno.env.get("RP_MODULE_UUID"),
      version: [1, 0, 0],
    },
  },
  BP: {
    pack: {
      uuid: Deno.env.get("BP_PACK_UUID"),
      version: [1, 0, 0],
    },
    modules: {
      uuid: Deno.env.get("BP_MODULE_UUID"),
      version: [1, 0, 0],
    },
  },
} as const;

const DIR_DIST = "./dist";
const DIR_RP = join(DIR_DIST, `/${ns} RP`);
const DIR_BP = join(DIR_DIST, `/${ns} BP`);
const textureData: Record<string, { textures: string | string[] }> = {};

const blocksData: Record<string, Record<string, boolean | number | string>> =
  {};

const languages: Record<LanguageId, string[]> = {
  "en_US": [],
};

async function encodeRGBColor(layerValue: number[], size = 16) {
  const [r, g, b, alpha] = layerValue;
  const imgOutput = new Image(size, size);

  imgOutput.fill(
    alpha !== undefined
      ? Image.rgbaToColor(r, g, b, alpha)
      : Image.rgbToColor(r, g, b),
  );

  return await imgOutput.encode(0);
}

function channelPercentage(percentage: number) {
  return Math.floor((Math.max(0, percentage) * 255) / 100);
}

const materials: IMaterial[] = [
  {
    name: { en_US: "Metallic" },
    label: "metal",
    normal: "block_normal",
    sound: "note.iron_xylophone",
    friction: 0.7,
    minimumLevel: 50,
    maximumLevel: 100,
    endStep: 100,
    step: 25,
    lightAbsorption: () => 0,
    lightEmission: () => 0,
    metalness: (idx) => channelPercentage(idx),
    emissive: () => 0,
    roughness: () => 0,
  },
  {
    name: { en_US: "Glowing" },
    label: "emissive",
    normal: "block_normal",
    sound: "note.pling",
    friction: 0.9,
    minimumLevel: 0,
    maximumLevel: 100,
    endStep: 100,
    step: 25,
    lightAbsorption: () => 0,
    lightEmission: (itr) => itr / 100,
    metalness: () => 0,
    emissive: (idx) => channelPercentage(idx),
    roughness: () => 0,
  },
  {
    name: { en_US: "Plastic" },
    label: "rough",
    normal: "block_normal",
    sound: "note.snare",
    friction: 0.6,
    minimumLevel: 50,
    maximumLevel: 100,
    endStep: 100,
    step: 25,
    lightAbsorption: (itr) => (itr / 100),
    lightEmission: () => 0,
    metalness: () => 0,
    emissive: () => 0,
    roughness: (idx) => channelPercentage(100 - idx),
  },
];

class BlockEntry {
  _id!: string;

  _hue!: string;

  _tint!: string | number;

  _material: IMaterial;
  _level: number;
  _value!: string;
  constructor(key: string, material: IMaterial, level: number) {
    const lastDash = key.lastIndexOf("_");
    this._tint = key.substring(lastDash + 1);
    this._hue = key.substring(0, lastDash);
    this._level = Math.abs(level);
    this._material = material;
    this._id = key;
  }

  getTitle(lang: LanguageId) {
    return `${this._level}% ${
      this._material.name[lang]
    } ${this.color} ${this.tint}`;
  }

  get level() {
    return Math.max(0, Math.min(100, this._level));
  }

  get color() {
    return titleCase(this._hue);
  }

  get tint(): string | number {
    return isNaN(+this._tint)
      ? `${this._tint}`.toUpperCase()
      : parseInt(`${this._tint}`, 10);
  }

  get id() {
    return `${this._id}_${this._material.name.en_US}_${this._level}`
      .toLowerCase();
  }

  get behaviorId() {
    return `${ns}:${this.id}`;
  }

  get resourceId() {
    return `${ns}_${this.id}`;
  }

  get name() {
    return {
      en_US: this.getTitle("en_US"),
    };
  }

  get textureSet() {
    return {
      color: "#ff" + blocks[this._id].color.substring(1),
      metalness_emissive_roughness: <RGB> [
        this._material.metalness(this._level),
        this._material.emissive(this._level),
        this._material.roughness(this._level),
      ],
      normal: this._material.normal || "block_normal",
    } as const;
  }

  get sound() {
    return this._material.sound || "dirt";
  }

  hexColor() {
    return blocks[this._id].color;
  }

  valueOf() {
    return hex2rgb(this.hexColor());
  }

  setPosition(offset: number) {
    return [
      `~`,
      `~${this.level + offset}`,
      `~`,
    ].join(" ");
  }

  properties() {
    return {
      "rainbow:is_ignited": [true, false],
    };
  }

  behaviors() {
    return {
      "minecraft:creative_category": {
        "category": "construction",
        "group": "itemGroup.name.concrete",
      },
      "minecraft:breakonpush": false,
      "minecraft:flammable": this._material.flammable,
      "minecraft:friction": this._material.friction,
      "minecraft:explosion_resistance": this._material.explosionResistance || 0,
      "minecraft:map_color": this.hexColor(),
      "minecraft:block_light_absorption": this._material.lightAbsorption(
        this._level,
      ),
      "minecraft:block_light_emission": this._material.lightEmission(
        this._level,
      ),
      // "minecraft:ticking": {
      //   "range": [1, 1],
      //   "looping": true,
      //   "on_tick": {
      //     "event": "rainbow:set_fire",
      //     "target": "self",
      //     "condition": "query.block_property('rainbow:is_ignited') == false",
      //   },
      // },
      "minecraft:on_interact": {
        "event": "rainbow:recolor1",
      },
      "minecraft:on_step_on": {
        "event": "rainbow:recolor2",
      },
    } as const;
  }

  events(prevBlock?: BlockEntry, nextBlock?: BlockEntry) {
    const eventData: Array<
      [
        string,
        MinecraftEvent,
      ]
    > = [
      // ["rainbow:set_fire", {
      //   "sequence": [
      //     {
      //       "set_block_property": {
      //         "rainbow:is_ignited": true,
      //       },
      //     },
      //     {
      //       "run_command": {
      //         "command": ["effect @e[r=1] minecraft:is_ignited 2 2 false"],
      //       },
      //     },
      //     {
      //       "set_block_property": {
      //         "rainbow:is_ignited": false,
      //       },
      //     },
      //   ],
      // }],
    ];

    if (prevBlock !== undefined) {
      eventData.push(["rainbow:recolor1", {
        "set_block": {
          "block_type": prevBlock.behaviorId,
        },
      }], ["rainbow:grow_x", {
        "set_block_at_pos": {
          "block_offset": [1, 0, 0],
          "block_type": prevBlock.behaviorId,
        },
      }], ["rainbow:grow_y", {
        "set_block_at_pos": {
          "block_offset": [0, 1, 0],
          "block_type": prevBlock.behaviorId,
        },
      }], ["rainbow:grow_z", {
        "set_block_at_pos": {
          "block_offset": [0, 0, 1],
          "block_type": prevBlock.behaviorId,
        },
      }]);
    }

    if (nextBlock !== undefined) {
      eventData.push(["rainbow:recolor2", {
        "set_block": {
          "block_type": nextBlock.behaviorId,
        },
      }]);
    }

    return Object.fromEntries(eventData);
  }
}

for (const idx in materials) {
  for (const key in blocks) {
    if (!blocks[key].enabled) {
      continue;
    }

    let itr = materials[idx].endStep;
    while (itr >= 0) {
      if (
        itr >= materials[idx].minimumLevel && itr <= materials[idx].maximumLevel
      ) {
        res.push(new BlockEntry(key, materials[idx], itr));
      }

      itr -= materials[idx].step;
    }
  }
}

////////

const mcfunctions: Record<string, string[]> = {
  rainbowup: [],
  rainbowstack: [],
  rainbowtrail: [
    `execute @p ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:green_500_glowing_75 0 replace minecraft:grass
execute @p ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:blue_200_glowing_50 0 replace minecraft:water
execute @p ~ ~ ~ fill ~ ~2 ~ ~ ~2 ~ rainbow:blue_200_glowing_50 0 replace minecraft:water
execute @p ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:amber_500_glowing_75 0 replace minecraft:sand
execute @p ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:brown_700_glowing_50 0 replace minecraft:dirt
execute @p ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:grey_200_glowing_75 0 replace minecraft:snow
execute @p ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:grey_400_glowing_50 0 replace minecraft:stone
execute @p ~ ~ ~ fill ~-4 ~-4 ~-4 ~4 ~-1 ~4 rainbow:pink_600_glowing_100 0 replace minecraft:leaves
execute @p ~ ~ ~ fill ~-2 ~-2 ~-2 ~2 ~-1 ~2 rainbow:red_400_metallic_75 0 replace minecraft:log`,
  ],
  entitytrail: [
    `execute @e[type=pig] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:pink_800_metallic_75 0 replace
execute @e[type=sheep] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:grey_200_glowing_50 0 replace
execute @e[type=salmon] ~ ~ ~ fill ~ ~-2 ~ ~ ~-2 ~ rainbow:deep_orange_500_glowing_100 0 replace
execute @e[type=cod] ~ ~ ~ fill ~ ~-2 ~ ~ ~-2 ~ rainbow:brown_700_glowing_50 0 replace
execute @e[type=cow] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:brown_500_metallic_75 0 replace
execute @e[type=chicken] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:amber_100_metallic_50 0 replace
execute @e[type=donkey] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:grey_300_plastic_50 0 replace
execute @e[type=squid] ~ ~ ~ fill ~ ~-2 ~ ~ ~-2 ~ rainbow:indigo_600_glowing_75 0 replace
execute @e[type=glow_squid] ~ ~ ~ fill ~ ~-2 ~ ~ ~-2 ~ rainbow:teal_400_glowing_75 0 replace
execute @e[type=dolphin] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:light_blue_500_glowing_50 0 replace
execute @e[type=wolf] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:grey_500_metallic_50 0 replace
execute @e[type=fox] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:orange_400_metallic_75 0 replace
execute @e[type=llama] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:amber_100_plastic_75 0 replace
execute @e[type=panda] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:grey_100_metallic_100 0 replace
execute @e[type=horse] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:grey_700_metallic_75 0 replace
execute @e[type=cave_spider] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:red_700_glowing_100 0 replace
execute @e[type=arrow] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:red_800_glowing_100 0 replace
execute @e[type=snowball] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:light_blue_100_plastic_100 0 replace
execute @e[type=thrown_trident] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:teal_400_glowing_75 0 replace
execute @e[type=bat] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:deep_purple_400_glowing_50 0 replace
execute @e[type=bee] ~ ~ ~ fill ~ ~-1 ~ ~ ~-1 ~ rainbow:amber_100_glowing_50 0 replace`,
  ],
};

const tickers: string[] = [
  "rainbowtrail",
  "entitytrail",
];

const output: [string, string][] = [
  [`${DIR_RP}/texts/languages.json`, JSON.stringify(Object.keys(languages))],
  [
    `${DIR_BP}/functions/tick.json`,
    JSON.stringify({
      "values": tickers,
    }),
  ],
];

for (let itr = 0, len = res.length; itr < len; itr++) {
  const block = res[itr];
  const prevBlock = itr === 1 ? res[len] : res[itr - 1];
  const nextBlock = itr + 1 >= len ? res[0] : res[itr + 1];

  blocksData[block.behaviorId] = {
    textures: block.resourceId,
    sound: block.sound,
  };

  textureData[block.resourceId] = {
    textures: `textures/blocks/${block.id}`,
  };

  languages.en_US.push(
    `tile.${block.behaviorId}.name=${block.name.en_US}`,
  );

  /// Write behavior block
  output.push(
    [
      `${DIR_BP}/blocks/${block.id}.json`,
      JSON.stringify(
        {
          format_version: BEHAVIOR_BLOCK_FORMAT_VERSION,
          "minecraft:block": {
            description: {
              identifier: block.behaviorId,
              is_experimental: false,
              register_to_creative_menu: true,
              properties: block.properties(),
            },
            components: block.behaviors(),
            events: block.events(prevBlock, nextBlock),
          },
        },
        null,
        2,
      ),
    ],
  );

  /// Write texture
  output.push(
    [
      `${DIR_RP}/textures/blocks/${block.id}.texture_set.json`,
      JSON.stringify(
        {
          format_version: "1.16.100",
          "minecraft:texture_set": block.textureSet,
        },
        null,
        2,
      ),
    ],
  );

  /// Add to functions
  mcfunctions.rainbowup.push(`give @s ${block.behaviorId}`);
  mcfunctions.rainbowstack.push(
    `setblock ${block.setPosition(itr)} ${block.behaviorId}`,
  );
}

for (const func in mcfunctions) {
  output.push(
    [
      `${DIR_BP}/functions/${func}.mcfunction`,
      mcfunctions[func].join("\n"),
    ],
  );
}

output.push(
  [
    `${DIR_RP}/blocks.json`,
    JSON.stringify({ format_version: [1, 1, 0], ...blocksData }, null, 2),
  ],
  [
    `${DIR_RP}/textures/terrain_texture.json`,
    JSON.stringify(
      {
        num_mip_levels: 2,
        padding: 4,
        resource_pack_name: ns,
        texture_name: "atlas.terrain",
        texture_data: textureData,
      },
      null,
      2,
    ),
  ],
  [`${DIR_RP}/texts/en_US.lang`, languages.en_US.join("\n")],
);

output.push(
  [
    `${DIR_RP}/manifest.json`,
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name: packName,
          description: packDescription,
          uuid: `${buildId.RP.pack.uuid}`,
          version: [...buildId.RP.pack.version],
          min_engine_version: [...buildId.TARGET_VERSION],
        },
        modules: [
          {
            description: `${packName} generated textures`,
            type: "resources",
            uuid: `${buildId.RP.modules.uuid}`,
            version: [...buildId.RP.modules.version],
          },
        ],
        dependencies: [
          {
            uuid: `${buildId.BP.pack.uuid}`,
            version: [...buildId.BP.pack.version],
          },
        ],
        capabilities: ["raytraced"],
      },
      null,
      2,
    ),
  ],
  [
    `${DIR_BP}/manifest.json`,
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name: `${packName} Behavior Pack`,
          description: `${packName} data dependency`,
          uuid: `${buildId.BP.pack.uuid}`,
          version: [...buildId.BP.pack.version],
          min_engine_version: [...buildId.TARGET_VERSION],
        },
        modules: [
          {
            description: `${packName} generated block data`,
            type: "data",
            uuid: `${buildId.BP.modules.uuid}`,
            version: [...buildId.BP.modules.version],
          },
        ],
        dependencies: [
          {
            uuid: `${buildId.RP.pack.uuid}`,
            version: [...buildId.RP.pack.version],
          },
        ],
      },
      null,
      2,
    ),
  ],
);

await Promise.all([
  DIR_BP,
  DIR_RP,
].map((dir) => emptyDir(dir)));

await Promise.all(
  [
    `${DIR_BP}/blocks`,
    `${DIR_BP}/functions`,
    `${DIR_RP}/textures/blocks`,
    `${DIR_RP}/texts`,
  ].map(
    (dir) => ensureDir(dir),
  ),
);

await Promise.all(
  [
    Deno.copyFile(
      "./src/block_normal.png",
      join(DIR_RP, "/textures/blocks/block_normal.png"),
    ),
    Deno.copyFile("./src/pack_icon.png", join(DIR_BP, "/pack_icon.png")),
    Deno.copyFile("./src/pack_icon.png", join(DIR_RP, "/pack_icon.png")),
    ...output.map(([dest, data]) => Deno.writeTextFile(dest, data)),
  ],
);
