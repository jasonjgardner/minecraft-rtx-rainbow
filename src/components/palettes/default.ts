import { hex2rgb } from "/src/_utils.ts";
import HueBlock from "/src/components/blocks/HueBlock.ts";

export default function getDefaultPalette(): HueBlock[] {
  return [
    new HueBlock(hex2rgb("#ff00ff"), { en_US: "Magic Pink" }),
    new HueBlock(hex2rgb("#ff0000"), { en_US: "Red" }),
    new HueBlock(hex2rgb("#00ff00"), { en_US: "Green" }),
    new HueBlock(hex2rgb("#0000ff"), { en_US: "Blue" }),
    new HueBlock(hex2rgb("#ffff00"), { en_US: "Yellow" }),
  ];
}
