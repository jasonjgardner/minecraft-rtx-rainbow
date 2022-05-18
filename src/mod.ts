import "dotenv/load.ts";

import type { ReleaseType } from "semver/mod.ts";
import type {
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
  PackSizes,
  PaletteInput,
} from "/typings/types.ts";
import { DEFAULT_RELEASE_TYPE } from "/typings/constants.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
import { join } from "path/mod.ts";
import { calculateMipLevels } from "/src/components/_resize.ts";
import BlockEntry from "/src/components/BlockEntry.ts";
import { getBlocks, HueBlock } from "/src/components/blocks/index.ts";
import Material from "/src/components/Material.ts";
import { getMaterials } from "/src/components/materials/index.ts";
import createFunctions from "/src/components/mcfunctions/index.ts";
import { generatePackIcon } from "/src/components/packIcon.ts";
import { createManifests } from "/src/components/manifest.ts";
import printer from "/src/components/printer.ts";
import { DIR_SRC } from "/src/store/_config.ts";
import {
  addToBehaviorPack,
  addToResourcePack,
  createArchive,
} from "/src/components/_state.ts";
//import { renderBlock } from "./components/render.ts";
//import { permutes } from "./components/permutations.ts";

export interface CreationParameters {
  size: PackSizes;
  namespace: string;
  blockColors?: HueBlock[];
  materialOptions?: Material[];
  outputFunctions?: boolean;
  outputPixelArt?: boolean;
  pixelArtSource?: PaletteInput;
  releaseType?: ReleaseType;
}

export const languages: LanguagesContainer = {
  en_us: [],
};

// Join base textures with PBR materials
function compileMaterials(
  namespace: string,
  baseTextures: HueBlock[],
  materials: Material[],
) {
  const res: BlockEntry[] = [];
  materials.forEach((material: Material) => {
    baseTextures.forEach((base: HueBlock) => {
      res.push(new BlockEntry(namespace, base, material));
    });
  });

  return res;
}

function createTextures(namespace: string, size: PackSizes, res: BlockEntry[]) {
  const textureData: MinecraftTerrainData = {};
  const blocksData: MinecraftData = {};
  const textureList: string[] = [];
  const len = res.length;

  for (let itr = 0; itr < len; itr++) {
    const block = res[itr];

    blocksData[block.behaviorId] = block.blocksData;

    textureData[block.resourceId] = block.terrainData;

    for (const languageKey in languages) {
      languages[<LanguageId> languageKey].push(
        block.language(<LanguageId> languageKey),
      );
    }

    const texturePath = `textures/blocks/${block.id}`;

    /// Write behavior block
    addToBehaviorPack(
      `blocks/${block.id}.json`,
      block.toString(),
    );

    // Write texture set
    addToResourcePack(
      `${texturePath}.texture_set.json`,
      JSON.stringify(
        {
          format_version: "1.16.100",
          "minecraft:texture_set": block.textureSet,
        },
      ),
    );

    /// Add to texture list
    textureList.push(texturePath);
  }

  addToResourcePack(
    "blocks.json",
    JSON.stringify({ format_version: [1, 1, 0], ...blocksData }),
  );

  const mips = calculateMipLevels(size);

  addToResourcePack(
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
  addToResourcePack(
    "textures/texture_list.json",
    JSON.stringify(
      [...new Set(textureList)],
    ),
  );
}

function createLanguages() {
  for (const languageKey in languages) {
    addToResourcePack(
      `texts/${languageKey}.lang`,
      [...new Set(languages[<LanguageId> languageKey])].join(EOL.CRLF),
    );
  }

  addToResourcePack(
    "texts/languages.json",
    JSON.stringify(Object.keys(languages)),
  );
}

export default async function createAddon(
  uuids: [string, string, string, string],
  {
    size,
    namespace,
    blockColors,
    materialOptions,
    pixelArtSource,
    releaseType,
  }: CreationParameters,
) {
  const materials = materialOptions && materialOptions.length
    ? materialOptions
    : getMaterials();
  const res = compileMaterials(
    namespace,
    blockColors && blockColors.length ? blockColors : getBlocks(),
    materials,
  );

  try {
    const packIcon = pixelArtSource
      ? await generatePackIcon(namespace, pixelArtSource)
      : await Deno.readFile(join(DIR_SRC, "assets", "img", "pack_icon.png"));

    addToResourcePack(
      "pack_icon.png",
      packIcon,
    );
    addToBehaviorPack(
      "pack_icon.png",
      packIcon,
    );
  } catch (err) {
    console.log("Failed adding pack icons: %s", err);
  }

  // TODO: Add description input
  createManifests(uuids, namespace, "", releaseType ?? DEFAULT_RELEASE_TYPE);

  createTextures(namespace, size, res);
  createFunctions();
  createLanguages();

  try {
    await printer(res, materials, pixelArtSource);
  } catch (err) {
    console.warn("Failed creating pixel art functions: %s", err);
  }

  return createArchive();
}
