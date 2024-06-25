import type { IBlock, IColorShades } from "../../types.ts";
import BevelBlock from "./BevelBlock.ts";

export default class BeveledSlab extends BevelBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic"> & {
      shades: Partial<IColorShades>;
    },
  ) {
    super(block);

    this.name = "beveled_slab";
    this.title = `${block.colorName} Beveled Slab`;
  }

  toJsonObject() {
    const parentBlock = new BevelBlock(this.block);
    const parentJson = parentBlock.toJsonObject();
    // @ts-ignore
    const blockJson = parentJson?.["minecraft:block"]?.["components"] ?? {};

    blockJson["minecraft:geometry"] = "geometry.slab";
    blockJson["minecraft:material_instances"] = {
      "*": {
        texture: `rainbow_${parentBlock.block.id}_${parentBlock.name}`,
        render_method: "blend",
      },
    };

    return {
      ...parentJson,
      "minecraft:block": {
        // @ts-ignore
        ...parentJson["minecraft:block"],
        description: {
          // @ts-ignore
          ...parentJson["minecraft:block"].description,
          identifier: `rainbow:${this.block.id}_${this.name}`,
          menu_category: {
            category: "construction",
            group: "itemGroup.name.concrete",
          },
        },
        components: blockJson,
      },
    };
  }
}
