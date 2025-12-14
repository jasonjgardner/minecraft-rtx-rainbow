import { BP_DIR, NAMESPACE, ROOT_DIR, RP_DIR, sizes } from "../_constants.ts";
import { Image } from "imagescript";
import DecorativeBlock from "./behaviors/DecorativeBlock.ts";
import {
  Glass,
  GlassCarpet,
  GlassSlab,
  GlassStairs,
} from "./behaviors/Glass.ts";
import {
  CheckerLamp,
  CornerLamp,
  Lamp,
  LampSlab,
  LampStairs,
  QuadColorLamp,
} from "./behaviors/Lamp.ts";
import { Plate } from "./behaviors/Plate.ts";
import { LitDecorativeBlock } from "./behaviors/Lit.ts";
import { LampCube } from "./behaviors/LampCube.ts";
import PlateLamp from "./behaviors/PlateLamp.ts";
import { writeFile, rename, readFile, readdir } from "node:fs/promises";
import { join, basename } from "node:path";
import { copyFile, ensureDir } from "fs-extra";
import LineBlock from "./behaviors/LineBlock.ts";
import type { Shades } from "../types.ts";
import SlantBlock from "./behaviors/SlantBlock.ts";
import { RP_UUID } from "./manifests.ts";
import buildBiomes, { type IBiome } from "./biomes.ts";
import { buildJava } from "./java.ts";
import {
  BIOME_THEMES,
  COLOR_ZONES,
  getClimateFromShade,
  getHarmoniousPalette,
  getAtmosphereColors,
  getNoiseFrequencyForTheme,
  type ColorName,
  type BiomeTheme,
} from "./colorSchemes.ts";

export interface IColor {
  complimentary: string;
  secondary: string;
  tertiary: string;
  complimentaryHex: string;
  secondaryHex: string;
  tertiaryHex: string;
}

await ensureDir(join(RP_DIR, "texts"));

await writeFile(
  join(RP_DIR, "texts", "languages.json"),
  JSON.stringify(["en_US"]),
  "utf-8",
);

const behaviorPacks: Record<
  string,
  {
    name: string;
    description: string;
    moduleId: string;
    behaviors: Array<typeof DecorativeBlock>;
  }
> = {
  "f8d54f30-f7ef-4120-8cc6-6adaa48a057f": {
    name: "Block Colors",
    description: "Basic rainbow colored blocks",
    moduleId: "0724d948-197a-4f14-925f-26d602318665",
    behaviors: [DecorativeBlock],
  },
  "df33713b-0b83-4cda-9580-55c4f54f0f6e": {
    name: "Plate Blocks",
    description: "Metallic plates",
    moduleId: "a2bc2786-d2fe-477f-a688-ba04900f519b",
    behaviors: [Plate],
  },
  "d36907e6-2389-482b-81fa-f46eeced86b0": {
    name: "Lit Blocks",
    description: "Basic glowing blocks",
    moduleId: "7e3f8372-9a41-4293-a098-cb14e572acab",
    behaviors: [LitDecorativeBlock],
  },
  "dc7dbff6-f263-4c29-b89b-c8f2620a31ad": {
    name: "Lamps",
    description: "Fancy glowing blocks and shapes",
    moduleId: "ca7f6078-e665-4e13-a53a-8568c1f07461",
    behaviors: [Lamp, LampSlab, LampStairs],
  },
  "46899f47-9cdb-489d-991f-bc844f5674c7": {
    name: "Cubes",
    description: "Experimental cube shapes",
    moduleId: "311336ba-c755-46fb-a17a-15e76b477c23",
    behaviors: [LampCube, CornerLamp],
  },
  "dcb61a9c-b20b-485a-82d3-d3febf39f2cf": {
    name: "Glass",
    description: "Transparent glass blocks and shapes",
    moduleId: "394e357c-206d-4144-a4e3-7a351465a149",
    behaviors: [Glass, GlassSlab, GlassCarpet, GlassStairs],
  },
  "5d246811-33e8-4d99-b890-2ade632071f8": {
    name: "Plate Lamps",
    description: "Experimental metallic blocks with lights",
    moduleId: "c264bf45-0d67-4678-a0e5-7b1f7d533672",
    behaviors: [PlateLamp],
  },
  "3aca17a9-310f-4b80-8e65-8862cf120633": {
    name: "Line Blocks",
    description: "Experimental line blocks",
    moduleId: "fd62ec4d-dd4e-4cdf-b981-99f114e307c2",
    behaviors: [LineBlock],
  },
  "ca6a98f4-9fe1-464e-8152-a41463c496e1": {
    name: "Checker Lamps",
    description: "Fancy checkered and multi-color glowing blocks",
    moduleId: "220f2224-f48f-46e5-820b-8245ee8c152a",
    behaviors: [CheckerLamp, QuadColorLamp],
  },
  "d39d9441-8c57-4643-9bce-2300c8134459": {
    name: "Slant Blocks",
    description: "Experimental slanted blocks",
    moduleId: "78d3c5ba-734d-4f9c-934d-d1c5cbd10f2f",
    behaviors: [SlantBlock],
  },
  "4e318767-b549-43e7-b593-d033b10fcd8d": {
    name: "Biomes",
    description: "Experimental biomes",
    moduleId: "3d2259bd-2fb5-4ee1-9e95-bcc06ae914d9",
    behaviors: [],
  },
};

