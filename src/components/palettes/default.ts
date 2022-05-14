import HueBlock from "/src/components/blocks/HueBlock.ts";

export default function getDefaultPalette(): HueBlock[] {
  return [
    new HueBlock("#ff00ff", { en_US: "Magic Pink" }),
    new HueBlock("#ff0000", { en_US: "Red" }),
    new HueBlock("#00ff00", { en_US: "Green" }),
    new HueBlock("#0000ff", { en_US: "Blue" }),
    new HueBlock("#ffff00", { en_US: "Yellow" }),
  ];
}
