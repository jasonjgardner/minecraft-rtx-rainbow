import { Image } from "imagescript/mod.ts";
import { join } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import type {
  FlipbookComponent,
  LanguageId,
  LanguagesContainer,
  MinecraftData,
  MinecraftTerrainData,
  PackSizes,
  RGB,
} from "../../typings/types.ts";
import type Material from "/src/components/Material.ts";
import { DIR_BP, DIR_RP } from "../store/_config.ts";

import BlockEntry from "../components/BlockEntry.ts";
import FlipbookEntry, {
  formatFlipbookName,
} from "../components/FlipbookEntry.ts";
import { getMaterials } from "/src/components/materials/index.ts";
async function flipbookData(
  flipbookBlock: FlipbookEntry,
  frameCount: number,
): Promise<FlipbookComponent> {
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
    flipbookBlock.toString(),
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
    ticks_per_frame: 1, //Math.floor(frameCount * 1.666),
    blend_frames: false,
  };
}

export async function makeAtlas(blocks: BlockEntry[], size?: PackSizes) {
  const frames: RGB[] = blocks.map((block) => <RGB> block.color.valueOf());
  const frameCount = frames.length;
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
  dependencies: {
    blocksData: MinecraftData;
    textureData: MinecraftTerrainData;
    languages: LanguagesContainer;
  },
): Promise<[MinecraftData, MinecraftTerrainData, LanguagesContainer]> {
  const { blocksData, textureData, languages } = dependencies;
  const frameCount = frames.length;
  const lastBlock = frames[frameCount - 1];

  await Deno.writeFile(
    join(
      DIR_RP,
      "textures",
      "blocks",
      formatFlipbookName(lastBlock.color.name) + ".png",
    ),
    await makeAtlas(frames),
  );

  const materials = getMaterials();

  await Deno.writeTextFile(
    join(DIR_RP, "/textures/flipbook_textures.json"),
    JSON.stringify(
      await Promise.all(
        materials.map(
          async (material: Material) => {
            const flipbookBlock = new FlipbookEntry(lastBlock.color, material);
            blocksData[flipbookBlock.behaviorId] = flipbookBlock.blocksData;
            textureData[flipbookBlock.resourceId] = flipbookBlock.terrainData;

            for (const languageKey in languages) {
              languages[<LanguageId> languageKey].push(
                sprintf(
                  "tile.%s.name=%s",
                  flipbookBlock.behaviorId,
                  flipbookBlock.title(<LanguageId> languageKey),
                ),
              );
            }

            return await flipbookData(
              flipbookBlock,
              frameCount,
            );
          },
        ),
      ),
      null,
      2,
    ),
  );

  return [blocksData, textureData, languages];
}
