import type {
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
  PackSizes,
} from "/typings/types.ts";
import type BlockEntry from "/src/components/BlockEntry.ts";
import { COMPRESSION_LEVEL } from "/typings/constants.ts";
import { EOL } from "fs/mod.ts";
import { join } from "path/mod.ts";
import { JSZip } from "jszip/mod.ts";
import { Image } from "imagescript/mod.ts";
import { calculateMipLevels } from "/src/components/_resize.ts";

const zip = new JSZip();
const rp = zip.folder("rp");
const bp = zip.folder("bp");
const texturesDirectory = rp.folder("textures/blocks");
const blocksDirectory = bp.folder("blocks");

const blocksJson: MinecraftData = {};

const textureData: MinecraftTerrainData = {};
export const languages: LanguagesContainer = {
  en_US: [],
};

function sanitizeFilename(filepath: string) {
  return filepath.trim().toLowerCase().replaceAll(/\s+/g, "_");
}

export async function addBlock(block: BlockEntry, size: PackSizes) {
  blocksJson[block.behaviorId] = block.blocksData;
  textureData[block.resourceId] = block.terrainData;
  blocksDirectory.addFile(`${block.id}.json`, block.toString());
  await addTextureSet(block, size);

  // Get translation for each language
  for (const languageKey in languages) {
    languages[<LanguageId> languageKey].push(
      block.language(<LanguageId> languageKey),
    );
  }
}

export function requireTexture(textureFileName: string, contents: Uint8Array) {
  // Include in archive
  return texturesDirectory.file(textureFileName) ||
    texturesDirectory.addFile(textureFileName, contents);
}

/**
 * Load a normal map from `assets/materials/` directory and add it to the resource pack
 * @param name Normal map name without extension
 * @param size Normal map's dimension in pixels
 */
export async function requireMaterialAsset(name: string, size: PackSizes) {
  const fileName = `${name}.png`;
  const filePath = join(
    Deno.cwd(),
    "src",
    "assets",
    "materials",
    fileName,
  );

  try {
    const asset = await Image.decode(
      await Deno.readFile(filePath),
    );

    // Manipulate the image here:
    asset.resize(size, size);

    texturesDirectory.addFile(fileName, await asset.encode(COMPRESSION_LEVEL));
  } catch (err) {
    console.error("Failed adding asset '%s': %s", filePath, err);
  }
}

export async function addTextureSet(block: BlockEntry, size: PackSizes) {
  const isColor =
    ((color: string | number[]) =>
      `${color}`[0] === "#" || Array.isArray(color));

  if (!isColor(block.textureSet.color)) {
    await requireMaterialAsset(`${block.textureSet.color}`, size);
  }

  if (!isColor(block.textureSet.metalness_emissive_roughness || "")) {
    await requireMaterialAsset(
      `${block.textureSet.metalness_emissive_roughness}`,
      size,
    );
  }

  if (block.textureSet.normal) {
    await requireMaterialAsset(block.textureSet.normal, size);
  } else if (block.textureSet.heightmap) {
    await requireMaterialAsset(block.textureSet.heightmap, size);
  }

  return texturesDirectory.addFile(
    sanitizeFilename(`${block.resourceId}.texture_set.json`),
    JSON.stringify(
      {
        format_version: "1.16.100",
        "minecraft:texture_set": block.textureSet,
      },
    ),
  );
}

export function addToBehaviorPack(
  key: string,
  contents: string | Uint8Array,
) {
  return bp.addFile(sanitizeFilename(key), contents, {
    createFolders: true,
  });
}

export function addToResourcePack(
  key: string,
  contents: string | Uint8Array,
) {
  return rp.addFile(sanitizeFilename(key), contents, {
    createFolders: true,
  });
}
// Generate contents.json on finish
// https://wiki.bedrock.dev/concepts/contents.html#contents-json

// function createContentsFile(packDir: JSZip) {
//   const files = packDir.files();

//   const contents: Array<{ path: string }> = [];

//   for (const file in files) {
//     contents.push({ path: file });
//   }

//   return packDir.addFile(
//     "contents.json",
//     JSON.stringify({ content: contents, version: 1 }),
//   );
// }

export function createArchive(namespace: string, size: PackSizes) {
  for (const languageKey in languages) {
    rp.addFile(
      `texts/${languageKey}.lang`,
      [...new Set(languages[<LanguageId> languageKey])].join(EOL.CRLF),
    );
  }

  rp.addFile(
    "texts/languages.json",
    JSON.stringify(Object.keys(languages)),
  );

  rp.addFile(
    "blocks.json",
    JSON.stringify({ format_version: [1, 1, 0], ...blocksJson }),
  );

  const mips = calculateMipLevels(size);

  rp.addFile(
    "textures/terrain_texture.json",
    JSON.stringify(
      {
        num_mip_levels: mips,
        padding: Math.max(1, 2 * mips),
        resource_pack_name: namespace,
        texture_name: "atlas.terrain",
        texture_data: textureData,
      },
    ),
  );

  // createContentsFile(bp);
  // createContentsFile(rp);

  return zip.generateAsync({
    mimeType: "application/zip",
    platform: "DOS",
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 1,
    },
  });
}