const packIcon = join(ROOT_DIR, "src/pack_icon.png");

await Promise.all(
  Object.entries(behaviorPacks).map(
    async ([bpId, { name, description, moduleId }]) => {
      const dir = join(BP_DIR, `${NAMESPACE} ${name}`);
      await ensureDir(dir);
      await ensureDir(join(dir, "blocks"));

      const manifest = {
        format_version: 2,
        header: {
          name: `RAINBOW III!!!: ${name}`,
          description: `RAINBOW behavior pack addon: ${description}`,
          version: [3, 1, 0],
          min_engine_version: [1, 21, 0],
          uuid: bpId,
        },
        modules: [
          {
            type: "data",
            uuid: moduleId,
            version: [3, 1, 0],
          },
        ],
        dependencies: [
          {
            uuid: RP_UUID,
            version: [3, 1, 0],
          },
        ],
      };

      await writeFile(
        join(dir, "manifest.json"),
        JSON.stringify(manifest, null, 2),
        "utf-8",
      );

      await copyFile(packIcon, join(dir, "pack_icon.png"));
    },
  ),
);

const blocks: Record<string, DecorativeBlock[]> = {};
const texts: Record<string, string> = {};

const colors: Record<string, IColor> = {
  blue: {
    complimentary: "orange",
    secondary: "light_blue",
    tertiary: "cyan",
    complimentaryHex: "#FFA500",
    secondaryHex: "#ADD8E6",
    tertiaryHex: "#00FFFF",
  },
  brown: {
    complimentary: "light_blue",
    secondary: "green",
    tertiary: "red",
    complimentaryHex: "#ADD8E6",
    secondaryHex: "#008000",
    tertiaryHex: "#FF0000",
  },
  cyan: {
    complimentary: "red",
    secondary: "blue",
    tertiary: "yellow",
    complimentaryHex: "#FF0000",
    secondaryHex: "#0000FF",
    tertiaryHex: "#FFFF00",
  },
  gray: {
    complimentary: "light_gray",
    secondary: "light_blue",
    tertiary: "brown",
    complimentaryHex: "#D3D3D3",
    secondaryHex: "#ADD8E6",
    tertiaryHex: "#A52A2A",
  },
  green: {
    complimentary: "pink",
    secondary: "lime",
    tertiary: "magenta",
    complimentaryHex: "#FFC0CB",
    secondaryHex: "#00FF00",
    tertiaryHex: "#FF00FF",
  },
  light_blue: {
    complimentary: "brown",
    secondary: "cyan",
    tertiary: "gray",
    complimentaryHex: "#A52A2A",
    secondaryHex: "#00FFFF",
    tertiaryHex: "#808080",
  },
  light_gray: {
    complimentary: "gray",
    secondary: "brown",
    tertiary: "light_blue",
    complimentaryHex: "#808080",
    secondaryHex: "#A52A2A",
    tertiaryHex: "#ADD8E6",
  },
  lime: {
    complimentary: "magenta",
    secondary: "green",
    tertiary: "pink",
    complimentaryHex: "#FF00FF",
    secondaryHex: "#008000",
    tertiaryHex: "#FFC0CB",
  },
  magenta: {
    complimentary: "lime",
    secondary: "pink",
    tertiary: "green",
    complimentaryHex: "#00FF00",
    secondaryHex: "#FFC0CB",
    tertiaryHex: "#008000",
  },
  orange: {
    complimentary: "blue",
    secondary: "yellow",
    tertiary: "red",
    complimentaryHex: "#0000FF",
    secondaryHex: "#FFFF00",
    tertiaryHex: "#FF0000",
  },
  pink: {
    complimentary: "green",
    secondary: "magenta",
    tertiary: "lime",
    complimentaryHex: "#008000",
    secondaryHex: "#FF00FF",
    tertiaryHex: "#00FF00",
  },
  purple: {
    complimentary: "yellow",
    secondary: "red",
    tertiary: "blue",
    complimentaryHex: "#FFFF00",
    secondaryHex: "#FF0000",
    tertiaryHex: "#0000FF",
  },
  red: {
    complimentary: "cyan",
    secondary: "orange",
    tertiary: "yellow",
    complimentaryHex: "#00FFFF",
    secondaryHex: "#FFA500",
    tertiaryHex: "#FFFF00",
  },
  yellow: {
    complimentary: "purple",
    secondary: "red",
    tertiary: "blue",
    complimentaryHex: "#800080",
    secondaryHex: "#FF0000",
    tertiaryHex: "#0000FF",
  },
};

