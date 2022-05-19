import HueBlock from "/src/components/blocks/HueBlock.ts";
export default function generateSrgbBlocks(step: number) {
  step = Math.max(1, Math.min(255, Math.abs(step)));
  const blocks: HueBlock[] = [];
  for (let r = 0; r <= 255; r += step) {
    for (let g = 0; g <= 255; g += step) {
      for (let b = 0; b <= 255; b += step) {
        blocks.push(
          new HueBlock([r, g, b], { en_US: `R${r} G${g} B${b}` }),
        );
      }
    }
  }

  return blocks;
}
