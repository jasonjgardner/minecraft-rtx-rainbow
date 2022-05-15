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
  const borderSize = Math.round(0.125 * size); /// ⅛ texture size

  // Draw a 50% high square from a 10% high background
  heightmap.fill(channelPercentageToColor(10));
  heightmap.drawBox(
    borderSize,
    borderSize,
    size - borderSize,
    size - borderSize,
    channelPercentageToColor(50),
  );

  return heightmap.encode(3);
}

export async function requireHeightMap(name: string, size: PackSizes) {
  addToResourcePack(`textures/blocks/${name}`, await createHeightMap(size));
}
