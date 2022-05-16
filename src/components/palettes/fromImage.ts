import type { PaletteInput, RGBA } from "/typings/types.ts";

import { Image } from "imagescript/mod.ts";
import HueBlock from "/src/components/blocks/HueBlock.ts";
import { handlePaletteInput } from "/src/_utils.ts";
import getDefaultPalette from "/src/components/palettes/default.ts";

const MAX_PALETTE_SIZE = 255 ** 3;
const DEFAULT_IMAGE_URL = "https://placekitten.com/64/64";
const BOUNDARY_X = 128;
const BOUNDARY_Y = 128;

export default async function getPalette(
  src: PaletteInput,
): Promise<HueBlock[]> {
  if (!src) {
    return getDefaultPalette();
  }

  const img = await handlePaletteInput(src, DEFAULT_IMAGE_URL);

  const colors: number[] = [];

  let skippedColors = 0;

  for (const [x, y, c] of img.iterateWithColors()) {
    if (x > BOUNDARY_X || y > BOUNDARY_Y) {
      skippedColors++;
      continue;
    }
    colors.push(c);
  }

  if (skippedColors) {
    console.log("Skipped %d colors outside of boundaries", skippedColors);
  }

  const palette = [...new Set(colors)];

  if (palette.length > MAX_PALETTE_SIZE) {
    palette.length = MAX_PALETTE_SIZE;
    console.log("Palette size has been truncated.");
  }

  return palette.map((color) => new HueBlock(<RGBA> Image.colorToRGBA(color)));
}
