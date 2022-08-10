import type BlockEntry from "./BlockEntry.ts";
import { join } from "https://deno.land/std@0.125.0/path/mod.ts";
import { ensureDir, EOL } from "https://deno.land/std@0.125.0/fs/mod.ts";
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
  type?: string;

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

  _filename: string | undefined;
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

  set filename(filename: string) {
    this._filename = filename.trim().toLowerCase().replace(/\s+/g, "_");
  }

  async save(): Promise<string> {
    const filename = this._filename ?? this._selector.name ??
      this._selector.type;

    if (typeof filename !== "string") {
      throw new Error(
        "Can not save function. No output filename could be determined.",
      );
    }

    const filenameParts = filename.split("/");
    const functionFilename = filenameParts.pop();
    const functionDir = join(DIR_BP, "functions", ...filenameParts);
    await ensureDir(functionDir);

    const fnFile = join(functionDir, `${functionFilename}.mcfunction`);

    await Deno.writeTextFile(
      fnFile,
      this.format + EOL.CRLF,
      { append: true },
    );

    return filename;
  }
}

function getRainbowBlocks(
  shade: number,
  level: number,
  material: string,
): string[] {
  const colors = [
    "red",
    "deep_orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light_green",
    "green",
    "teal",
    "cyan",
    "light_blue",
    "blue",
    "indigo",
    "purple",
    "deep_purple",
  ];

  return colors.map((color) =>
    `${NAMESPACE}:${color}_${shade}_${material}_${level}`
  );
}

