import HueBlock from "../blocks/HueBlock.ts";
export { HueBlock };

//import srgb from '/src/components/palettes/srgb.ts'
import defaultPalette from "../palettes/default.ts";

export function getBlocks(): HueBlock[] {
  return defaultPalette();
}
