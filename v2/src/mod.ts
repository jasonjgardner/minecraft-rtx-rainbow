import "dotenv/load.ts";
import { join } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
// import { Markdown } from "deno_markdown/mod.ts";
import type {
  Color,
  FlipbookComponent,
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
  PackModule,
} from "/types/index.ts";
import {
  DIR_BP,
  DIR_DOCS,
  DIR_RP,
  MIP_LEVELS,
  NAMESPACE,
} from "./store/_config.ts";
import { getConfig } from "/src/_utils.ts";
import BlockEntry from "./components/BlockEntry.ts";
import { writeFlipbooks } from "./components/flipbook.ts";
import { deployToDedicatedServer, deployToDev } from "./components/deploy.ts";
import setup from "./components/_setup.ts";
//import { createItems } from "./components/items.ts";
import { createManifests } from "./components/manifest.ts";
import print from "./components/printer.ts";
import render from "./components/_render.ts";
import assemble from "./components/_assemble.ts";
import compile from "./components/compile.ts";
// import { createBiomes } from "./components/biomes.ts";
import generateSounds from "./components/sounds.ts";
import { writeDeferredLighting } from "./components/deferred.ts";

const kv = await Deno.openKv();
let textureData: MinecraftTerrainData = {};
const itemTextureData: MinecraftTerrainData = {};
let blocksData: MinecraftData = {};

let languages: LanguagesContainer = {
  en_US: [],
};

const excludeMaterials =
  (getConfig("excludeMaterials", "glass_pane,brick_lit") ?? "")
    .toString().split(",");

const stored =
  (await kv.get<Array<ReturnType<BlockEntry["serialize"]>>>(["blocks"]))?.value;

const lib = stored?.map((storedBlock) => BlockEntry.deserialize(storedBlock)) ??
  undefined;

const res: BlockEntry[] = lib ?? assemble(excludeMaterials);

if (!lib && res.length > 0) {
  res.forEach(async (block) => {
    await kv.set([NAMESPACE, "blocks", block.id], block.serialize(), {
      expireIn: 60 * 60,
    });
  });
}

await setup();

//await createItems();

let lastColor: string | undefined;
let atlasGroup: BlockEntry[] = [];
const flipbooks: Array<
  | MinecraftData
  | MinecraftTerrainData
  | LanguagesContainer
  | Array<FlipbookComponent>
> = [];

const blockLibrary: Record<string, BlockEntry> = {};

const len = res.length;

// const blocksTableHeader = [
//   "Block",
//   "ID",
//   "Material",
//   "Color",
//   "Tint",
//   "Level",
//   "Preview",
// ];

// const blocksTableData: Record<string, Array<string[]>> = {};

for (let itr = 0; itr < len; itr++) {
  const block: BlockEntry = res[itr];

  blockLibrary[block.behaviorId] = block;

  blocksData[block.behaviorId] = block.blocksData;

  textureData[block.resourceId] = block.terrainData;

  for (const languageKey in languages) {
    languages[<LanguageId> languageKey].push(
      sprintf(
        "tile.%s.name=%s",
        block.behaviorId,
        block.name[<LanguageId> languageKey],
      ),
    );
  }

  const rendered = await render(block, 32);

  if (!rendered) {
    throw new Error(`Failed to render block: ${block.id}`);
  }

  await Promise.all([
    Deno.writeFile(
      `${DIR_RP}/textures/blocks/${block.id}.png`,
      rendered,
    ),
    Deno.writeTextFile(
      `${DIR_RP}/textures/blocks/${block.id}.texture_set.json`,
      JSON.stringify(
        {
          format_version: "1.16.100",
          "minecraft:texture_set": block.textureSet,
        },
        null,
        2,
      ),
    ),
    Deno.writeTextFile(
      `${DIR_BP}/blocks/${block.id}.json`,
      block.toString(
        itr === 0 ? res[len - 1] : res[itr - 1],
        itr === len - 1 ? res[0] : res[itr + 1],
      ),
    ),
  ]);

  if (
    atlasGroup.length > 1 &&
    lastColor !== undefined &&
    lastColor !== block.color
  ) {
    let flipbooksJson;
    // FIXME: Dumbass dependencies injection
    [blocksData, textureData, languages, flipbooksJson] = await writeFlipbooks(
      atlasGroup,
      {
        blocksData,
        textureData,
        languages,
      },
    );

    atlasGroup = [];

    if (flipbooksJson) {
      flipbooks.push(flipbooksJson);
    }
  }

  lastColor = block.color;
  atlasGroup.push(block);
}
let flipbooksJson;
[blocksData, textureData, languages, flipbooksJson] = await writeFlipbooks(
  atlasGroup,
  {
    blocksData,
    textureData,
    languages,
  },
);

if (flipbooksJson) {
  flipbooks.push(flipbooksJson);
}

const languageQueue = [];

for (const languageKey in languages) {
  languageQueue.push(Deno.writeTextFile(
    `${DIR_RP}/texts/${languageKey}.lang`,
    languages[<LanguageId> languageKey].join(EOL.CRLF),
  ));
}

await Promise.all([
  ...languageQueue,
  Deno.writeTextFile(
    `${DIR_RP}/texts/languages.json`,
    JSON.stringify(Object.keys(languages)),
  ),
  Deno.writeTextFile(
    join(DIR_RP, "blocks.json"),
    JSON.stringify({ format_version: [1, 1, 0], ...blocksData }, null, 2),
  ),
  Deno.writeTextFile(
    join(DIR_RP, "/textures/terrain_texture.json"),
    JSON.stringify(
      {
        num_mip_levels: MIP_LEVELS,
        padding: MIP_LEVELS * 2,
        resource_pack_name: NAMESPACE,
        texture_name: "atlas.terrain",
        texture_data: textureData,
      },
      null,
      2,
    ),
  ),
  Deno.writeTextFile(
    join(DIR_RP, "/textures/flipbook_textures.json"),
    JSON.stringify(flipbooks.flat(1), null, 2),
  ),
  Deno.writeTextFile(
    `${DIR_RP}/textures/item_texture.json`,
    JSON.stringify(
      {
        resource_pack_name: NAMESPACE,
        texture_name: "atlas.items",
        texture_data: itemTextureData,
      },
      null,
      2,
    ),
  ),
  writeDeferredLighting(res),
  print(res),
  // generateSounds(res),
]);

// try {
//   await createBiomes(res);
// } catch (err) {
//   console.error(err);
// }

const scripts: Array<PackModule> = [];

try {
  scripts.push({
    entry: await compile("main.ts", {
      res,
    }),
    version: [1, 0, 0],
  });
} catch (err) {
  console.error("Failed compiling script: %s", err);
}

await createManifests(scripts);

if (getConfig("DEPLOY", "false") !== "false") {
  await Promise.all([
    deployToDev(getConfig("preview", "false") !== "false"),
    deployToDedicatedServer(),
  ]);
}