function getShadeBlocks(color: string, level: number, material: string) {
  const blocks = [];
  for (let itr = 100; itr < 900; itr += 100) {
    blocks.push(`${NAMESPACE}:${color}_${itr}_${material}_${level}`);
  }
  return blocks;
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

  FireworksTrail.filename = "trails/fireworks";
  BottomFireworksTrail.filename = "trails/fireworks";

  const critters = [
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

  // Lazy filename patch
  critters.forEach((critter) => {
    critter.filename = `trails/entities/${critter._selector.type}`;
  });

  const entities: EntityTrail[] = [
    FireworksTrail,
    BottomFireworksTrail,
    ...critters,
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

  /**
   * Fish trails replace different blocks depending on the surface
   */
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

    FishRiverTrail.filename = `trails/entities/${fish}`;
    FishBeachedTrail.filename = `trails/entities/${fish}`;
    FishAirTrail.filename = `trails/entities/${fish}`;

    entities.push(FishRiverTrail, FishBeachedTrail, FishAirTrail);
  }

  const projectiles: {
    filename?: string;
    projectile: string;
    colors: Array<string>;
    offset: number;
    step: number;
    minRange: number;
    maxRange: number;
    goesDown: boolean;
  }[] = [
    {
      projectile: "arrow",
      filename: "trails/projectiles/arrow_green_glowing_25",
      colors: getShadeBlocks("green", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "arrow",
      filename: "trails/projectiles/arrow_yellow_glowing_25",
      colors: getShadeBlocks("yellow", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "arrow",
      filename: "trails/projectiles/arrow_red_glowing_25",
      colors: getShadeBlocks("red", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "arrow",
      filename: "trails/projectiles/arrow_blue_glowing_25",
      colors: getShadeBlocks("blue", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "arrow",
      filename: "trails/projectiles/arrow_deep_purple_glowing_25",
      colors: getShadeBlocks("deep_purple", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "arrow",
      filename: "trails/projectiles/arrow_deep_orange_glowing_25",
      colors: getShadeBlocks("deep_orange", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "arrow",
      filename: "trails/projectiles/arrow_rainbow",
      colors: getRainbowBlocks(500, 25, "glowing"),
      offset: 1,
      step: 9,
      minRange: 4,
      maxRange: 700,
      goesDown: false,
    },
    {
      projectile: "arrow",
      filename: "trails/projectiles/arrow_rainbow_stack",
      colors: getRainbowBlocks(500, 25, "glowing"),
      offset: 1,
      step: 10,
      minRange: 4,
      maxRange: 700,
      goesDown: true,
    },
    {
      projectile: "snowball",
      filename: "trails/projectiles/snowball_rainbow",
      colors: getRainbowBlocks(600, 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "snowball",
      filename: "trails/projectiles/snowball_deep_orange_glowing_25",
      colors: getShadeBlocks("deep_orange", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "snowball",
      filename: "trails/projectiles/snowball_pink_glowing_25",
      colors: getShadeBlocks("pink", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "snowball",
      filename: "trails/projectiles/snowball_blue_glowing_25",
      colors: getShadeBlocks("blue", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "snowball",
      filename: "trails/projectiles/snowball_green_glowing_25",
      colors: getShadeBlocks("green", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "snowball",
      filename: "trails/projectiles/snowball_red_glowing_25",
      colors: getShadeBlocks("red", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "snowball",
      filename: "trails/projectiles/snowball_light_blue_glowing_25",
      colors: getShadeBlocks("light_blue", 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    // Creates a stack of rainbow blocks in its trail
    {
      projectile: "thrown_trident",
      filename: "trails/projectiles/trident_rainbow_stack",
      colors: getRainbowBlocks(500, 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 5,
      maxRange: 600,
      goesDown: true,
    },
    {
      projectile: "thrown_trident",
      filename: "trails/projectiles/trident_rainbow",
      colors: getRainbowBlocks(500, 25, "glowing"),
      offset: 1,
      step: 5,
      minRange: 5,
      maxRange: 600,
      goesDown: false,
    },
  ];

  for (
    const {
      filename,
      projectile,
      colors,
      offset,
      step,
      minRange,
      maxRange,
      goesDown,
    } of projectiles
  ) {
    const maxLength = colors.length;

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
      const radiuses = goesDown
        ? {
          rm: minRange,
          r: maxRange,
        }
        : {
          rm: minRange + (step * i),
          r: i + 1 < maxLength
            ? Math.min(
              minRange + (step * i) + step,
              maxRange,
            )
            : maxRange,
        };

      const replaceWith = blockLibrary[colors[i]];

      if (!replaceWith) {
        throw Error(`No block found for ${colors[i]}`);
      }

      const ProjectileAirTrail = new EntityTrail(
        {
          ...radiuses,
          ...params,
        },
        replaceWith,
      );
      ProjectileAirTrail.replaceWhat = "minecraft:air";
      ProjectileAirTrail.where = [
        "~",
        `~-${i + offset}`,
        "~",
        "~",
        `~-${i + offset}`,
        "~",
      ];

      ProjectileAirTrail.filename = filename ??
        `trails/projectiles/${projectile}`;

      entities.push(ProjectileAirTrail);
    }
  }

  const functions: string[] = [];

  for (const entity of entities) {
    const fn = await entity.save();

    if (fn) {
      functions.push(fn);
    }
  }

  return [...new Set(functions)].map((f) => `function ${f}`).join(EOL.CRLF);
}

export async function colorTrails(blockLibrary: Record<string, BlockEntry>) {
  const REPLACE_ALL = "*";
  const replacements = ["minecraft:air", "minecraft:water", REPLACE_ALL];
  const entities: EntityTrail[] = [];

  const selectors = ["name", "tag"];

  // create entity trails for all colors, using name selector parameter

  for (const [key, value] of Object.entries(blockLibrary)) {
    selectors.forEach((selector) => {
      replacements.forEach((replaceWhat) => {
        const name = key.split(":")[1];
        const entityTrail = new EntityTrail({
          [`${selector}`]: name,
          c: 64,
        }, value);

        if (replaceWhat !== REPLACE_ALL) {
          entityTrail.replaceWhat = replaceWhat;
          entityTrail.filename = `trails/colors/keep/${name}`;
        } else {
          entityTrail.filename = `trails/colors/replace/${name}`;
        }

        entities.push(entityTrail);
      });
    });
  }

  const functions: string[] = [];

  for (const entity of entities) {
    const fn = await entity.save();

    if (fn) {
      functions.push(fn);
    }
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
