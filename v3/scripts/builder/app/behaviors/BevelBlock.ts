import { BLOCK_VERSION } from "../../_constants.ts";
import type { IBlock, IColorShades } from "../../types.ts";
import DecorativeBlock from "./DecorativeBlock.ts";
export default class BevelBlock extends DecorativeBlock {
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
    this.name = "beveled_block";
    this.title = `${block.colorName} Beveled Block`;
  }

  toJsonObject(): Record<string, unknown> {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: `rainbow:${this.block.id}_${this.name}`,
          menu_category: {
            category: "construction",
            group: "itemGroup.name.concrete",
          },
          traits: {},
        },
        components: {
          "minecraft:geometry": "minecraft:geometry.full_block",
          "minecraft:map_color": this.block.shades![400]!,
          "minecraft:material_instances": {
            "*": {
              texture: `rainbow_${this.block.id}_${this.name}`,
              render_method: "blend",
              ambient_occlusion: true,
            },
          },
          "minecraft:light_dampening": 5,
        },
        permutations: [],
      },
    };
  }
}
