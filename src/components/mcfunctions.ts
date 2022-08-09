import type BlockEntry from "./BlockEntry.ts";
import { EOL } from "https://deno.land/std@0.125.0/fs/mod.ts";
import { DIR_BP, NAMESPACE } from "../store/_config.ts";

interface IFormatTrail {
  replaceWhat?: string;
  replaceWith: string;
  who?: string;
  where?: Array<string | number>;
}

interface SelectorParameters {
  [k: string]: boolean | number | string | undefined;
  c?: number;
  type: string;

  m?: string;
  family?: string;
  tag?: string;
  ry?: number;
  rx?: number;
  x?: number;
  y?: number;
  z?: number;
  r?: number;
  rm?: number;
  name?: string;
  dx?: number;
  dz?: number;
  dy?: number;
}

function formatTrail(params: IFormatTrail) {
  return `execute ${params.who || "@p"} ~ ~ ~ fill ${
    params.where === undefined ? "~ ~-1 ~ ~ ~-1 ~" : params.where.join(" ")
  } ${params.replaceWith} 0 replace ${params.replaceWhat ?? ""}`.trimEnd();
}

function formatSelector(
  target: "p" | "a" | "e" | "r" | "s" | "initiator",
  params: SelectorParameters,
) {
  return `@${target}[${
    Object.entries(params).map(([k, v]) => `${k}=${v}`).join(",")
  }]`;
}

class EntityTrail {
  _selector!: SelectorParameters;
  _replaceWith!: string;

  _replaceWhat: string | undefined;

  _where: Array<string | number> | undefined;
  constructor(selector: SelectorParameters, replaceWith: string | BlockEntry) {
    this._replaceWith = typeof replaceWith === "string"
      ? replaceWith
      : `${NAMESPACE}:${replaceWith.id}`;
    this._selector = selector;
  }

  get selector() {
    return formatSelector("e", this._selector);
  }

  get type() {
    return this._selector.type;
  }

  get count() {
    return this._selector.c || 1;
  }

  set count(count: number) {
    this._selector.c = Math.max(1, Math.min(1000, count));
  }

  set where(where: Array<string | number>) {
    this._where = where;
  }

  set replaceWhat(replaceWhat: string) {
    this._replaceWhat = replaceWhat;
  }

  get format() {
    return formatTrail({
      who: this.selector,
      replaceWith: this._replaceWith,
      replaceWhat: this._replaceWhat,
      where: this._where,
    });
  }

  async save() {
    await Deno.writeTextFile(
      `${DIR_BP}/functions/trails/${this.type}.mcfunction`,
      this.format + "\n",
      { append: true },
    );

    return `trails/${this.type}`;
  }
}

