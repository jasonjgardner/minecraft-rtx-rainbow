import HueBlock from "/src/components/blocks/HueBlock.ts";
export { HueBlock };

//import srgb from '/src/components/palettes/srgb.ts'
import defaultPalette from '/src/components/palettes/default.ts'

export function getBlocks(): HueBlock[] {
  return defaultPalette()
}
