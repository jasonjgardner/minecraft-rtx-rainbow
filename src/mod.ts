import "dotenv/load.ts";
import { join } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
import { Markdown } from "deno_markdown/mod.ts";
import type {
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
  PackModule,
} from "/typings/types.ts";
import {
  DIR_BP,
  DIR_DOCS,
  DIR_RP,
  MIP_LEVELS,
  NAMESPACE,
  RELEASE_TYPE,
} from "./store/_config.ts";
import { getConfig } from "/src/_utils.ts";
import BlockEntry from "./components/BlockEntry.ts";
import {
  colorTrails,
  entityTrailFunction,
  rainbowTrailFunction,
} from "./components/mcfunctions.ts";
import { writeFlipbooks } from "./components/flipbook.ts";
import { deployToDev } from "./components/deploy.ts";
import setup from "./components/_setup.ts";
//import { createItems } from "./components/items.ts";
import { createManifests } from "./components/manifest.ts";
import print from "./components/printer.ts";
import render from "./components/_render.ts";
import assemble from "./components/_assemble.ts";
import compile from "./components/compile.ts";

let textureData: MinecraftTerrainData = {};
const itemTextureData: MinecraftTerrainData = {};
let blocksData: MinecraftData = {};

let languages: LanguagesContainer = {
  en_US: [],
};

const excludeMaterials = (getConfig("excludeMaterials", "glass_pane") ?? "")
  .toString().split(",");

const res = assemble(excludeMaterials);

await setup();

//await createItems();

let lastColor: string | undefined;
let atlasGroup: BlockEntry[] = [];
const flipbooks = [];

const blockLibrary: Record<string, BlockEntry> = {};

const len = res.length;

const blocksTableHeader = [
  "Block",
  "ID",
  "Material",
  "Color",
  "Tint",
  "Level",
  "Preview",
];

const blocksTableData: Record<string, Array<string[]>> = {};

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

  /// Write behavior block
  await Deno.writeTextFile(
    `${DIR_BP}/blocks/${block.id}.json`,
    block.toString(
      itr === 0 ? res[len - 1] : res[itr - 1],
      itr === len - 1 ? res[0] : res[itr + 1],
    ),
  );

  const rendered = await render(block, 16);

  if (!rendered) {
    throw new Error(`Failed to render block: ${block.id}`);
  }

  await Deno.writeFile(
    `${DIR_RP}/textures/blocks/${block.id}.png`,
    rendered,
  );

  await Deno.writeFile(
    `${DIR_DOCS}/assets/blocks/${block.resourceId}.png`,
    rendered,
  );

  const blockMaterial = block.material?.name[<LanguageId> "en_US"] ?? "Generic";

  if (!blocksTableData[blockMaterial]) {
    blocksTableData[blockMaterial] = [];
  }

  blocksTableData[blockMaterial].push([
    block.name[<LanguageId> "en_US"],
    block.behaviorId,
    blockMaterial,
    block.color,
    `${block.tint}`,
    `${block.level}`,
    `![${block.resourceId}](../assets/blocks/${block.resourceId}.png)`,
  ]);

  /// Write texture
  await Deno.writeTextFile(
    `${DIR_RP}/textures/blocks/${block.id}.texture_set.json`,
    JSON.stringify(
      {
        format_version: "1.16.100",
        "minecraft:texture_set": block.textureSet,
      },
      null,
      2,
    ),
  );

  /// Add to functions
  // mcfunctions.rainbowstack.push(
  //   `setblock ${block.setPosition(itr)} ${block.behaviorId}`,
  // );

  if (
    atlasGroup.length > 1 &&
    lastColor !== undefined &&
    lastColor !== block.color
  ) {
    let flipbooksJson;
    // FIXME: Dumbass dependencies injection
    // TODO: Create GIF preview for docs
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

for (const key in blocksTableData) {
  (new Markdown().header(key, 1).table([
    blocksTableHeader,
    ...blocksTableData[key],
  ])).write(
    `${DIR_DOCS}/materials/`,
    key,
  );
}

const tickers: string[] = [];

await Deno.writeTextFile(
  `${DIR_BP}/functions/tick.json`,
  JSON.stringify({
    "values": tickers,
  }),
);

await Deno.writeTextFile(
  `${DIR_BP}/functions/rainbow_trail.mcfunction`,
  rainbowTrailFunction(),
);

await Deno.writeTextFile(
  `${DIR_BP}/functions/entity_trail.mcfunction`,
  await entityTrailFunction(blockLibrary),
);

const colorFunctions = [...new Set(await colorTrails(blockLibrary))];
const colorTrailsDoc = new Markdown().header("Color Trails", 1);
colorTrailsDoc.codeBlock(
  colorFunctions.map((fn) => `/function ${fn}`).join(EOL.CRLF),
  "mcfunction",
);
colorTrailsDoc.write(`${DIR_DOCS}/functions/`, "color_trails");

await Deno.writeTextFile(
  join(DIR_RP, "blocks.json"),
  JSON.stringify({ format_version: [1, 1, 0], ...blocksData }, null, 2),
);
await Deno.writeTextFile(
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
);

await Deno.writeTextFile(
  join(DIR_RP, "/textures/flipbook_textures.json"),
  JSON.stringify(flipbooks.flat(), null, 2),
);

await Deno.writeTextFile(
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
);

for (const languageKey in languages) {
  await Deno.writeTextFile(
    `${DIR_RP}/texts/${languageKey}.lang`,
    languages[<LanguageId> languageKey].join(EOL.CRLF),
  );
}

await Deno.writeTextFile(
  `${DIR_RP}/texts/languages.json`,
  JSON.stringify(Object.keys(languages)),
);

try {
  await print(res);
} catch (e) {
  console.error(e);
}

const scripts: Array<PackModule> = [];

// try {
//   scripts.push({
//     entry: await compile("hello.ts"),
//     version: [1, 0, 0],
//   });
// } catch (err) {
//   console.error("Failed compiling script: %s", err);
// }

await createManifests(scripts, RELEASE_TYPE);

if (getConfig("DEPLOY", "false") !== "false") {
  await deployToDev();
}
