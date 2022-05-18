import { hex2rgb } from "/src/_utils.ts";
import HueBlock from "/src/components/blocks/HueBlock.ts";

export default function getDefaultPalette(): HueBlock[] {
  return [
    new HueBlock(hex2rgb("#ff00ff"), { en_us: "Magic Pink" }),
    new HueBlock(hex2rgb("#ff0000"), { en_us: "Red" }),
    new HueBlock(hex2rgb("#00ff00"), { en_us: "Green" }),
    new HueBlock(hex2rgb("#0000ff"), { en_us: "Blue" }),
    new HueBlock(hex2rgb("#ffff00"), { en_us: "Yellow" }),
  ];
}
