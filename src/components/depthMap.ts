import type { PackSizes } from "/typings/types.ts";
import { Image } from "imagescript/mod.ts";
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

/**
 * @deprecated Borked
 */
export async function requireHeightMap(name: string, size: PackSizes) {
  addToResourcePack(`textures/blocks/${name}.png`, await createHeightMap(size));
}
