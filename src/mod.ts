import "dotenv/load.ts";
import { join } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
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
  DIR_RP,
  MIP_LEVELS,
  NAMESPACE,
  RELEASE_TYPE,
} from "./store/_config.ts";
import { getConfig } from "/src/_utils.ts";
import { filteredBlocks } from "./store/_blocks.ts";
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

const res = assemble();

////////

await setup();
await createManifests(RELEASE_TYPE);
//await createItems();

const mcfunctions: Record<string, string[]> = {
  //   //rainbowstack: [],
};

let lastColor: string | undefined;
let atlasGroup: BlockEntry[] = [];
const flipbooks = [];

const blockLibrary: Record<string, BlockEntry> = {};

const len = res.length;

for (let itr = 0; itr < len; itr++) {
  const block = res[itr];

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

  await render(block, 16);

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

const tickers: string[] = [
  //  "rainbowtrail",
  //  "entitytrail",
];

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
  `${DIR_BP}/functions/rainbowtrail.mcfunction`,
  rainbowTrailFunction(),
);
await Deno.writeTextFile(
  `${DIR_BP}/functions/entitytrail.mcfunction`,
  await entityTrailFunction(blockLibrary),
);

await colorTrails(blockLibrary);

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

try {
  await print(res);
} catch (e) {
  console.error(e);
}

if (getConfig("DEPLOY", "false") !== "false") {
  await deployToDev();
}
