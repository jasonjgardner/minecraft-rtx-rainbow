import { BLOCK_VERSION } from "../../_constants.ts";
import type { IBlock, IColorShades } from "../../types.ts";
import BevelBlock from "./BevelBlock.ts";

export default class BigBevelBlock extends BevelBlock {
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

    this.name = "lit_bevel_block";
    this.title = `${block.color} Glowing Beveled Block`;
  }

  toJsonObject() {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: `rainbow:${this.block.id}_${this.name}`,
          menu_category: {
            category: "construction",
            group: "minecraft:itemGroup.name.glazedTerracotta",
          },
          traits: {},
        },
        components: {
          "minecraft:geometry": "minecraft:geometry.full_block",
          "minecraft:map_color": this.block.shades![400]!,
          "minecraft:material_instances": {
            "*": {
              texture: `rainbow_${this.block.id}_${this.name}`,
              render_method: "opaque",
            },
          },
          "minecraft:light_dampening": 15,
          "minecraft:light_emission": 11,
        },
        permutations: [],
      },
    };
  }
}
