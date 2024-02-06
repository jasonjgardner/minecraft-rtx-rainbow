import type BlockEntry from "./BlockEntry.ts";
import { join } from "path/mod.ts";
import { ensureDir, EOL } from "fs/mod.ts";
import { Markdown } from "deno_markdown/mod.ts";
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
  return `execute as ${params.who || "@p"} positioned as @s run fill ${
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
  constructor(selector: SelectorParameters, replaceWith?: string | BlockEntry) {
    this._replaceWith = replaceWith === undefined
      ? "minecraft:air"
      : typeof replaceWith === "string"
      ? replaceWith
      : `${NAMESPACE}:${replaceWith?.id}`;
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
    this._replaceWhat = replaceWhat.replace(/^/g, "");
  }

  get format() {
    return formatTrail({
      who: this.selector,
      replaceWith: this._replaceWith,
      replaceWhat: this._replaceWhat,
      where: this._where,
    });
  }

  get filename() {
    return this._filename ?? this._selector.name ?? this._selector.type ??
      "entity_trail";
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
  colorPalette?: string[],
): string[] {
  const colors = colorPalette ?? [
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
  }, "air");

  BottomFireworksTrail.replaceWhat = fireworksBlock;
  FireworksTrail.where = ["~-1", "~", "~", "~-1", "~", "~"];
  BottomFireworksTrail.where = ["~-1", "~-1", "~", "~-1", "~-1", "~"];

  FireworksTrail.filename = "trails/fireworks";
  BottomFireworksTrail.filename = "trails/fireworks";

  const entities: EntityTrail[] = [
    FireworksTrail,
    BottomFireworksTrail,
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
    "glow_squid": [
      `${NAMESPACE}:cyan_500_glowing_25`,
      `${NAMESPACE}:cyan_600_glowing_25`,
      `${NAMESPACE}:cyan_700_glowing_25`,
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
    "axolotl": [
      `${NAMESPACE}:pink_500_glowing_25`,
      `${NAMESPACE}:pink_600_glowing_25`,
      `${NAMESPACE}:pink_700_glowing_25`,
    ],
    "frog": [
      `${NAMESPACE}:green_700_glowing_25`,
      `${NAMESPACE}:brown_700_glowing_25`,
      `${NAMESPACE}:amber_700_glowing_25`,
    ],
    "tadpole": [
      `${NAMESPACE}:green_500_glowing_25`,
      `${NAMESPACE}:brown_500_glowing_25`,
      `${NAMESPACE}:amber_500_glowing_25`,
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
    FishRiverTrail.replaceWhat = "water";
    FishRiverTrail.where = ["~", "~-2", "~", "~", "~-2", "~"];

    const FishBeachedTrail = new EntityTrail(
      { type: fish, r: 400, c: 64 },
      blockLibrary[color[1] ?? color[0]],
    );

    FishBeachedTrail.replaceWhat = "dirt";

    const FishAirTrail = new EntityTrail(
      { type: fish, r: 400, c: 64 },
      blockLibrary[color[2] ?? color[0]],
    );

    FishAirTrail.replaceWhat = "air";

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
    {
      projectile: "egg",
      filename: "trails/projectiles/egg_rainbow",
      colors: getRainbowBlocks(500, 25, "glowing"),
      offset: 1,
      step: 3,
      minRange: 4,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "ender_pearl",
      filename: "trails/projectiles/ender_rainbow",
      colors: getRainbowBlocks(500, 25, "glowing", [
        "lime",
        "green",
        "purple",
        "deep_purple",
      ]),
      offset: 2,
      step: 8,
      minRange: 5,
      maxRange: 600,
      goesDown: false,
    },
    {
      projectile: "fishing_hook",
      filename: "trails/projectiles/hook_rainbow",
      colors: getRainbowBlocks(800, 25, "glowing", [
        "deep_orange",
        "red",
        "purple",
        "deep_purple",
      ]),
      offset: 2,
      step: 2,
      minRange: 3,
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
      ProjectileAirTrail.replaceWhat = "air";
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

export async function colorTrails(
  blockLibrary: Record<string, BlockEntry>,
): Promise<string[]> {
  const REPLACE_ALL = "*";
  const replacements = ["air", "water", REPLACE_ALL];
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

        entityTrail.filename = `trails/colors/replace/${name}`;

        if (replaceWhat !== REPLACE_ALL) {
          entityTrail.replaceWhat = replaceWhat;
          entityTrail.filename = `trails/colors/keep/${name}`;
        }

        entities.push(entityTrail);
      });
    });
  }

  const functions: string[] = [];
  const replacementFunctions: string[] = [];

  for (const entity of entities) {
    const fn = await entity.save();

    if (!fn) {
      continue;
    }

    if (
      entity.filename.startsWith("trails/colors/keep/")
    ) {
      functions.push(fn);
    } else if (
      entity.filename.startsWith("trails/colors/replace/")
    ) {
      replacementFunctions.push(fn);
    }
  }

  await Deno.writeTextFile(
    `${DIR_BP}/functions/trails/colors/replace.mcfunction`,
    [...new Set(replacementFunctions)].map((f) => `function ${f}`).join(
      EOL.CRLF,
    ),
  );
  await Deno.writeTextFile(
    `${DIR_BP}/functions/trails/colors/keep.mcfunction`,
    [...new Set(functions)].map((f) => `function ${f}`).join(EOL.CRLF),
  );

  return [...functions, ...replacementFunctions];
}

// export function testForRedstone() {
//   let fn = '';

//   for (let i = 1; i < 16; i++) {
//     fn += `testforblock ~ ~1 ~ redstone_dust ${i}` + EOL.CRLF;
//   }

//   return fn;
// }

export function rainbowTrailFunction() {
  const replacements = [
    {
      replaceWhat: "grass",
      replaceWith: "rainbow:green_500_glowing_25",
    },
    {
      replaceWhat: "water",
      replaceWith: "rainbow:blue_200_glowing_25",
    },
    {
      replaceWhat: "sand",
      replaceWith: "rainbow:amber_500_glowing_25",
    },
    {
      replaceWhat: "sandstone",
      replaceWith: "rainbow:amber_600_glowing_25",
    },
    {
      replaceWhat: "red_sandstone",
      replaceWith: "rainbow:red_700_glowing_25",
    },
    {
      replaceWhat: "dirt",
      replaceWith: "rainbow:brown_700_glowing_25",
    },
    {
      replaceWhat: "snow",
      replaceWith: "rainbow:grey_200_glowing_75",
    },
    {
      replaceWhat: "stone",
      replaceWith: "rainbow:grey_400_glowing_25",
    },
    {
      replaceWhat: "gravel",
      replaceWith: "rainbow:grey_500_glowing_25",
    },
    {
      replaceWhat: "snow",
      replaceWith: "rainbow:grey_100_glowing_25",
    },
    {
      replaceWhat: "warped_nylium",
      replaceWith: "rainbow:teal_600_glowing_25",
    },
    {
      replaceWhat: "leaves",
      replaceWith: "rainbow:green_600_glowing_25",
      where: "~-4 ~-4 ~-4 ~4 ~-1 ~4".split(" "),
    },
    {
      replaceWhat: "log",
      replaceWith: "rainbow:brown_400_metallic_50",
      where: "~-2 ~-2 ~-2 ~2 ~-1 ~2".split(" "),
    },
  ];

  return replacements.map((fmt: IFormatTrail) => {
    return formatTrail({
      ...{
        who: formatSelector("e", {
          tag: "rainbow_trail",
        }),
      },
      ...fmt,
    });
  }).join(EOL.CRLF);
}
