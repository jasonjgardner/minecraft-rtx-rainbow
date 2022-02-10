import "https://deno.land/x/dotenv/load.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { sprintf } from "https://deno.land/std@0.125.0/fmt/printf.ts";
import { EOL } from "https://deno.land/std@0.125.0/fs/mod.ts";
import type {
  IBlock,
  IMaterial,
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
} from "./types.ts";
import {
  DIR_BP,
  DIR_RP,
  MIP_LEVELS,
  NAMESPACE,
  RELEASE_TYPE,
} from "./_config.ts";
import { filteredBlocks } from "./_blocks.ts";
import BlockEntry from "./BlockEntry.ts";
import { materials } from "./_materials.ts";
import { entityTrailFunction, rainbowTrailFunction } from "./mcfunctions.ts";
import { writeFlipbooks } from "./flipbook.ts";
import { deployToDev, resetDev } from "./deploy.ts";
import setup from "./_setup.ts";
import { createItems } from "./items.ts";
import { createManifests } from "./manifest.ts";
import print from "./printer.ts";

const res: BlockEntry[] = [];

let textureData: MinecraftTerrainData = {};

let blocksData: MinecraftData = {};

let languages: LanguagesContainer = {
  en_US: [],
};
materials.forEach((material: IMaterial) => {
  filteredBlocks.forEach((block: IBlock) => {
    let itr = material.endStep;
    while (itr >= 0) {
      if (
        itr >= material.minimumLevel && itr <= material.maximumLevel
      ) {
        res.push(new BlockEntry(block, material, itr));
      }

      itr -= material.step;
    }
  });
});

////////

await setup();
await createManifests(RELEASE_TYPE);
await createItems();

const mcfunctions: Record<string, string[]> = {
  rainbowstack: [],
};

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
  mcfunctions.rainbowstack.push(
    `setblock ${block.setPosition(itr)} ${block.behaviorId}`,
  );

  if (
    atlasGroup.length > 1 &&
    lastColor !== undefined &&
    lastColor !== block.color
  ) {
    // FIXME: Dumbass dependencies injection
    [blocksData, textureData, languages] = await writeFlipbooks(atlasGroup, {
      blocksData,
      textureData,
      languages,
    });

    atlasGroup = [];
  }

  lastColor = block.color;
  atlasGroup.push(block);
}

const tickers: string[] = [
  //"rainbowtrail",
  //"entitytrail",
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
  entityTrailFunction(),
);

await Deno.writeTextFile(
  `${DIR_RP}/blocks.json`,
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

await print(res);

// Cleanup
await deployToDev();
