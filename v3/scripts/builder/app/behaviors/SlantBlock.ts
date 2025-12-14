import { Plate } from "./Plate";
import type { IBlock, IUsableBlock } from "../../types";
import { BLOCK_VERSION, NAMESPACE } from "../../_constants";
import stairPermutations, { placementTrait } from "./permutes/stairs";
import { LitDecorativeBlock } from "./Lit";

export default class SlantBlock extends Plate {
  constructor(
    block: Omit<IUsableBlock, "sound" | "isotropic">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.block = {
      ...block,
      isotropic: false,
      sound: "glass",
    };

    this.name = "slant_block";
    this.title = `${block.color} Slanted Block`;
    this.blockId = `${this.block.id}_${this.name}`;
    this.textId = `tile.${NAMESPACE}:${this.blockId}.name`;
  }

  toJsonObject(): Record<string, unknown> {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: `${NAMESPACE}:${this.blockId}`,
          traits: {
            ...placementTrait,
          },
          states: {},
        },
        components: {
          "minecraft:geometry": "geometry.slant",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_emission": 0,
          "minecraft:light_dampening": 15,
          "minecraft:material_instances": {
            primary: {
              texture: this.textureId,
              render_method: "opaque",
            },
            "*": {
              texture: `${NAMESPACE}_light_gray_50_plate`,
              render_method: "opaque",
            },
          },
        },
        permutations: [...stairPermutations],
        events: {},
      },
    };
  }
}
