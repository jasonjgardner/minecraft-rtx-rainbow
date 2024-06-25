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
    this.title = `${block.colorName} Beveled Bulb`;
  }

  toJsonObject(): Record<string, unknown> {
    return {
      format_version: "1.20.20",
      "minecraft:block": {
        description: {
          identifier: `rainbow:${this.block.id}_${this.name}`,
          menu_category: {
            category: "construction",
            group: "itemGroup.name.glass",
          },
          traits: {},
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
      },
    };
  }
}
