import type { IBlock } from "../../types.ts";
import DecorativeBlock from "./DecorativeBlock.ts";
import { BLOCK_VERSION, NAMESPACE } from "../../_constants.ts";

export class LitDecorativeBlock extends DecorativeBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string
  ) {
    super(block, hexColor);
    this.name = "lit";
    this.title = `${block.colorName} Lit`;
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
          menu_category: {
            category: "construction",
            group: "itemGroup.name.glazedTerracotta",
          },
          traits: {},
        },
        components: {
          //   "minecraft:creative_category": {
          //     category: "construction",
          //     group: "itemGroup.name.glazedTerracotta",
          //   },
          "minecraft:unit_cube": {},
          "minecraft:map_color": this.hexColor,
          "minecraft:light_emission": 15,
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
