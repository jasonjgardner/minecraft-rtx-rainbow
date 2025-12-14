import type { IBlock, IColorShades } from "../../types.ts";
import ArcBlock from "./ArcBlock.ts";

export default class DiagonalBlock extends ArcBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic"> & {
      shades: Partial<IColorShades>;
    },
  ) {
    super(block);

    this.name = "diagonal_block";
    this.title = `${block.color} Diagonal Block`;
  }
}