export async function entityTrailFunction(
  blockLibrary: Record<string, BlockEntry>,
) {
  const fireworksBlock = `${NAMESPACE}:orange_500_glowing_25`;
  const FireworksTrail = new EntityTrail(
    { type: "fireworks_rocket", r: 400, c: 64 },
    blockLibrary[fireworksBlock],
  );
  const BottomFireworksTrail = new EntityTrail({
    type: "fireworks_rocket",
    r: 400,
    c: 64,
  }, "minecraft:air");

  BottomFireworksTrail.replaceWhat = fireworksBlock;
  FireworksTrail.where = ["~-1", "~", "~", "~-1", "~", "~"];
  BottomFireworksTrail.where = ["~-1", "~-1", "~", "~-1", "~-1", "~"];

  const entities: EntityTrail[] = [
    FireworksTrail,
    BottomFireworksTrail,
    new EntityTrail(
      { type: "pig", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:pink_600_metallic_75`],
    ),
    new EntityTrail(
      { type: "cow", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:brown_700_metallic_75`],
    ),
    new EntityTrail(
      { type: "donkey", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:grey_400_metallic_50`],
    ),
    new EntityTrail(
      { type: "horse", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:brown_400_glowing_25`],
    ),
    new EntityTrail(
      { type: "sheep", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:grey_200_plastic_75`],
    ),
    new EntityTrail(
      { type: "wolf", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:grey_900_metallic_50`],
    ),
    new EntityTrail(
      { type: "fox", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:deep_orange_900_metallic_50`],
    ),
    new EntityTrail(
      { type: "chicken", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:amber_300_plastic_50`],
    ),
    new EntityTrail(
      { type: "polar_bear", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:light_blue_200_metallic_75`],
    ),
    new EntityTrail(
      { type: "rabbit", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:pink_200_plastic_50`],
    ),
    new EntityTrail(
      { type: "llama", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:amber_100_plastic_50`],
    ),
    new EntityTrail(
      { type: "panda", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:grey_200_metallic_50`],
    ),
    new EntityTrail(
      { type: "cat", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:pink_400_metallic_50`],
    ),
    new EntityTrail(
      { type: "cave_spider", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:red_900_glowing_25`],
    ),
    new EntityTrail(
      { type: "bat", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:deep_purple_900_glowing_25`],
    ),
    new EntityTrail(
      { type: "bee", r: 400, c: 64 },
      blockLibrary[`${NAMESPACE}:amber_100_glowing_25`],
    ),
  ];

  const fishies: { [k: string]: string[] } = {
    "salmon": [
      `${NAMESPACE}:deep_orange_500_glowing_25`,
      `${NAMESPACE}:deep_orange_600_glowing_25`,
      `${NAMESPACE}:deep_orange_700_glowing_25`,
    ],
    "pufferfish": [
      `${NAMESPACE}:yellow_500_glowing_25`,
      `${NAMESPACE}:yellow_600_glowing_25`,
      `${NAMESPACE}:yellow_700_glowing_25`,
    ],
    "dolphin": [
      `${NAMESPACE}:blue_500_glowing_25`,
      `${NAMESPACE}:blue_600_glowing_25`,
      `${NAMESPACE}:blue_700_glowing_25`,
    ],
    "squid": [
      `${NAMESPACE}:blue_gray_500_glowing_25`,
      `${NAMESPACE}:blue_gray_600_glowing_25`,
      `${NAMESPACE}:blue_gray_700_glowing_25`,
    ],
    "cod": [
      `${NAMESPACE}:brown_500_glowing_25`,
      `${NAMESPACE}:brown_600_glowing_25`,
      `${NAMESPACE}:brown_700_glowing_25`,
    ],
    "turtle": [
      `${NAMESPACE}:light_green_500_glowing_25`,
      `${NAMESPACE}:light_green_600_metallic_75`,
      `${NAMESPACE}:light_green_700_glowing_25`,
    ],
  };

  for (const [fish, color] of Object.entries(fishies)) {
    const FishRiverTrail = new EntityTrail(
      { type: fish, r: 400, c: 64 },
      blockLibrary[color[0]],
    );
    FishRiverTrail.replaceWhat = "minecraft:water";
    FishRiverTrail.where = ["~", "~-2", "~", "~", "~-2", "~"];

    const FishBeachedTrail = new EntityTrail(
      { type: fish, r: 400, c: 64 },
      blockLibrary[color[1] ?? color[0]],
    );

    FishBeachedTrail.replaceWhat = "minecraft:dirt";

    const FishAirTrail = new EntityTrail(
      { type: fish, r: 400, c: 64 },
      blockLibrary[color[2] ?? color[0]],
    );

    FishAirTrail.replaceWhat = "minecraft:air";
    entities.push(FishRiverTrail, FishBeachedTrail, FishAirTrail);
  }

  const rainbowBlocks = [
    `${NAMESPACE}:pink_400_glowing_25`,
    `${NAMESPACE}:red_400_glowing_25`,
    `${NAMESPACE}:deep_orange_400_glowing_25`,
    `${NAMESPACE}:orange_400_glowing_25`,
    `${NAMESPACE}:amber_400_glowing_25`,
    `${NAMESPACE}:yellow_400_glowing_25`,
    `${NAMESPACE}:lime_400_glowing_25`,
    `${NAMESPACE}:light_green_400_glowing_25`,
    `${NAMESPACE}:green_400_glowing_25`,
    `${NAMESPACE}:teal_400_glowing_25`,
    `${NAMESPACE}:cyan_400_glowing_25`,
    `${NAMESPACE}:light_blue_400_glowing_25`,
    `${NAMESPACE}:blue_400_glowing_25`,
    `${NAMESPACE}:purple_400_glowing_25`,
    `${NAMESPACE}:deep_purple_400_glowing_25`,
    `${NAMESPACE}:indigo_400_glowing_25`,
  ];

  const projectiles: {
    [k: string]: {
      colors: Array<string>;
      offset: number;
      radius: [number, number];
      step: number;
    };
  } = {
    // Goes forward
    "arrow": {
      colors: rainbowBlocks,
      offset: 2,
      radius: [5, 150],
      step: 5,
    },
    "snowball": {
      colors: [
        `${NAMESPACE}:deep_orange_100_glowing_25`,
        `${NAMESPACE}:deep_orange_200_glowing_25`,
        `${NAMESPACE}:deep_orange_300_glowing_25`,
        `${NAMESPACE}:deep_orange_400_glowing_25`,
        `${NAMESPACE}:deep_orange_500_glowing_25`,
        `${NAMESPACE}:deep_orange_600_glowing_25`,
        `${NAMESPACE}:deep_orange_700_glowing_25`,
        `${NAMESPACE}:deep_orange_800_glowing_25`,
        `${NAMESPACE}:deep_orange_900_glowing_25`,
      ],
      offset: 0,
      radius: [5, 50],
      step: 5,
    },
    // Drops down
    "thrown_trident": {
      colors: rainbowBlocks,
      offset: 1,
      radius: [5, 120],
      step: 5,
    },
  };

  for (const [projectile, details] of Object.entries(projectiles)) {
    const maxLength = details.colors.length;

    if (!maxLength) {
      throw Error("Projectile has no colors");
    }

    const params: SelectorParameters = {
      type: projectile,
      c: 64,
    };

    /**
     * Offset the projectile trail by 1 block to avoid spawning on top of the projectile.
     * Create a trail for each color in the array.
     */
    for (let i = 0; i < maxLength; i++) {
      const ProjectileAirTrail = new EntityTrail(
        {
          rm: details.step * (i + 1),
          r: (details.step * (i + 1)) + details.step,
          ...params,
        },
        blockLibrary[details.colors[i]],
      );
      ProjectileAirTrail.replaceWhat = "minecraft:air";
      ProjectileAirTrail.where = [
        "~",
        `~-${i + details.offset}`,
        "~",
        "~",
        `~-${i + details.offset}`,
        "~",
      ];
      entities.push(ProjectileAirTrail);
    }
  }

  const functions: string[] = [];

  for (const entity of entities) {
    functions.push(await entity.save());
  }

  return [...new Set(functions)].map((f) => `function ${f}`).join(EOL.CRLF);
}

export function rainbowTrailFunction() {
  return [
    {
      replaceWhat: "minecraft:grass",
      replaceWith: "rainbow:green_500_glowing_75",
    },
    {
      replaceWhat: "minecraft:water",
      replaceWith: "rainbow:blue_200_glowing_50",
    },
    {
      replaceWhat: "minecraft:sand",
      replaceWith: "rainbow:amber_500_glowing_75",
    },
    {
      replaceWhat: "minecraft:sandstone",
      replaceWith: "rainbow:amber_600_glowing_50",
    },
    {
      replaceWhat: "minecraft:red_sandstone",
      replaceWith: "rainbow:red_700_glowing_50",
    },
    {
      replaceWhat: "minecraft:dirt",
      replaceWith: "rainbow:brown_700_glowing_50",
    },
    {
      replaceWhat: "minecraft:snow",
      replaceWith: "rainbow:grey_200_glowing_75",
    },
    {
      replaceWhat: "minecraft:stone",
      replaceWith: "rainbow:grey_400_glowing_50",
    },
    {
      replaceWhat: "minecraft:gravel",
      replaceWith: "rainbow:grey_500_glowing_50",
    },
    {
      replaceWhat: "minecraft:snow",
      replaceWith: "rainbow:grey_100_glowing_25",
    },
    {
      replaceWhat: "minecraft:warped_nylium",
      replaceWith: "rainbow:teal_600_glowing_50",
    },
    {
      replaceWhat: "minecraft:leaves",
      replaceWith: "rainbow:green_600_glowing_50",
      where: "~-4 ~-4 ~-4 ~4 ~-1 ~4".split(" "),
    },
    {
      replaceWhat: "minecraft:leaves2",
      replaceWith: "rainbow:green_600_glowing_50",
      where: "~-4 ~-4 ~-4 ~4 ~-1 ~4".split(" "),
    },
    {
      replaceWhat: "minecraft:log",
      replaceWith: "rainbow:brown_400_metallic_50",
      where: "~-2 ~-2 ~-2 ~2 ~-1 ~2".split(" "),
    },
    {
      replaceWhat: "minecraft:log2",
      replaceWith: "rainbow:brown_400_metallic_50",
      where: "~-2 ~-2 ~-2 ~2 ~-1 ~2".split(" "),
    },
  ].map((fmt: IFormatTrail) => formatTrail(fmt)).join(EOL.CRLF);
}
