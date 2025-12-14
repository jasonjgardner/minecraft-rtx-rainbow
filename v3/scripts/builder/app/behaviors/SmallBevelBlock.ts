import type { IBlock, IColorShades } from "../../types.ts";
import BevelBlock from "./BevelBlock.ts";

export default class SmallBevelBlock extends BevelBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic"> & {
      shades: Partial<IColorShades>;
    },
  ) {
    super(block);
    this.block = {
      ...block,
      isotropic: false,
      sound: "amethyst_block",
    };

    this.name = "small_bevel_block";
    this.title = `${block.color} Small-Beveled Block`;
  }
}
