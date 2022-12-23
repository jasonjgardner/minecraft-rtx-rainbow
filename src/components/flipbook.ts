import { decode, Image } from "https://deno.land/x/imagescript@1.2.9/mod.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { sprintf } from "https://deno.land/std@0.125.0/fmt/printf.ts";
import type {
  FlipbookComponent,
  IMaterial,
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
  PackSizes,
  RGB,
} from "../../typings/types.ts";

import { DIR_BP, DIR_RP } from "../store/_config.ts";
import { materials } from "../store/_materials.ts";

import BlockEntry from "../components/BlockEntry.ts";
import FlipbookEntry, {
  formatFlipbookName,
} from "../components/FlipbookEntry.ts";

import render from "./_render.ts";

async function flipbookData(
  blocks: [FlipbookEntry, BlockEntry, BlockEntry],
  frameCount: number,
): Promise<FlipbookComponent> {
  const [flipbookBlock, prevBlock, nextBlock] = blocks;

  await Deno.writeTextFile(
    join(
      DIR_RP,
      "textures",
      "blocks",
      `${flipbookBlock.id}.texture_set.json`,
    ),
    JSON.stringify(
      {
        format_version: "1.16.100",
        "minecraft:texture_set": flipbookBlock.textureSet,
      },
      null,
      2,
    ),
  );

  await Deno.writeTextFile(
    join(
      DIR_BP,
      "blocks",
      `${flipbookBlock.id}.json`,
    ),
    flipbookBlock.toString(prevBlock, nextBlock),
  );

  const flipbookFrames: number[] = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
  ];
  // const startIdx = Math.round(frameCount * 0.5);

  // for (let itr = startIdx; itr < frameCount; itr++) {
  //   flipbookFrames.push(itr);
  // }

  // for (let itr = 1; itr < startIdx; itr++) {
  //   flipbookFrames.push(itr);
  // }

  return {
    flipbook_texture: `textures/blocks/${flipbookBlock.id}`,
    frames: flipbookFrames,
    atlas_tile: flipbookBlock.id,
    ticks_per_frame: 1, //Math.min(10, Math.floor(frameCount * 1.666)),
    blend_frames: false,
  };
}

export async function makeAtlas(blocks: BlockEntry[], size?: PackSizes) {
  const frames: RGB[] = blocks.map((block) => block.valueOf());
  const frameCount = frames.length;
  const s = size || 16;
  const atlasOutput = new Image(s, s * frameCount);

  // Create atlas frames
  for (let itr = 0; itr < frameCount; itr++) {
    const imgOutput = await decode(await render(blocks[itr], s), true);

    // Join frames into single image
    if (imgOutput) {
      atlasOutput.composite(<Image> imgOutput, 0, itr * s);
    }
  }

  return await atlasOutput.encode(0);
}

export async function writeFlipbooks(
  frames: BlockEntry[],
  dependencies: {
    blocksData: MinecraftData;
    textureData: MinecraftTerrainData;
    languages: LanguagesContainer;
  },
): Promise<
  [MinecraftData, MinecraftTerrainData, LanguagesContainer, FlipbookComponent[]]
> {
  const { blocksData, textureData, languages } = dependencies;
  const frameCount = frames.length;
  const lastBlock = frames[frameCount - 1];

  await Deno.writeFile(
    join(
      DIR_RP,
      "textures",
      "blocks",
      formatFlipbookName(lastBlock.color, lastBlock.material)
        .trim().replace(/[_ ]+/g, "_") + ".png",
    ),
    await makeAtlas(frames),
  );

  const flipMaterials = materials.filter(({ label }: IMaterial) =>
    !label?.startsWith("glass")
  );
  const flips = flipMaterials.map(
    async (material: IMaterial) => {
      const flipbookBlock = new FlipbookEntry(lastBlock, material);
      blocksData[flipbookBlock.behaviorId] = flipbookBlock.blocksData;
      textureData[flipbookBlock.resourceId] = flipbookBlock.terrainData;

      for (const languageKey in languages) {
        languages[<LanguageId> languageKey].push(
          sprintf(
            "tile.%s.name=%s",
            flipbookBlock.behaviorId,
            flipbookBlock.name[<LanguageId> languageKey],
          ),
        );
      }

      const flipData = await flipbookData(
        [
          flipbookBlock,
          frames[0],
          lastBlock,
        ],
        frameCount,
      );

      return flipData;
    },
  );

  const flipData = await Promise.all(flips);

  // await Deno.writeTextFile(
  //   join(DIR_RP, "/textures/flipbook_textures.json"),
  //   JSON.stringify(
  //     flipData,
  //     null,
  //     2,
  //   ),
  // );

  return [blocksData, textureData, languages, flipData];
}
