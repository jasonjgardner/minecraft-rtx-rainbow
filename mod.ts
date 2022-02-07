import "https://deno.land/x/dotenv/load.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { emptyDir, ensureDir } from "https://deno.land/std@0.123.0/fs/mod.ts";
import { EOL } from "https://deno.land/std@0.125.0/fs/mod.ts";
import blocks from "./_blocks.ts";
import type { LanguageId, MinecraftData } from "./types.ts";
import {
  BEHAVIOR_BLOCK_FORMAT_VERSION,
  DIR_DIST,
  MIP_LEVELS,
  NAMESPACE,
  PACK_DESCRIPTION,
  PACK_NAME,
} from "./_config.ts";
import BlockEntry from "./BlockEntry.ts";
import { materials } from "./_materials.ts";
import { entityTrailFunction, rainbowTrailFunction } from "./mcfunctions.ts";
import { deployToDev, resetDev } from "./deploy.ts";
import { makeAtlas } from "./_utils.ts";

const res = [];

const DIR_RP = join(DIR_DIST, `/${NAMESPACE} RP`);
const DIR_BP = join(DIR_DIST, `/${NAMESPACE} BP`);

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

const textureData: Record<string, { textures: string | string[] }> = {};

const blocksData: MinecraftData = {};

const languages: Record<LanguageId, string[]> = {
  "en_US": [],
};

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
  rainbowstack: [],
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
  [
    `${DIR_BP}/functions/rainbowtrail.mcfunction`,
    rainbowTrailFunction(),
  ],
  [
    `${DIR_BP}/functions/entitytrail.mcfunction`,
    entityTrailFunction(),
  ],
];

const dataOutput: [string, Uint8Array][] = [];

let lastColor;
let atlasGroup = [];

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
  mcfunctions.rainbowstack.push(
    `setblock ${block.setPosition(itr)} ${block.behaviorId}`,
  );

  if (lastColor && atlasGroup.length > 1 && lastColor !== block.color) {
    dataOutput.push(
      [
        join(
          DIR_RP,
          `textures/blocks/${
            lastColor.toLowerCase().replace(" ", "_")
          }_flipbook.png`,
        ),
        await makeAtlas(atlasGroup),
      ],
    );

    atlasGroup = [];
  }

  lastColor = block.color;
  atlasGroup.push(block.valueOf());
}

for (const func in mcfunctions) {
  output.push(
    [
      `${DIR_BP}/functions/${func}.mcfunction`,
      mcfunctions[func].join(EOL.CRLF),
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
        num_mip_levels: MIP_LEVELS,
        padding: MIP_LEVELS * 2,
        resource_pack_name: NAMESPACE,
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
          name: PACK_NAME,
          description: PACK_DESCRIPTION,
          uuid: `${buildId.RP.pack.uuid}`,
          version: [...buildId.RP.pack.version],
          min_engine_version: [...buildId.TARGET_VERSION],
        },
        modules: [
          {
            description: `${PACK_NAME} generated textures`,
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
          name: `${PACK_NAME} Behavior Pack`,
          description: `${PACK_NAME} data dependency`,
          uuid: `${buildId.BP.pack.uuid}`,
          version: [...buildId.BP.pack.version],
          min_engine_version: [...buildId.TARGET_VERSION],
        },
        modules: [
          {
            description: `${PACK_NAME} generated block data`,
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
    //resetDev()
    Deno.copyFile(
      "./src/block_normal.png",
      join(DIR_RP, "/textures/blocks/block_normal.png"),
    ),
    Deno.copyFile("./src/pack_icon.png", join(DIR_BP, "/pack_icon.png")),
    Deno.copyFile("./src/pack_icon.png", join(DIR_RP, "/pack_icon.png")),
    //...dataOutput.map(([dest, data]) => Deno.writeFile(dest, data)),
    ...output.map(([dest, data]) => Deno.writeTextFile(dest, data)),
  ],
);

await deployToDev();
