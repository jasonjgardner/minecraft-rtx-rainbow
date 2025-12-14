import { BLOCK_VERSION } from "../../_constants.ts";
import type { IBlock, IColorShades } from "../../types.ts";
import DecorativeBlock from "./DecorativeBlock.ts";
export default class BevelBulb extends DecorativeBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic"> & {
      shades: Partial<IColorShades>;
    },
  ) {
    super(block);
    this.block = {
      ...block,
      isotropic: false,
      sound: "glass",
    };

    // Should match sbsar name
    this.name = "beveled_bulb";
    this.title = `${block.color} Beveled Bulb`;
  }

  toJsonObject(): Record<string, unknown> {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: `rainbow:${this.block.id}_${this.name}`,
          traits: {},
          states: {},
        },
        components: {
          "minecraft:map_color": this.block.shades![400]!,
          "minecraft:material_instances": {
            "*": {
              texture: `rainbow_${this.block.id}_${this.name}`,
              render_method: "blend",
              ambient_occlusion: true,
            },
          },
          "minecraft:light_dampening": 3,
        },
        permutations: [],
        events: {},
      },
    };
  }
}
