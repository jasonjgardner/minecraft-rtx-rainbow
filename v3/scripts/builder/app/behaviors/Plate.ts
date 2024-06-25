import { BLOCK_VERSION, NAMESPACE } from "../../_constants.ts";
import type { IBlock } from "../../types.ts";
import DecorativeBlock from "./DecorativeBlock.ts";

export class Plate extends DecorativeBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string,
  ) {
    super(
      {
        ...block,
      },
      hexColor,
    );

    this.block = {
      isotropic: false,
      sound: "metal",
      ...block,
    };

    this.name = "plate";
    this.title = `${block.colorName} Plate`;
    this.blockId = `${this.block.id}_${this.name}`;
    this.textId = `tile.${NAMESPACE}:${this.blockId}.name`;
    this.hexColor = hexColor;
    this.textureId = `${NAMESPACE}_${this.blockId}`;
  }

  toJsonObject(): Record<string, unknown> {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: `${NAMESPACE}:${this.blockId}`,
          traits: {},
          menu_category: {
            category: "construction",
            group: "itemGroup.name.copper",
          },
        },
        components: {
          // "minecraft:creative_category": {
          //   category: "construction",
          //   group: "itemGroup.name.copper",
          // },
          "minecraft:geometry": "minecraft:geometry.full_block",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_emission": 0,
          "minecraft:light_dampening": 15,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "opaque",
            },
          },
        },
      },
    };
  }
}
