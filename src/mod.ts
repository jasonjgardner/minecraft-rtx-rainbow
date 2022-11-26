import "dotenv/load.ts";
import { join } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
import { toBase64 } from "https://deno.land/x/fast_base64@v0.1.7/mod.ts";
import { ListTypes, Markdown } from "deno_markdown/mod.ts";
import type {
  IBlock,
  IMaterial,
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
} from "/typings/types.ts";
import {
  DIR_BP,
  DIR_DIST,
  DIR_DOCS,
  DIR_RP,
  MIP_LEVELS,
  NAMESPACE,
  RELEASE_TYPE,
} from "./store/_config.ts";
import { getConfig } from "/src/_utils.ts";
import blocks, { filteredBlocks } from "./store/_blocks.ts";
import BlockEntry from "./components/BlockEntry.ts";
import { materials } from "./store/_materials.ts";
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

let textureData: MinecraftTerrainData = {};

let blocksData: MinecraftData = {};

let languages: LanguagesContainer = {
  en_US: [],
};
const markdown = new Markdown();
const res = assemble();

////////

await setup();
const { RP: rpVersion } = await createManifests(RELEASE_TYPE);

markdown.header("RAINBOW!!", 1).paragraph(`v${rpVersion}`);

//await createItems();

const mcfunctions: Record<string, string[]> = {
  //   //rainbowstack: [],
};

let lastColor: string | undefined;
let atlasGroup: BlockEntry[] = [];
const flipbooks = [];

const blockLibrary: Record<string, BlockEntry> = {};

const len = res.length;

const blocksTableData: Array<string[]> = [[
  "Block",
  "ID",
  "Material",
  "Color",
  "Tint",
  "Level",
  "Preview",
]];

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

  blocksTableData.push([
    block.name[<LanguageId> "en_US"],
    block.behaviorId,
    block.material?.name[<LanguageId> "en_US"] ?? "",
    block.color,
    `${block.tint}`,
    `${block.level}`,
    `![${block.resourceId}](assets/blocks/${block.resourceId}.png)`,
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

markdown.table(blocksTableData);

const functionsList = Object.keys(mcfunctions);
const tickers: string[] = [];

for (const func in mcfunctions) {
  await Deno.writeTextFile(
    `${DIR_BP}/functions/${func}.mcfunction`,
    mcfunctions[func].join(EOL.CRLF),
  );
}

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

markdown.header("Rainbow Trail", 4).paragraph(
  "TODO: Document trail replacements",
).codeBlock("/function rainbow_trail");

await Deno.writeTextFile(
  `${DIR_BP}/functions/entity_trail.mcfunction`,
  await entityTrailFunction(blockLibrary),
);

markdown.header("Entity Trails", 4).paragraph(
  "TODO: Document trail replacements",
);

const colorFunctions = await colorTrails(blockLibrary);
markdown.header("Color Trails", 4);
colorFunctions.forEach((fn) => markdown.codeBlock(fn, "mcfunction"));

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

markdown.header("Functions", 2);

for (const func of functionsList) {
  markdown.codeBlock(`/function ${func}`, "mcfunction");
}

try {
  markdown.content += await print(res);
} catch (e) {
  console.error(e);
}

await Deno.writeTextFile(`${DIR_DOCS}/README.md`, markdown.content);

if (getConfig("DEPLOY", "false") !== "false") {
  await deployToDev();
}
