import { hex2rgb } from "../../_utils.ts";
import HueBlock from "../blocks/HueBlock.ts";

export default function getDefaultPalette(): HueBlock[] {
  return [
    new HueBlock(hex2rgb("#ff00ff"), {
      en_US: "Magic Pink",
      en_GB: "Magic Pink",
    }),
    new HueBlock(hex2rgb("#ff0000"), { en_US: "Red", en_GB: "Red" }),
    new HueBlock(hex2rgb("#00ff00"), { en_US: "Green", en_GB: "Green" }),
    new HueBlock(hex2rgb("#0000ff"), { en_US: "Blue", en_GB: "Blue" }),
    new HueBlock(hex2rgb("#ffff00"), { en_US: "Yellow", en_GB: "Yellow" }),
  ];
}
