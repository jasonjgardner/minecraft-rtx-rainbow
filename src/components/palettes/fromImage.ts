import type { PaletteInput, RGB, RGBA } from "/typings/types.ts";

import { GIF, Image } from "imagescript/mod.ts";
import HueBlock from "/src/components/blocks/HueBlock.ts";
import { handlePaletteInput, rgbaMatch } from "/src/_utils.ts";

const MAX_PALETTE_SIZE = 255 ** 3;
const BOUNDARY_X = 256;
const BOUNDARY_Y = 256;
const MIN_ALPHA = 0.2;

export default async function getPalette(
  src: Exclude<PaletteInput, null>,
): Promise<HueBlock[]> {
  const input = await handlePaletteInput(src);
  const img = input instanceof GIF ? input[0] : input;

  const colors: Array<RGBA | RGB> = [];

  for (const [x, y, c] of img.iterateWithColors()) {
    if (x > BOUNDARY_X || y > BOUNDARY_Y) {
      console.log("Skipping colors outside of boundaries");
      break;
    }
    const color = Image.colorToRGBA(c);
    const alpha = color[3] / 255;

    if (
      alpha > MIN_ALPHA &&
      !colors.filter((existingColor) =>
        rgbaMatch(existingColor, [color[0], color[1], color[2], alpha])
      ).length
    ) {
      colors.push(<RGBA> [color[0], color[1], color[2], color[3] / 255]);
    }
  }

  if (colors.length > MAX_PALETTE_SIZE) {
    colors.length = MAX_PALETTE_SIZE;
    console.log("Palette size has been truncated.");
  }

  return colors.map((color) => new HueBlock(color));
}
