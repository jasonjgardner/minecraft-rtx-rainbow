import HueBlock from "/src/components/blocks/HueBlock.ts";
function rgb2Hex(r: number, g: number, b: number) {
  return "#" + [r, g, b]
    .map((x) => x.toString(16).padStart(2, "0")).join("");
}
export default function generateSrgbBlocks(step: number) {
  const blocks: HueBlock[] = [];
  for (let r = 0; r <= 255; r += step) {
    for (let g = 0; g <= 255; g += step) {
      for (let b = 0; b <= 255; b += step) {
        blocks.push(
          new HueBlock(rgb2Hex(r, g, b), { en_US: `R${r} G${g} B${b}` }),
        );
      }
    }
  }

  return blocks;
}
