import type { IBlock } from "../../types.ts";
import { DecorativeBlock } from "./mod.ts";
import { NAMESPACE } from "../../_constants.ts";
import stairsPermutations from "./permutes/stairs.ts";
import { BLOCK_VERSION } from "../../_constants.ts";
export class Glass extends DecorativeBlock {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string
  ) {
    super(block, hexColor);
    this.name = "glass";
    this.title = `${block.colorName} Glass`;
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
            group: "itemGroup.name.glass",
          },
          traits: {},
        },
        components: {
          "minecraft:unit_cube": {},
          "minecraft:map_color": this.hexColor,
          "minecraft:light_dampening": 5,
          "minecraft:friction": 0.5,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "blend",
              ambient_occlusion: true,
              face_dimming: true,
            },
          },
        },
      },
    };
  }
}

export class GlassSlab extends Glass {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string
  ) {
    super(block, hexColor);
    this.name = "glass_slab";
    this.title = `${block.colorName} Glass Slab`;
    this.blockId = `${this.block.id}_${this.name}`;
    this.textId = `tile.${NAMESPACE}:${this.blockId}.name`;
    this.hexColor = hexColor;
    // this.textureId = `${NAMESPACE}_${this.blockId}`;
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
          "minecraft:geometry": "geometry.slab",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_dampening": 4,
          "minecraft:friction": 0.45,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "blend",
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

export class GlassStairs extends Glass {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string
  ) {
    super(block, hexColor);
    this.name = "glass_stairs";
    this.title = `${block.colorName} Glass Stairs`;
    this.blockId = `${this.block.id}_${this.name}`;
    this.textId = `tile.${NAMESPACE}:${this.blockId}.name`;
    this.hexColor = hexColor;
    // this.textureId = `${NAMESPACE}_${this.blockId}`;
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
              render_method: "blend",
            },
          },
        },
        permutations: [...stairsPermutations],
      },
    };
  }
}

export class GlassCarpet extends Glass {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "shades">,
    hexColor: string
  ) {
    super(block, hexColor);
    this.name = "glass_carpet";
    this.title = `${block.colorName} Glass Panel`;
    this.blockId = `${this.block.id}_${this.name}`;
    this.textId = `tile.${NAMESPACE}:${this.blockId}.name`;
    // this.textureId = `${NAMESPACE}_${this.blockId}`;
  }

  toJsonObject(): Record<string, unknown> {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: `${NAMESPACE}:${this.blockId}`,
          menu_category: {
            category: "construction",
            group: "itemGroup.name.carpets",
          },
          traits: {
            "minecraft:placement_position": {
              enabled_states: ["minecraft:block_face"],
            },
          },
        },
        components: {
          "minecraft:geometry": "geometry.carpet",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_dampening": 2,
          "minecraft:friction": 0.4,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "blend",
            },
          },
          "minecraft:collision_box": {
            origin: [-8, 0, -8],
            size: [16, 1, 16],
          },
        },
        permutations: [
          {
            condition: "q.block_state('minecraft:block_face') == 'north'",
            components: {
              "minecraft:transformation": {
                rotation: [90, 180, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:block_face') == 'east'",
            components: {
              "minecraft:transformation": {
                rotation: [90, 90, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:block_face') == 'south'",
            components: {
              "minecraft:transformation": {
                rotation: [90, 0, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:block_face') == 'west'",
            components: {
              "minecraft:transformation": {
                rotation: [90, -90, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:block_face') == 'up'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 0, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:block_face') == 'down'",
            components: {
              "minecraft:transformation": {
                rotation: [180, 0, 0],
              },
            },
          },
        ],
      },
    };
  }
}
