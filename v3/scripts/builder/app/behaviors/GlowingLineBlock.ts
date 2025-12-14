import { BLOCK_VERSION } from "../../_constants.ts";
import type { IBlock, IColorShades } from "../../types.ts";
import DecorativeBlock from "./DecorativeBlock.ts";
export default class GlowingLineBlock extends DecorativeBlock {
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
    this.name = "dark_glowing_line";
    this.title = `${block.color} Glowing Line`;
  }

  toJsonObject() {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: `rainbow:${this.block.id}_${this.name}`,
          menu_category: {
            category: "construction",
            group: "itemGroup.name.concrete",
          },
          traits: {
            "minecraft:placement_direction": {
              enabled_states: [
                "minecraft:cardinal_direction",
                "minecraft:facing_direction",
              ],
            },
          },
        },
        components: {
          "minecraft:map_color": this.block.shades![400]!,
          "minecraft:material_instances": {
            "*": {
              texture: `rainbow_${this.block.id}_${this.name}`,
              render_method: "opaque",
            },
          },
          "minecraft:light_dampening": 15,
          "minecraft:light_emission": 12,
        },
        permutations: [
          {
            condition:
              "query.block_state('minecraft:cardinal_direction') == 'south'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 90, 0],
              },
            },
          },
          {
            condition:
              "query.block_state('minecraft:cardinal_direction') == 'west'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 180, 0],
              },
            },
          },
          {
            condition:
              "query.block_state('minecraft:cardinal_direction') == 'north'",
            components: {
              "minecraft:transformation": {
                rotation: [90, 270, 90],
              },
            },
          },
        ],
      },
    };
  }
}
