/**
 * Fabric 1.21.10 Resource Generator
 *
 * Generates all JSON assets (blockstates, models, language files) for the
 * Rainbow III Fabric mod. Also handles texture copying from Bedrock subpacks.
 */

import { writeFile, readFile, readdir, mkdir, copyFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { ensureDir, copy } from "fs-extra";
import type DecorativeBlock from "./behaviors/DecorativeBlock.ts";

const ROOT_DIR = process.cwd();
const FABRIC_DIR = join(ROOT_DIR, "java", "fabric-1.21.10");
const ASSETS_DIR = join(FABRIC_DIR, "src", "main", "resources", "assets", "rainbow");
const BEDROCK_TEXTURES = join(ROOT_DIR, "bedrock", "RP", "subpacks");

// Block types to generate
const BLOCK_TYPES = [
  "block",
  "lamp",
  "lamp_slab",
  "lamp_stairs",
  "glass",
  "glass_slab",
  "plate",
] as const;

type BlockType = (typeof BLOCK_TYPES)[number];

// Colors matching RainbowColors.java
const COLORS = [
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
  "yellow",
] as const;

// Shades matching RainbowColors.java
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

interface BuildFabricParams {
  namespace: string;
  blocks: Record<string, DecorativeBlock[]>;
  texts: Record<string, string>;
  colors: Record<string, { complimentary: string; secondary: string; tertiary: string }>;
}

/**
 * Main entry point for Fabric resource generation.
 */
export async function buildFabric(params: BuildFabricParams) {
  console.log("Building Fabric 1.21.10 resources...");

  // Ensure directories exist
  await ensureDir(join(ASSETS_DIR, "blockstates"));
  await ensureDir(join(ASSETS_DIR, "models", "block"));
  await ensureDir(join(ASSETS_DIR, "models", "item"));
  await ensureDir(join(ASSETS_DIR, "items")); // New in 1.21.4
  await ensureDir(join(ASSETS_DIR, "textures", "block"));
  await ensureDir(join(ASSETS_DIR, "lang"));

  // Generate all resources
  await generateBlockstates();
  await generateBlockModels();
  await generateItemModels();
  await generateItemDefinitions(); // New in 1.21.4
  await generateLanguageFile(params.texts);
  await copyTextures("16");

  console.log("Fabric resources generated successfully!");
}

/**
 * Generates blockstate JSON files for all block variants.
 */
async function generateBlockstates() {
  console.log("Generating blockstates...");

  for (const color of COLORS) {
    for (const shade of SHADES) {
      for (const type of BLOCK_TYPES) {
        const id = `${color}_${shade}_${type}`;
        const blockstate = generateBlockstateJson(id, type);
        await writeFile(
          join(ASSETS_DIR, "blockstates", `${id}.json`),
          JSON.stringify(blockstate, null, 2)
        );
      }
    }
  }
}

/**
 * Generates a single blockstate JSON based on block type.
 */
function generateBlockstateJson(id: string, type: BlockType): object {
  const modelPath = `rainbow:block/${id}`;

  switch (type) {
    case "lamp_slab":
    case "glass_slab":
      return {
        variants: {
          "type=bottom": { model: modelPath },
          "type=top": { model: `${modelPath}_top` },
          "type=double": { model: modelPath.replace("_slab", "") },
        },
      };

    case "lamp_stairs":
      return generateStairsBlockstate(id);

    default:
      // Simple single-variant blockstate
      return {
        variants: {
          "": { model: modelPath },
        },
      };
  }
}

/**
 * Generates stairs blockstate with all rotation variants.
 */
function generateStairsBlockstate(id: string): object {
  const model = `rainbow:block/${id}`;
  const inner = `rainbow:block/${id}_inner`;
  const outer = `rainbow:block/${id}_outer`;

  return {
    variants: {
      "facing=east,half=bottom,shape=inner_left": { model: inner, y: 270, uvlock: true },
      "facing=east,half=bottom,shape=inner_right": { model: inner },
      "facing=east,half=bottom,shape=outer_left": { model: outer, y: 270, uvlock: true },
      "facing=east,half=bottom,shape=outer_right": { model: outer },
      "facing=east,half=bottom,shape=straight": { model },
      "facing=east,half=top,shape=inner_left": { model: inner, x: 180, uvlock: true },
      "facing=east,half=top,shape=inner_right": { model: inner, x: 180, y: 90, uvlock: true },
      "facing=east,half=top,shape=outer_left": { model: outer, x: 180, uvlock: true },
      "facing=east,half=top,shape=outer_right": { model: outer, x: 180, y: 90, uvlock: true },
      "facing=east,half=top,shape=straight": { model, x: 180, uvlock: true },
      "facing=north,half=bottom,shape=inner_left": { model: inner, y: 180, uvlock: true },
      "facing=north,half=bottom,shape=inner_right": { model: inner, y: 270, uvlock: true },
      "facing=north,half=bottom,shape=outer_left": { model: outer, y: 180, uvlock: true },
      "facing=north,half=bottom,shape=outer_right": { model: outer, y: 270, uvlock: true },
      "facing=north,half=bottom,shape=straight": { model, y: 270, uvlock: true },
      "facing=north,half=top,shape=inner_left": { model: inner, x: 180, y: 270, uvlock: true },
      "facing=north,half=top,shape=inner_right": { model: inner, x: 180, uvlock: true },
      "facing=north,half=top,shape=outer_left": { model: outer, x: 180, y: 270, uvlock: true },
      "facing=north,half=top,shape=outer_right": { model: outer, x: 180, uvlock: true },
      "facing=north,half=top,shape=straight": { model, x: 180, y: 270, uvlock: true },
      "facing=south,half=bottom,shape=inner_left": { model: inner },
      "facing=south,half=bottom,shape=inner_right": { model: inner, y: 90, uvlock: true },
      "facing=south,half=bottom,shape=outer_left": { model: outer },
      "facing=south,half=bottom,shape=outer_right": { model: outer, y: 90, uvlock: true },
      "facing=south,half=bottom,shape=straight": { model, y: 90, uvlock: true },
      "facing=south,half=top,shape=inner_left": { model: inner, x: 180, y: 90, uvlock: true },
      "facing=south,half=top,shape=inner_right": { model: inner, x: 180, y: 180, uvlock: true },
      "facing=south,half=top,shape=outer_left": { model: outer, x: 180, y: 90, uvlock: true },
      "facing=south,half=top,shape=outer_right": { model: outer, x: 180, y: 180, uvlock: true },
      "facing=south,half=top,shape=straight": { model, x: 180, y: 90, uvlock: true },
      "facing=west,half=bottom,shape=inner_left": { model: inner, y: 90, uvlock: true },
      "facing=west,half=bottom,shape=inner_right": { model: inner, y: 180, uvlock: true },
      "facing=west,half=bottom,shape=outer_left": { model: outer, y: 90, uvlock: true },
      "facing=west,half=bottom,shape=outer_right": { model: outer, y: 180, uvlock: true },
      "facing=west,half=bottom,shape=straight": { model, y: 180, uvlock: true },
      "facing=west,half=top,shape=inner_left": { model: inner, x: 180, y: 180, uvlock: true },
      "facing=west,half=top,shape=inner_right": { model: inner, x: 180, y: 270, uvlock: true },
      "facing=west,half=top,shape=outer_left": { model: outer, x: 180, y: 180, uvlock: true },
      "facing=west,half=top,shape=outer_right": { model: outer, x: 180, y: 270, uvlock: true },
      "facing=west,half=top,shape=straight": { model, x: 180, y: 180, uvlock: true },
    },
  };
}

/**
 * Gets the texture ID for a given block type.
 * Maps block types to their actual texture files.
 */
function getTextureIdForType(color: string, shade: number, type: BlockType): string {
  switch (type) {
    case "block":
      return `${color}_${shade}_block`;
    case "lamp":
    case "lamp_slab":
    case "lamp_stairs":
      return `${color}_${shade}_lamp`;
    case "glass":
    case "glass_slab":
      return `${color}_${shade}_glass`;
    case "plate":
      return `${color}_${shade}_plate`;
    default:
      return `${color}_${shade}_block`;
  }
}

/**
 * Generates block model JSON files.
 */
async function generateBlockModels() {
  console.log("Generating block models...");

  for (const color of COLORS) {
    for (const shade of SHADES) {
      for (const type of BLOCK_TYPES) {
        const id = `${color}_${shade}_${type}`;
        const textureId = getTextureIdForType(color, shade, type);

        await generateBlockModel(id, type, textureId);
      }
    }
  }
}

/**
 * Generates a single block model based on type.
 */
async function generateBlockModel(id: string, type: BlockType, textureId: string) {
  const modelsDir = join(ASSETS_DIR, "models", "block");
  const texture = `rainbow:block/${textureId}`;

  switch (type) {
    case "lamp_slab":
    case "glass_slab":
      // Bottom slab
      await writeFile(
        join(modelsDir, `${id}.json`),
        JSON.stringify({
          parent: "minecraft:block/slab",
          textures: { bottom: texture, top: texture, side: texture },
        }, null, 2)
      );
      // Top slab
      await writeFile(
        join(modelsDir, `${id}_top.json`),
        JSON.stringify({
          parent: "minecraft:block/slab_top",
          textures: { bottom: texture, top: texture, side: texture },
        }, null, 2)
      );
      break;

    case "lamp_stairs":
      // Main stairs
      await writeFile(
        join(modelsDir, `${id}.json`),
        JSON.stringify({
          parent: "minecraft:block/stairs",
          textures: { bottom: texture, top: texture, side: texture },
        }, null, 2)
      );
      // Inner corner
      await writeFile(
        join(modelsDir, `${id}_inner.json`),
        JSON.stringify({
          parent: "minecraft:block/inner_stairs",
          textures: { bottom: texture, top: texture, side: texture },
        }, null, 2)
      );
      // Outer corner
      await writeFile(
        join(modelsDir, `${id}_outer.json`),
        JSON.stringify({
          parent: "minecraft:block/outer_stairs",
          textures: { bottom: texture, top: texture, side: texture },
        }, null, 2)
      );
      break;

    default:
      // Simple cube_all model
      await writeFile(
        join(modelsDir, `${id}.json`),
        JSON.stringify({
          parent: "minecraft:block/cube_all",
          textures: { all: texture },
        }, null, 2)
      );
  }
}

/**
 * Generates item model JSON files (models/item/).
 * These define the 3D model structure for items.
 */
async function generateItemModels() {
  console.log("Generating item models...");

  for (const color of COLORS) {
    for (const shade of SHADES) {
      for (const type of BLOCK_TYPES) {
        const id = `${color}_${shade}_${type}`;

        const model = {
          parent: `rainbow:block/${id}`,
        };

        await writeFile(
          join(ASSETS_DIR, "models", "item", `${id}.json`),
          JSON.stringify(model, null, 2)
        );
      }
    }
  }
}

/**
 * Generates item model definition files (items/).
 * NEW IN 1.21.4: These files tell Minecraft which model to use for each item.
 * Without these, items show missing texture in inventory/hand.
 */
async function generateItemDefinitions() {
  console.log("Generating item definitions (1.21.4+)...");

  for (const color of COLORS) {
    for (const shade of SHADES) {
      for (const type of BLOCK_TYPES) {
        const id = `${color}_${shade}_${type}`;

        // Item definition format for 1.21.4+
        // References the block model directly since BlockItems use block models
        const definition = {
          model: {
            type: "minecraft:model",
            model: `rainbow:block/${id}`,
          },
        };

        await writeFile(
          join(ASSETS_DIR, "items", `${id}.json`),
          JSON.stringify(definition, null, 2)
        );
      }
    }
  }
}

/**
 * Generates the language file with all block names and item group names.
 */
async function generateLanguageFile(bedrockTexts: Record<string, string>) {
  console.log("Generating language file...");

  const lang: Record<string, string> = {
    // Type-based item groups
    "itemGroup.rainbow.blocks": "Rainbow Blocks",
    "itemGroup.rainbow.lamps": "Rainbow Lamps",
    "itemGroup.rainbow.glass": "Rainbow Glass",
    "itemGroup.rainbow.plates": "Rainbow Plates",
  };

  // Color-based item groups
  for (const color of COLORS) {
    const colorName = color
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    lang[`itemGroup.rainbow.color.${color}`] = `Rainbow ${colorName}`;
  }

  // Generate block names
  for (const color of COLORS) {
    const colorName = color
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    for (const shade of SHADES) {
      for (const type of BLOCK_TYPES) {
        const id = `${color}_${shade}_${type}`;
        const typeName = type
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        lang[`block.rainbow.${id}`] = `${colorName} ${shade} ${typeName}`;
      }
    }
  }

  await writeFile(
    join(ASSETS_DIR, "lang", "en_us.json"),
    JSON.stringify(lang, null, 2)
  );
}

/**
 * Copies textures from Bedrock subpacks to Fabric assets.
 */
async function copyTextures(size: string) {
  console.log(`Copying ${size}x textures...`);

  const sourceDir = join(BEDROCK_TEXTURES, `${size}x`, "textures", "blocks");
  const destDir = join(ASSETS_DIR, "textures", "block");

  try {
    const files = await readdir(sourceDir);

    for (const file of files) {
      if (!file.endsWith(".png")) continue;

      // Only copy basecolor textures (the main texture for Java)
      if (file.includes("_basecolor.png")) {
        const blockName = file.replace("_basecolor.png", "");
        // Map to Java-style name (remove "rainbow_" prefix if present)
        const javaName = blockName.replace(/^rainbow_/, "") + ".png";

        await copyFile(join(sourceDir, file), join(destDir, javaName));
      }
    }

    console.log(`Copied textures to ${destDir}`);
  } catch (error) {
    console.error("Error copying textures:", error);
  }
}

/**
 * Generates HD texture resource packs.
 */
export async function generateHDResourcePacks(sizes: number[]) {
  console.log("Generating HD resource packs...");

  for (const size of sizes) {
    if (size === 16) continue; // 16x is included in main mod

    const packDir = join(FABRIC_DIR, "resourcepacks", `rainbow-${size}x`);
    const texturesDir = join(packDir, "assets", "rainbow", "textures", "block");

    await ensureDir(texturesDir);

    // Create pack.mcmeta
    await writeFile(
      join(packDir, "pack.mcmeta"),
      JSON.stringify({
        pack: {
          pack_format: 34, // 1.21.x
          description: `Rainbow III ${size}x Textures`,
        },
      }, null, 2)
    );

    // Copy textures
    await copyTextures(String(size));
  }
}

/**
 * Copies HD textures to a resource pack directory.
 */
async function copyHDTextures(size: string, packDir: string) {
  const sourceDir = join(BEDROCK_TEXTURES, `${size}x`, "textures", "blocks");
  const destDir = join(packDir, "assets", "rainbow", "textures", "block");

  await ensureDir(destDir);

  try {
    const files = await readdir(sourceDir);

    for (const file of files) {
      if (!file.endsWith(".png")) continue;

      if (file.includes("_basecolor.png")) {
        const blockName = file.replace("_basecolor.png", "");
        const javaName = blockName.replace(/^rainbow_/, "") + ".png";
        await copyFile(join(sourceDir, file), join(destDir, javaName));
      }
    }

    console.log(`Copied ${size}x textures to ${destDir}`);
  } catch (error) {
    console.error(`Error copying ${size}x textures:`, error);
  }
}

/**
 * Generates all HD resource packs.
 */
async function generateAllHDPacks() {
  const sizes = [32, 64, 128, 256];

  for (const size of sizes) {
    const packDir = join(FABRIC_DIR, "resourcepacks", `rainbow-${size}x`);
    await ensureDir(packDir);

    // Create pack.mcmeta if it doesn't exist
    const packMeta = join(packDir, "pack.mcmeta");
    try {
      await readFile(packMeta);
    } catch {
      await writeFile(
        packMeta,
        JSON.stringify({
          pack: {
            pack_format: 34,
            description: `Rainbow III ${size}x HD Textures`,
          },
        }, null, 2)
      );
    }

    await copyHDTextures(String(size), packDir);
  }
}

// Run standalone if executed directly
if (import.meta.main) {
  await buildFabric({
    namespace: "rainbow",
    blocks: {},
    texts: {},
    colors: {},
  });

  // Also generate HD resource packs
  await generateAllHDPacks();
}
