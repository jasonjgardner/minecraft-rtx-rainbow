import type { IBlock, IColorShades } from "../../types.ts";
import BevelBlock from "./BevelBlock.ts";

export default class ArcBlock extends BevelBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic"> & {
      shades: Partial<IColorShades>;
    },
  ) {
    super(block);
    this.block = {
      ...block,
      isotropic: false,
      sound: "stone",
    };

    this.name = "arc_block";
    this.title = `${block.colorName} Arc Block`;
  }
}
