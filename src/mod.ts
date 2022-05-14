import "dotenv/load.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
import type {
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
} from "/typings/types.ts";
import { MIP_LEVELS, NAMESPACE, RELEASE_TYPE } from "/src/store/_config.ts";
import BlockEntry from "/src/components/BlockEntry.ts";
import { getBlocks, HueBlock } from "/src/components/blocks/index.ts";
import Material from "/src/components/Material.ts";
import { getMaterials } from "/src/components/materials/index.ts";
import createFunctions from '/src/components/mcfunctions/index.ts'
import { writeFlipbooks } from "/src/components/flipbook.ts";
//import { deployToDev } from "./components/deploy.ts";
import setup from "./components/_setup.ts";
import { createItems } from "/src/components/items.ts";
import { createManifests } from "/src/components/manifest.ts";
import {
  getPrintablePalette,
  printPatrons,
  printPixelArt,
} from "/src/components/printer.ts";
import {
  addToBehaviorPack,
  addToResourcePack,
  createArchive,
} from "/src/components/_state.ts";
//import { renderBlock } from "./components/render.ts";
//import { permutes } from "./components/permutations.ts";

const res: BlockEntry[] = [];

let textureData: MinecraftTerrainData = {};

let blocksData: MinecraftData = {};

let languages: LanguagesContainer = {
  en_US: [],
};

// Join base textures with PBR materials
const baseTextures = getBlocks();
const materials = getMaterials();
materials.forEach((material: Material) => {
  baseTextures.forEach((base: HueBlock) =>
    res.push(new BlockEntry(base, material))
  );
});

////////

await setup();
await createManifests(RELEASE_TYPE);
createItems();

//const amuletBlockOutput = join(DIR_AMULET, "textures", "blocks");
const textureList = [];

let lastColor: string | undefined;
let atlasGroup: BlockEntry[] = [];

const len = res.length;

for (let itr = 0; itr < len; itr++) {
  const block = res[itr];

  blocksData[block.behaviorId] = block.blocksData;

  textureData[block.resourceId] = block.terrainData;

  for (const languageKey in languages) {
    languages[<LanguageId> languageKey].push(
      sprintf(
        "tile.%s.name=%s",
        block.behaviorId,
        block.title(<LanguageId> languageKey),
      ),
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

  if (
    atlasGroup.length > 1 &&
    lastColor !== undefined &&
    lastColor !== block.color.name
  ) {
    // FIXME: Dumbass dependencies injection
    [blocksData, textureData, languages] = await writeFlipbooks(atlasGroup, {
      blocksData,
      textureData,
      languages,
    });

    atlasGroup = [];
  }

  lastColor = block.color.name;
  atlasGroup.push(block);

  // Encode blocks for Amulet
  // await Deno.writeFile(
  //   join(amuletBlockOutput, `${block.resourceId}.png`),
  //   await renderBlock(block.valueOf(), 16),
  // );
}

//createFunctions()

addToResourcePack(
  "blocks.json",
  JSON.stringify({ format_version: [1, 1, 0], ...blocksData }),
);
addToResourcePack(
  "textures/terrain_texture.json",
  JSON.stringify(
    {
      num_mip_levels: MIP_LEVELS,
      padding: (2 * MIP_LEVELS),
      resource_pack_name: NAMESPACE,
      texture_name: "atlas.terrain",
      texture_data: textureData,
    },
  ),
);
addToResourcePack(
  "textures/texture_list.json",
  JSON.stringify(
    textureList,
  ),
);

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

// try {
//   const printPalette = getPrintablePalette(res);

//   await printPixelArt(printPalette);

//   const thisRepo = Deno.env.get("GITHUB_REPOSITORY") ?? "";

//   if (thisRepo !== undefined && thisRepo.length > 1) {
//     await printPatrons(printPalette, {
//       repo: thisRepo,
//       chunks: 3,
//     });
//   }
// } catch (err) {
//   console.error(err);
// }

await createArchive();
