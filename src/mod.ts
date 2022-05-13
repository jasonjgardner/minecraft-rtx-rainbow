import "dotenv/load.ts";
import { join } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
import type {
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
} from "/typings/types.ts";
import {
  DIR_AMULET,
  DIR_BP,
  DIR_RP,
  MIP_LEVELS,
  NAMESPACE,
  RELEASE_TYPE,
} from "./store/_config.ts";
import BlockEntry from "./components/BlockEntry.ts";
import { getBlocks, HueBlock } from "/src/components/blocks/index.ts";
import Material from "/src/components/Material.ts";
import { getMaterials } from "/src/components/materials/index.ts";
import {
  entityTrailFunction,
  fishTree,
  rainbowTrailFunction,
} from "./components/mcfunctions.ts";
import { writeFlipbooks } from "./components/flipbook.ts";
import { deployToDev } from "./components/deploy.ts";
import setup from "./components/_setup.ts";
import { createItems } from "./components/items.ts";
import { createManifests } from "./components/manifest.ts";
import {
  getPrintablePalette,
  printPatrons,
  printPixelArt,
} from "./components/printer.ts";
//import { renderBlock } from "./components/render.ts";
//import { permutes } from "./components/permutations.ts";

const res: BlockEntry[] = [];

let textureData: MinecraftTerrainData = {};

let blocksData: MinecraftData = {};

let languages: LanguagesContainer = {
  en_US: [],
};

// Join base textures with PBR materials
const baseTextures = getBlocks()
const materials = getMaterials();
materials.forEach((material: Material) => {
  baseTextures.forEach((base: HueBlock) => res.push(new BlockEntry(base, material)));
});

////////

await setup();
await createManifests(RELEASE_TYPE);
await createItems();

const mcfunctions: Record<string, string[]> = {};

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

  /// Write behavior block
  await Deno.writeTextFile(
    join(DIR_BP, "blocks", `${block.id}.json`),
    block.toString(),
  );

  /// Write texture
  const texturePath = `textures/blocks/${block.id}`;

  await Deno.writeTextFile(
    join(DIR_RP, `${texturePath}.texture_set.json`),
    JSON.stringify(
      {
        format_version: "1.16.100",
        "minecraft:texture_set": block.textureSet,
      },
      null,
      2,
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

const tickers: string[] = [
  // "rainbowtrail",
  // "entitytrail",
];

for (const func in mcfunctions) {
  await Deno.writeTextFile(
    `${DIR_BP}/functions/${func}.mcfunction`,
    mcfunctions[func].join(EOL.CRLF),
  );
}

if (tickers.length) {
  await Deno.writeTextFile(
    `${DIR_BP}/functions/tick.json`,
    JSON.stringify({
      "values": tickers,
    }),
  );
}

await Deno.writeTextFile(
  `${DIR_BP}/functions/rainbowtrail.mcfunction`,
  rainbowTrailFunction(),
);
await Deno.writeTextFile(
  `${DIR_BP}/functions/entitytrail.mcfunction`,
  entityTrailFunction(),
);
await Deno.writeTextFile(
  `${DIR_BP}/functions/fishtree.mcfunction`,
  fishTree(),
);

await Deno.writeTextFile(
  join(DIR_RP, "blocks.json"),
  JSON.stringify({ format_version: [1, 1, 0], ...blocksData }, null, 2),
);
await Deno.writeTextFile(
  join(DIR_RP, "/textures/terrain_texture.json"),
  JSON.stringify(
    {
      num_mip_levels: MIP_LEVELS,
      padding: (2 * MIP_LEVELS),
      resource_pack_name: NAMESPACE,
      texture_name: "atlas.terrain",
      texture_data: textureData,
    },
    null,
    2,
  ),
);

await Deno.writeTextFile(
  join(DIR_RP, "/textures/texture_list.json"),
  JSON.stringify(
    textureList,
    null,
    2,
  ),
);

for (const languageKey in languages) {
  await Deno.writeTextFile(
    `${DIR_RP}/texts/${languageKey}.lang`,
    [...new Set(languages[<LanguageId> languageKey])].join(EOL.CRLF),
  );
}

await Deno.writeTextFile(
  `${DIR_RP}/texts/languages.json`,
  JSON.stringify(Object.keys(languages)),
);

try {
  const printPalette = getPrintablePalette(res);

  await printPixelArt(printPalette);

  const thisRepo = Deno.env.get("GITHUB_REPOSITORY") ?? "";

  if (thisRepo !== undefined && thisRepo.length > 1) {
    await printPatrons(printPalette, {
      repo: thisRepo,
      chunks: 3,
    });
  }
} catch (err) {
  console.error(err);
}

// Cleanup
if (
  Deno.build.os === "windows" && Deno.env.get("GITHUB_ACTIONS") === undefined
) {
  await deployToDev();
}
