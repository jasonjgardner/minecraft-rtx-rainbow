import type { IBlock, IColorShades } from "../../types.ts";
import BevelBlock from "./BevelBlock.ts";

export default class SlantedBlock extends BevelBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic"> & {
      shades: Partial<IColorShades>;
    },
  ) {
    super(block);

    this.name = "slanted_block";
    this.title = `${block.color} Slanted Block`;
  }
}
