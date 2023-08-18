import { decode, Image } from "imagescript/mod.ts";
import { basename, join } from "path/mod.ts";
import * as colors from "fmt/colors.ts";
import { rgb2hex } from "./_utils.ts";
import { RGBA } from "../types/index.ts";
// const kv = await Deno.openKv();
// Loop through all image files in cache/bedrock-samples/resource_pack/textures/blocks and subdirectories.
// Use Imagescript to find the dominant color of each image.
// Use Deno kv to store the dominant color of each image.
// The Minecraft block name is the key, and the dominant color is the value.
// Ignore doors, block tops and bottoms, and other blocks that are not full cubes.
// Prompt for confirmation before adding to database

const blocksDir = join(
  "cache",
  "bedrock-samples",
  "resource_pack",
  "textures",
  "blocks",
);
const excludeBlockNames: string[] = [
  "door",
  "sapling",
  "top",
  "bottom",
  "sign",
  "banner",
  "bed",
  "chest",
  "wall",
  "slab",
  "stairs",
  "fence",
  "fence_gate",
  "rail",
  "button",
  "pressure_plate",
  "trapdoor",
  "piston",
  "lever",
  "daylight_detector",
  "comparator",
  "repeater",
  "hopper",
  "observer",
  "conduit",
  "lantern",
  "bell",
  "campfire",
  "scaffolding",
  "potted",
  "decorated",
  "barrier",
  "command_block",
  "structure_block",
  "jigsaw",
  "end_portal",
  "end_gateway",
  "end_rod",
  "end_crystal",
  "dragon_egg",
  "beacon",
  "candle",
  "vine",
  "chain",
  "sign",
  "placeholder",
  "camera",
];

const rawJson = await Deno.readTextFile(
  join(
    Deno.cwd(),
    "cache",
    "bedrock-samples",
    "resource_pack",
    "blocks.json",
  ),
);

// Open blocks.json to find which block matches which texture name
const data = JSON.parse(
  rawJson,
);

const blockNames = Object.keys(data);

const textureMap = new Map<string, string>();

// Loop through all blocks in blocks.json
// If the block name is in the database, add the dominant color to the block data
for (const blockName of blockNames) {
  const blockTextures: string | Record<string, string> =
    data[blockName].textures ?? {};

  const textures = typeof blockTextures === "string"
    ? [blockTextures]
    : Object.values(blockTextures);

  for (const texture of textures) {
    textureMap.set(texture, blockName);
  }
}

const db: Record<string, {
  dominantColor: RGBA;
  averageColor: RGBA;
  dominantColorHex: string;
  averageColorHex: string;
}> = {};

export async function readBlocksDirectory(dir: string): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    // Skip saplings, doors, etc.
    if (
      excludeBlockNames.some((name) => entry.name.includes(name)) ||
      entry.name.endsWith(".tga")
    ) {
      continue;
    }

    const currentPath = join(dir, entry.name);
    if (entry.isDirectory) {
      return await readBlocksDirectory(currentPath);
    }

    try {
      const texture = await decode(
        await Deno.readFile(currentPath),
        true,
      ) as Image;
      const ac = texture.averageColor();
      const dc = texture.dominantColor();

      const key = [basename(currentPath).split(".")[0]];
      const dominantColor = Image.colorToRGBA(dc) as RGBA;
      const averageColor = Image.colorToRGBA(ac) as RGBA;
      const value = {
        dominantColor,
        dominantColorHex: rgb2hex(
          dominantColor[0],
          dominantColor[1],
          dominantColor[2],
        ),
        averageColor,
        averageColorHex: rgb2hex(
          averageColor[0],
          averageColor[1],
          averageColor[2],
        ),
      } as const;

      const blockName = textureMap.get(key[0]) ?? key[0];

      db[blockName] = value;

      // const res = await kv.atomic().check({
      //   key,
      //   versionstamp: null,
      // }).set(key, value).commit();

      console.log(
        `Added ${key[0]} to database with the values %cRGBA(${
          value.dominantColor.join(",")
        }) %cand %cRGBA(${value.averageColor.join(",")})`,
        `${
          rgb2hex(
            value.dominantColor[0],
            value.dominantColor[1],
            value.dominantColor[2],
          )
        }`,
        colors.reset,
        `${
          rgb2hex(
            value.averageColor[0],
            value.averageColor[1],
            value.averageColor[2],
          )
        }`,
      );
    } catch (err) {
      console.error(err);
    }
  }

  return Deno.writeTextFile(
    join(Deno.cwd(), "src", "store", "db.json"),
    JSON.stringify(db, null, 2),
  );
}

await readBlocksDirectory(blocksDir);
// kv.close();
