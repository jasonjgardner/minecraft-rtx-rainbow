import { BP_DIR, NAMESPACE, RP_DIR, sizes } from "../_constants.ts";
import { basename, copy, ensureDir, Image, join } from "../deps.ts";
import { recursiveReaddir } from "../_utils.ts";
import DecorativeBlock from "./behaviors/DecorativeBlock.ts";
import type { RGB } from "../types.ts";
import {
  Glass,
  GlassCarpet,
  GlassSlab,
  GlassStairs,
} from "./behaviors/Glass.ts";
import { Lamp, LampSlab, LampStairs } from "./behaviors/Lamp.ts";
import { Plate } from "./behaviors/Plate.ts";
import { LitDecorativeBlock } from "./behaviors/Lit.ts";
import { LampCube } from "./behaviors/LampCube.ts";

await ensureDir(
  join(RP_DIR, "texts"),
);

await ensureDir(join(BP_DIR, "blocks"));

await Deno.writeTextFile(
  join(RP_DIR, "texts", "languages.json"),
  JSON.stringify([
    "en_US",
  ]),
);

const behaviors = [
  DecorativeBlock,
  Plate,
  LitDecorativeBlock,
  Lamp,
  LampSlab,
  LampStairs,
  LampCube,
  Glass,
  GlassSlab,
  GlassCarpet,
  GlassStairs,
];

const blocks: DecorativeBlock[] = [];
const texts: Record<string, string> = {};

const colors = [
  "blue",
  "brown",
  "cyan",
  "gray",
  "green",
  "light_blue",
  "light_gray",
  "lime",
  "magenta",
  "orange",
  "pink",
  "purple",
  "red",
  // "white",
  "yellow",
];

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

for (const color of colors) {
  for (const shade of shades) {
    const imgFile = join(
      RP_DIR,
      "subpacks",
      "16x",
      "textures",
      "blocks",
      `${color}_${shade}_block_basecolor.png`,
    );

    const img = await Image.decode(
      await Deno.readFile(imgFile),
    );

    const averageColor = Image.colorToRGB(img.averageColor()) as RGB;

    const hexColor = `#${
      averageColor.map((c) => c.toString(16).padStart(2, "0")).join("")
    }`;

    for (const BehaviorBlock of behaviors) {
      const colorName = `${
        color.split("_").map((word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ")
      } ${shade}`;
      const Block = new BehaviorBlock({
        colorName,
        id: `${color}_${shade}`,
      }, hexColor);
      texts[Block.textId] = Block.title;

      await Block.save();
      blocks.push(Block);
    }
  }
}

const lang = Object.entries(texts).map(([key, value]) => `${key}=${value}`)
  .join("\n");

await Deno.writeTextFile(
  join(RP_DIR, "texts", "en_US.lang"),
  lang,
);

const paddings = [8, 4, 2, 1, 0];

const terrainAtlas = {
  resource_pack_name: NAMESPACE,
  texture_name: "atlas.terrain",
  padding: 8,
  num_mip_levels: 4,
  texture_data: Object.fromEntries(
    blocks.map(({ blockId, textureId }) => [
      textureId,
      {
        textures: `textures/blocks/${textureId}`,
        carried_texture: `textures/blocks/${textureId}_carried.png`,
      },
    ]),
  ),
};

async function addOpacity(size: number, baseColor: string) {
  const baseImage = await Image.decode(
    await Deno.readFile(
      join(
        RP_DIR,
        "subpacks",
        `${size}x`,
        "textures",
        "blocks",
        `${baseColor}.png`,
      ),
    ),
  );

  // const opacityImage = await Image.decode(
  //   await Deno.readFile(
  //     join(RP_DIR, "subpacks", "256x", "textures", "blocks", `${opacity}.png`),
  //   ),
  // );

  const image = baseImage.opacity(0.5, true);

  await Deno.writeFile(
    join(
      RP_DIR,
      "subpacks",
      `${size}x`,
      "textures",
      "blocks",
      `${baseColor}.png`,
    ),
    await image.encode(),
  );
}

const largestSize = Math.max(...sizes);

// Iterate over the largest size and copy to the smaller sizes directories
// await Promise.all(
//   blocks.map(async ({ blockId }) => {
//     const source = join(
//       RP_DIR,
//       "subpacks",
//       `${largestSize}x`,
//       "textures",
//       "blocks",
//       `${NAMESPACE}_${blockId}.png`,
//     );

//     await Promise.all(
//       sizes.filter((s) => s !== largestSize).map(async (size) => {
//         const dest = join(
//           RP_DIR,
//           "subpacks",
//           `${size}x`,
//           "textures",
//           "blocks",
//           `${NAMESPACE}_${blockId}.png`,
//         );