const shades: Shades[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const colorKeys = Object.keys(colors);

const bps = Object.entries(behaviorPacks);

await Promise.all(
  colorKeys.map(
    async (color, colorIdx, keys) =>
      await Promise.all(
        shades.map(async (shade, shadeIdx) => {
          const imgFile = join(
            RP_DIR,
            "subpacks",
            "16x",
            "textures",
            "blocks",
            `${color}_${shade}_block_basecolor.png`,
          );

          const img = await Image.decode(await readFile(imgFile));

          const averageColor = Image.colorToRGB(img.averageColor());

          const hexColor = `#${averageColor
            .map((c) => c.toString(16).padStart(2, "0"))
            .join("")}`;

          for (const [bpId, { behaviors }] of bps) {
            blocks[bpId] = blocks[bpId] ?? [];

            for (const BehaviorBlock of behaviors) {
              const colorName = `${color
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")} ${shade}`;
              const Block = new BehaviorBlock(
                {
                  color: colorName,
                  id: `${color}_${shade}`,
                  shades,
                  complimentary: `${NAMESPACE}_${colors[color].complimentary}_${shade}`,
                  secondary: `${NAMESPACE}_${colors[color].secondary}_${shade}`,
                  tertiary: `${NAMESPACE}_${colors[color].tertiary}_${shade}`,
                  nextShade: shades[shadeIdx + 1] ?? shades[0],
                  nextColor:
                    colorIdx >= keys.length
                      ? `${keys[0]}_${shade}`
                      : `${keys[colorIdx + 1]}_${shade}`,
                },
                hexColor,
              );
              texts[Block.textId] = Block.title;

              await Block.save(
                join(BP_DIR, `${NAMESPACE} ${behaviorPacks[bpId].name}`),
              );
              blocks[bpId].push(Block);
            }
          }
        }),
      ),
  ),
);

// Biomes
// Create coherent themed biomes based on color harmony principles
// Colors are grouped into climate zones with smooth transitions

const biomes: IBiome[] = [];

/**
 * Generate biomes using themed approach:
 * - Each theme covers 2-3 related colors
 * - Shades create depth variation within each theme
 * - Climate values ensure coherent world placement
 */
function generateThemedBiomes(): IBiome[] {
  const result: IBiome[] = [];

  for (const theme of BIOME_THEMES) {
    const noiseScale = getNoiseFrequencyForTheme(theme);

    // Generate biomes for each color in this theme's blend
    for (const color of theme.colorBlend) {
      for (const shade of shades) {
        const palette = getHarmoniousPalette(color as ColorName, shade);
        const zone = COLOR_ZONES[color as ColorName];
        const climate = getClimateFromShade(shade, zone);
        const atmosphere = getAtmosphereColors(color as ColorName, shade);

        // Get adjacent shades for layer materials
        const shadeIdx = shades.indexOf(shade);
        const prevShade = shades[shadeIdx - 1] ?? shades[shades.length - 1];
        const nextShade = shades[shadeIdx + 1] ?? shades[0];

        // Use theme-coherent colors for foundation layers
        const foundationColor = palette.secondary;
        const seaFloorColor = palette.tertiary;
        const waterColor = palette.water;

        const biomeId = `${color}_${shade}`;

        const biome: IBiome = {
          biomeId,
          climate: {
            downfall: climate.downfall,
            snow_accumulation: climate.temperature < 0.3 ? [0.1, 0.5] : [0, 0],
            temperature: climate.temperature,
            ash: 0,
            blue_spores: 0,
            red_spores: 0,
            white_ash: 0,
          },
          height: {
            noise_type: "default",
            noise_params: [0, 10],
          },
          surface: {
            sea_floor_depth: 2,
            // Sea floor uses tertiary color from palette for cohesion
            sea_floor_material: `${NAMESPACE}:${seaFloorColor}_${nextShade}_plate`,
            // Foundation uses secondary color - creates gradient as you dig
            foundation_material: `${NAMESPACE}:${foundationColor}_${shade}_block`,
            // Mid layer uses lighter shade of primary for visual depth
            mid_material: `${NAMESPACE}:${color}_${prevShade}_block`,
            // Top is the primary biome color
            top_material: `${NAMESPACE}:${color}_${shade}_block`,
            // Water uses palette water color for thematic consistency
            sea_material: `${NAMESPACE}:${waterColor}_${nextShade}_lamp`,
            floor_depth: 1,
            floor_material: `${NAMESPACE}:${color}_${shade}_lit`,
          },
          tags: ["overworld", theme.name],
          overworld_generation_rules: {
            // Climate-based generation for coherent world placement
            generate_for_climates:
              zone === "warm"
                ? ([
                    ["warm", 1.0],
                    ["medium", 0.3],
                  ] as [string, number][])
                : zone === "cool"
                  ? ([
                      ["cold", 0.8],
                      ["frozen", 0.5],
                      ["medium", 0.2],
                    ] as [string, number][])
                  : zone === "neutral"
                    ? ([
                        ["medium", 0.8],
                        ["warm", 0.3],
                        ["cold", 0.3],
                      ] as [string, number][])
                    : ([
                        ["medium", 0.6],
                        ["warm", 0.5],
                        ["cold", 0.4],
                      ] as [string, number][]),
          },
          // Theme-specific noise frequency for coherent region sizes
          replace_biomes: {
            replacements: [
              {
                amount: 1,
                dimension: "minecraft:overworld",
                noise_frequency_scale: noiseScale,
                targets: ["minecraft:plains", "minecraft:forest"],
              },
            ],
          },
          colors: {
            sky_color: atmosphere.skyColor,
            water_surface_color: atmosphere.waterSurfaceColor,
            water_fog_color: atmosphere.waterFogColor,
            fog_color: atmosphere.fogColor,
          },
        };

        result.push(biome);
      }
    }
  }

  return result;
}

// Generate themed biomes with coherent color schemes
const themedBiomes = generateThemedBiomes();

// Also generate remaining colors not covered by themes (if any)
const themedColors = new Set(BIOME_THEMES.flatMap((t) => t.colorBlend));
const remainingColors = colorKeys.filter(
  (c): c is ColorName => !themedColors.has(c as ColorName),
);

for (const color of remainingColors) {
  for (const shade of shades) {
    const palette = getHarmoniousPalette(color, shade);
    const zone = COLOR_ZONES[color];
    const climate = getClimateFromShade(shade, zone);
    const atmosphere = getAtmosphereColors(color, shade);

    const shadeIdx = shades.indexOf(shade);
    const prevShade = shades[shadeIdx - 1] ?? shades[shades.length - 1];
    const nextShade = shades[shadeIdx + 1] ?? shades[0];

    biomes.push({
      biomeId: `${color}_${shade}`,
      climate: {
        downfall: climate.downfall,
        snow_accumulation: climate.temperature < 0.3 ? [0.1, 0.5] : [0, 0],
        temperature: climate.temperature,
        ash: 0,
        blue_spores: 0,
        red_spores: 0,
        white_ash: 0,
      },
      height: {
        noise_type: "default",
        noise_params: [0, 10],
      },
      surface: {
        sea_floor_depth: 2,
        sea_floor_material: `${NAMESPACE}:${palette.tertiary}_${nextShade}_plate`,
        foundation_material: `${NAMESPACE}:${palette.secondary}_${shade}_block`,
        mid_material: `${NAMESPACE}:${color}_${prevShade}_block`,
        top_material: `${NAMESPACE}:${color}_${shade}_block`,
        sea_material: `${NAMESPACE}:${palette.water}_${nextShade}_lamp`,
        floor_depth: 1,
        floor_material: `${NAMESPACE}:${color}_${shade}_lit`,
      },
      tags: ["overworld"],
      colors: {
        sky_color: atmosphere.skyColor,
        water_surface_color: atmosphere.waterSurfaceColor,
        water_fog_color: atmosphere.waterFogColor,
        fog_color: atmosphere.fogColor,
      },
    });
  }
}

// Combine themed and remaining biomes
biomes.push(...themedBiomes);

await buildBiomes(biomes);

const lang = Object.entries(texts)
  .map(([key, value]) => `${key}=${value}`)
  .join("\n");

await writeFile(join(RP_DIR, "texts", "en_US.lang"), lang);

const paddings = [8, 4, 2, 1, 0];

const terrainAtlas = {
  resource_pack_name: NAMESPACE,
  texture_name: "atlas.terrain",
  padding: 8,
  num_mip_levels: 4,
  texture_data: Object.fromEntries(
    Object.values(blocks)
      .flat()
      .map(({ blockId, textureId }) => [
        textureId,
        {
          textures: `textures/blocks/${textureId}`,
        },
      ]),
  ),
};

async function addOpacity(size: number, baseColor: string) {
  const baseImage = await Image.decode(
    await readFile(
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

  await writeFile(
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

const blocksData = Object.fromEntries(
  Object.values(blocks)
    .flat()
    .map(({ blockId, block, textureId }) => [
      blockId,
      {
        ambient_occlusion_exponent: 1,
        sound: block.sound,
        carried_texture: `textures/blocks/${textureId}_carried.png`,
      },
    ]),
);
try {
  await writeFile(
    join(RP_DIR, "blocks.json"),
    JSON.stringify(
      {
        format_version: "1.21.40",
        ...blocksData,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error("Failed to write blocks.json:", error);
}

await Promise.all(
  sizes.map(async (size, idx) => {
    const sizeDir = join(RP_DIR, "subpacks", `${size}x`);

    // await copy(
    //   join(RP_DIR, "models", "blocks"),
    //   join(sizeDir, "models", "blocks"),
    // );

    // Resize every image in this directory to the appropriate size
    const texturesDir = join(sizeDir, "textures", "blocks");

    await ensureDir(texturesDir);

    const files = await readdir(texturesDir, {
      recursive: true,
    });

    await Promise.all(
      files.map(async (file) => {
        // Ensure file name is lowercase
        if (file !== file.toLowerCase()) {
          await rename(file, file.toLowerCase());
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

        const isIsotropic =
          Object.values(blocks)
            .flat()
            .find(({ name }) => name === blockName)?.block.isotropic ?? false;

        const depth = isIsotropic
          ? {
              heightmap: `${blockName}_height`,
            }
          : {
              normal: `${blockName}_normal`,
            };

        await writeFile(
          join(texturesDir, `${NAMESPACE}_${blockName}.texture_set.json`),
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
      }),
    );

    const terrainAtlasForSize = {
      ...terrainAtlas,
      padding: paddings[idx],
      num_mip_levels: Math.floor(paddings[idx] * 0.5),
    };

    await writeFile(
      join(RP_DIR, "subpacks", `${size}x`, "textures", "terrain_texture.json"),
      JSON.stringify(terrainAtlasForSize, null, 2),
    );

    const textDir = join(RP_DIR, "subpacks", `${size}x`, "texts");

    await ensureDir(textDir);

    await writeFile(join(textDir, "en_US.lang"), lang);
  }),
);

await writeFile(
  join(process.cwd(), "db.json"),
  JSON.stringify(
    Object.fromEntries(
      Object.values(blocks)
        .flat()
        .map(({ blockId, hexColor }) => [blockId, hexColor]),
    ),
    null,
    2,
  ),
);

// Create lighting/global.json
const lightingDir = join(RP_DIR, "lighting");
await ensureDir(lightingDir);

await writeFile(
  join(lightingDir, "global.json"),
  JSON.stringify(
    {
      format_version: "1.21.80",
      "minecraft:lighting_settings": {
        description: {
          identifier: `${NAMESPACE}:default_lighting`,
        },
        directional_lights: {
          orbital: {
            sun: {
              illuminance: {
                "0.0": 109880.0, // Noon
                "0.25": 20000.0, // Sunset
                "0.35": 400.0,
                "0.5": 1.0, // Midnight
                "0.65": 400.0,
                "0.75": 20000.0, // Sunrise
                "1.0": 109880.0,
              },
              color: [255.0, 255.0, 255.0],
            },
            moon: {
              illuminance: 0.27,
              color: [255.0, 255.0, 255.0],
            },
            orbital_offset_degrees: 41.25,
          },
          flash: {
            illuminance: 5.0,
            color: [255.0, 255.0, 255.0],
          },
        },
        emissive: {
          desaturation: 0.1,
        },
        ambient: {
          illuminance: 0.02,
          color: [255.0, 255.0, 255.0],
        },
        sky: {
          intensity: 1.0,
        },
      },
    },
    null,
    2,
  ),
);

// Create local_lighting/local_lighting.json (renamed from point_lights/global.json in 1.21.110)
const localLightingDir = join(RP_DIR, "local_lighting");
await ensureDir(localLightingDir);

// Build local light settings with the new schema format
// Include both lit and lamp blocks - the RP now depends on rainbow Lit Blocks BP
const lightBlocks = Object.values(blocks)
  .flat()
  .filter((b) => b.blockId.endsWith("lit") || b.blockId.endsWith("lamp"));

const localLightSettings: Record<
  string,
  { light_color: string; light_type: string }
> = {};
for (const { blockId, hexColor } of lightBlocks) {
  localLightSettings[`${NAMESPACE}:${blockId}`] = {
    light_color: hexColor,
    light_type: "static_light",
  };
}

await writeFile(
  join(localLightingDir, "local_lighting.json"),
  JSON.stringify(
    {
      format_version: "1.21.40",
      "minecraft:local_light_settings": localLightSettings,
    },
    null,
    2,
  ),
);

// Create pbr/global.json
const pbrDir = join(RP_DIR, "pbr");
await ensureDir(pbrDir);

await writeFile(
  join(pbrDir, "global.json"),
  JSON.stringify(
    {
      format_version: "1.21.40",
      "minecraft:pbr_fallback_settings": {
        blocks: {
          global_metalness_emissive_roughness_subsurface: [
            0.0, 0.0, 255.0, 0.0,
          ],
        },
        actors: {
          global_metalness_emissive_roughness_subsurface: [
            0.0, 0.0, 255.0, 0.0,
          ],
        },
        particles: {
          global_metalness_emissive_roughness_subsurface: [
            0.0, 0.0, 255.0, 0.0,
          ],
        },
        items: {
          global_metalness_emissive_roughness_subsurface: [
            0.0, 0.0, 255.0, 0.0,
          ],
        },
      },
    },
    null,
    2,
  ),
);

await buildJava({ namespace: NAMESPACE, blocks, texts, colors });
