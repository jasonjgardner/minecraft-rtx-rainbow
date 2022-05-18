import type { PaletteInput, RGBA } from "/typings/types.ts";

import { GIF, Image } from "imagescript/mod.ts";
import HueBlock from "/src/components/blocks/HueBlock.ts";
import { handlePaletteInput } from "/src/_utils.ts";

const MAX_PALETTE_SIZE = 255 ** 3;
const BOUNDARY_X = 256;
const BOUNDARY_Y = 256;
const MIN_ALPHA = 10;

export default async function getPalette(
  src: Exclude<PaletteInput, null>,
): Promise<HueBlock[]> {
  const input = await handlePaletteInput(src);
  const img = input instanceof GIF ? input[0] : input;

  const colors: Array<RGBA> = [];

  for (const [x, y, c] of img.iterateWithColors()) {
    if (x > BOUNDARY_X || y > BOUNDARY_Y) {
      console.log("Skipping colors outside of boundaries");
      break;
    }
    const color = Image.colorToRGBA(c);

    if (color[3] > MIN_ALPHA) {
      colors.push(<RGBA> color);
    }
  }

  const palette = [...new Set(colors)];

  if (palette.length > MAX_PALETTE_SIZE) {
    palette.length = MAX_PALETTE_SIZE;
    console.log("Palette size has been truncated.");
  }

  return palette.map((color) => new HueBlock(color));
}
