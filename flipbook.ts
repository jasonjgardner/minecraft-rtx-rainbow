import type {
  FlipbookComponent,
  IMaterial,
  MinecraftData,
  MinecraftTerrainData,
  PackSizes,
} from "./types.ts";
import { Image } from "https://deno.land/x/imagescript/mod.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { DIR_BP, DIR_RP } from "./_config.ts";
import { materials } from "./_materials.ts";

import BlockEntry from "./BlockEntry.ts";
import FlipbookEntry, { formatFlipbookName } from "./FlipbookEntry.ts";

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

  const flipbookFrames: number[] = [];
  const startIdx = Math.round(frameCount * 0.5);

  for (let itr = startIdx; itr < frameCount; itr++) {
    flipbookFrames.push(itr);
  }

  for (let itr = 1; itr < startIdx; itr++) {
    flipbookFrames.push(itr);
  }

  return {
    flipbook_texture: `textures/blocks/${flipbookBlock.id}`,
    frames: flipbookFrames,
    atlas_tile: flipbookBlock.id,
    ticks_per_frame: Math.floor(frameCount * 0.666), /// Approx 30fps
    blend_frames: true,
  };
}

export async function makeAtlas(blocks: BlockEntry[], size?: PackSizes) {
  const frames = blocks.map((block) => block.valueOf());
  const frameCount = Math.min(20, frames.length);
  const s = size || 16;
  const atlasOutput = new Image(s, s * frameCount);

  // Create atlas frames
  for (let itr = 0; itr < frameCount; itr++) {
    const imgOutput = new Image(s, s);

    imgOutput.fill(
      Image.rgbToColor(...frames[itr]),
    );

    // Join frames into single image
    atlasOutput.composite(imgOutput, 0, itr * s);
  }

  return await atlasOutput.encode(0);
}

export async function writeFlipbooks(
  frames: BlockEntry[],
  blocksData: MinecraftData,
  textureData: MinecraftTerrainData,
): Promise<[MinecraftData, MinecraftTerrainData]> {
  const frameCount = frames.length;
  const lastBlock = frames[frameCount - 1];

  await Deno.writeFile(
    join(
      DIR_RP,
      "textures",
      "blocks",
      formatFlipbookName(lastBlock.color) + ".png",
    ),
    await makeAtlas(frames),
  );

  await Deno.writeTextFile(
    join(DIR_RP, "/textures/flipbook_textures.json"),
    JSON.stringify(
      await Promise.all(
        materials.filter(({ label }: IMaterial) => label !== "glass").map(
          (material: IMaterial) => {
            const flipbookBlock = new FlipbookEntry(lastBlock, material);
            blocksData[flipbookBlock.behaviorId] = flipbookBlock.blocksData;
            textureData[flipbookBlock.resourceId] = flipbookBlock.terrainData;
            flipbookData(
              [
                flipbookBlock,
                frames[0],
                lastBlock,
              ],
              frameCount,
            );
          },
        ),
      ),
      null,
      2,
    ),
  );

  return [blocksData, textureData];
}
