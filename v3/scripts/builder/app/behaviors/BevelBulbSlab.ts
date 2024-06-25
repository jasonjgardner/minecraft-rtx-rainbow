import type { IBlock, IColorShades } from "../../types.ts";
import BevelBulb from "./BeveledBulb.ts";

export default class BeveledSlab extends BevelBulb {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic"> & {
      shades: Partial<IColorShades>;
    },
  ) {
    super(block);

    this.name = "beveled_bulb_slab";
    this.title = `${block.colorName} Beveled Bulb Slab`;
  }

  toJsonObject() {
    const parentBlock = new BevelBulb(this.block);
    const parentJson = parentBlock.toJsonObject();
    // @ts-ignore
    const blockJson = parentJson?.["minecraft:block"]?.["components"] ?? {};

    blockJson["minecraft:geometry"] = "geometry.slab";
    blockJson["minecraft:material_instances"] = {
      "*": {
        texture: `rainbow_${parentBlock.block.id}_${parentBlock.name}`,
        render_method: "blend",
        ambient_occlusion: true,
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
            group: "itemGroup.name.glass",
          },
        },
        components: blockJson,
      },
    };
  }
}
