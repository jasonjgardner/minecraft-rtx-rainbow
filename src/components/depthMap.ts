import type { PackSizes } from "/typings/types.ts";
import { Image } from "imagescript/mod.ts";
import { join } from "path/mod.ts";
import { DIR_SRC } from "/src/store/_config.ts";
import { channelPercentage } from "/src/_utils.ts";
import { addToResourcePack } from "/src/components/_state.ts";

function channelPercentageToColor(percentage: number) {
  const depth = channelPercentage(percentage);
  return Image.rgbToColor(depth, depth, depth);
}

export function createHeightMap(size: PackSizes) {
  const heightmap = new Image(size, size);
  const borderSize = Math.ceil(0.25 * size); /// 1/4 texture size
  const offset = size - borderSize;

  // Draw a 50% high square from a 10% high background
  heightmap.fill(channelPercentageToColor(10));
  heightmap.drawBox(
    borderSize,
    borderSize,
    offset,
    offset,
    channelPercentageToColor(50),
  );

  return heightmap.encode(3);
}

export async function requireHeightMap(name: string, size: PackSizes) {
  addToResourcePack(`textures/blocks/${name}.png`, await createHeightMap(size));
}

/**
 * Load a normal map from `assets/materials/` directory and add it to the resource pack
 * @param name Normal map name without extension
 * @param size Normal map's dimension in pixels
 */
export async function requireNormalMap(name: string, size: PackSizes) {
  try {
    const normalMap = await Image.decode(
      await Deno.readFile(join(
        DIR_SRC,
        "assets",
        "materials",
        `${name}.png`,
      )),
    );

    // Manipulate the normal map here:
    normalMap.resize(size, size);

    addToResourcePack(
      `textures/blocks/${name}.png`,
      await normalMap.encode(3),
    );
  } catch (err) {
    console.error("Failed adding normal map: %s", err);
  }
}