//         try {
//           await copy(source, dest);
//         } catch (err) {
//           console.error(err);
//         }
//       }),
//     );
//   }),
// );

await Promise.all(sizes.map(async (size, idx) => {
  const sizeDir = join(RP_DIR, "subpacks", `${size}x`);

  // await copy(
  //   join(RP_DIR, "models", "blocks"),
  //   join(sizeDir, "models", "blocks"),
  // );

  // Resize every image in this directory to the appropriate size
  const texturesDir = join(
    sizeDir,
    "textures",
    "blocks",
  );

  await ensureDir(
    texturesDir,
  );

  const files = await recursiveReaddir(texturesDir);

  await Promise.all(files.map(async (file) => {
    // Ensure file name is lowercase
    if (file !== file.toLowerCase()) {
      await Deno.rename(file, file.toLowerCase());
    }

    if (!file.endsWith(".png")) {
      return;
    }

    const blockName = basename(file, ".png").replace(
      /_(baseColor|carried|mer|normal|height|opacity)?$/i,
      "",
    );

    // if (
    //   (file.endsWith("_baseColor.png") || file.endsWith("_carried.png")) &&
    //   files.includes(join(texturesDir, `${blockName}_opacity.png`))
    // ) {
    //   await addOpacity(size, basename(file, ".png"));
    // }

    const isIsotropic = blocks.find(({ name }) =>
      name === blockName
    )?.block.isotropic ?? false;

    const depth = isIsotropic
      ? {
        heightmap: `${blockName}_height`,
      }
      : {
        normal: `${blockName}_normal`,
      };

    await Deno.writeTextFile(
      join(
        texturesDir,
        `${NAMESPACE}_${blockName}.texture_set.json`,
      ),
      JSON.stringify(
        {
          format_version: "1.16.100",
          "minecraft:texture_set": {
            color: `${blockName}_basecolor`,
            metalness_emissive_roughness: `${blockName}_mer`,
            ...depth,
          },
        },
        null,
        2,
      ),
    );

    // const image = await Image.decode(
    //   await Deno.readFile(file),
    // );

    // await Deno.writeFile(
    //   file,
    //   await image.resize(size, size).encode(),
    // );
  }));

  const terrainAtlasForSize = {
    ...terrainAtlas,
    padding: paddings[idx],
    num_mip_levels: Math.floor(paddings[idx] * 0.5),
  };

  await Deno.writeTextFile(
    join(RP_DIR, "subpacks", `${size}x`, "textures", "terrain_texture.json"),
    JSON.stringify(terrainAtlasForSize, null, 2),
  );

  const textDir = join(RP_DIR, "subpacks", `${size}x`, "texts");

  await ensureDir(
    textDir,
  );

  await Deno.writeTextFile(
    join(textDir, "en_US.lang"),
    lang,
  );
}));

await Deno.writeTextFile(
  join(RP_DIR, "blocks.json"),
  JSON.stringify(
    Object.fromEntries(
      blocks.map(({ blockId, block }) => [blockId, {
        sound: block.sound,
        isotropic: block.isotropic,
      }]),
    ),
    null,
    2,
  ),
);

await Deno.writeTextFile(
  join(Deno.cwd(), "db.json"),
  JSON.stringify(
    Object.fromEntries(
      blocks.map((
        { blockId, hexColor },
      ) => [blockId, hexColor]),
    ),
    null,
    2,
  ),
);

const deferredLightingDir = join(RP_DIR, "lighting");
await ensureDir(deferredLightingDir);

await Deno.writeTextFile(
  join(deferredLightingDir, "global.json"),
  JSON.stringify({
    format_version: [1, 0, 0],
    directional_lights: {
      sun: {
        illuminance: {
          "0.0": 1.0, // Noon
          "0.25": 400.0, // Sunset
          "0.35": 39000.0,
          "0.5": 100000.0, // Midnight
          "0.65": 39000.0,
          "0.75": 400.0, // Sunrise
          "1.0": 1.0,
        },
        color: [255.0, 255.0, 255.0, 255.0],
      },
      moon: {
        illuminance: 0.25,
        color: [255.0, 255.0, 255.0, 255.0],
      },
      orbital_offset_degrees: 41.25,
    },
    point_lights: {
      colors: Object.fromEntries(
        blocks.filter((b) =>
          b.blockId.endsWith("lit") || b.blockId.endsWith("lamp")
        ).map(({ blockId, hexColor }) => {
          return [`rainbow:${blockId}`, hexColor];
        }),
      ),
    },
    pbr: {
      blocks: {
        global_metalness_emissive_roughness: [0.0, 0.0, 1.0],
      },
      actors: {
        global_metalness_emissive_roughness: [0.0, 0.0, 1.0],
      },
    },
  }),
);
