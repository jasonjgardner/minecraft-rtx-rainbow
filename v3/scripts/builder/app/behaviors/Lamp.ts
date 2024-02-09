import type { IBlock } from "../../types.ts";
import { DecorativeBlock } from "./mod.ts";
import { BLOCK_VERSION, NAMESPACE } from "../../_constants.ts";
import stairsPermutations from "./permutes/stairs.ts";
export class Lamp extends DecorativeBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "lamp";
    this.title = `${block.colorName} Lamp`;
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

export class LampSlab extends Lamp {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "lamp_slab";
    this.title = `${block.colorName} Lamp Slab`;
    this.blockId = `${this.block.id}_${this.name}`;
    this.textId = `tile.${NAMESPACE}:${this.blockId}.name`;
  }

  toJsonObject(): Record<string, unknown> {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: `${NAMESPACE}:${this.blockId}`,
          menu_category: {
            category: "construction",
            group: "itemGroup.name.slab",
          },
          traits: {
            "minecraft:placement_position": {
              enabled_states: ["minecraft:vertical_half"],
            },
          },
        },
        components: {
          //   "minecraft:creative_category": {
          //     category: "construction",
          //     group: "itemGroup.name.slab",
          //   },
          "minecraft:geometry": "geometry.slab",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_emission": 14,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "opaque",
            },
          },
          "minecraft:selection_box": {
            origin: [-8, 0, -8],
            size: [16, 8, 16],
          },
          "minecraft:collision_box": {
            origin: [-8, 0, -8],
            size: [16, 8, 16],
          },
        },
        permutations: [
          {
            condition: "q.block_state('minecraft:vertical_half') == 'top'",
            components: {
              "minecraft:transformation": {
                translation: [0, 0.5, 0],
              },
            },
          },
        ],
      },
    };
  }
}

const placementTrait = {
  "minecraft:placement_direction": {
    enabled_states: [
      "minecraft:cardinal_direction",
      "minecraft:facing_direction",
    ],
    y_rotation_offset: 90.0,
  },
  "minecraft:placement_position": {
    enabled_states: ["minecraft:vertical_half"],
  },
};

export class LampStairs extends Lamp {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "lamp_stairs";
    this.title = `${block.colorName} Lamp Stairs`;
    this.blockId = `${this.block.id}_${this.name}`;
    this.textId = `tile.${NAMESPACE}:${this.blockId}.name`;
  }

  toJsonObject(): Record<string, unknown> {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: `${NAMESPACE}:${this.blockId}`,
          menu_category: {
            category: "construction",
            group: "itemGroup.name.stairs",
          },
          traits: {
            ...placementTrait,
          },
        },
        components: {
          //   "minecraft:creative_category": {
          //     category: "construction",
          //     group: "itemGroup.name.stairs",
          //   },
          "minecraft:geometry": "geometry.stairs",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_dampening": 4,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "opaque",
            },
          },
        },
        permutations: [
          ...stairsPermutations,
        ],
      },
    };
  }
}

export class LampCube extends Lamp {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "lamp_cube";
    this.title = `${block.colorName} Lamp Cube`;
    this.blockId = `${this.block.id}_${this.name}`;
    this.textId = `tile.${NAMESPACE}:${this.blockId}.name`;
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
          traits: {
            ...placementTrait,
          },
        },
        components: {
          //   "minecraft:creative_category": {
          //     category: "construction",
          //     group: "itemGroup.name.glazedTerracotta",
          //   },
          "minecraft:geometry": "geometry.cube",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_dampening": 6,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "opaque",
            },
          },
        },
        permutations: [
          ...stairsPermutations,
        ],
      },
    };
  }
}
