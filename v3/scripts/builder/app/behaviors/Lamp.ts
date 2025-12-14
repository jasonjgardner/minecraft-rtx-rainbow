import type { IBlock, IUsableBlock } from "../../types.ts";
import { DecorativeBlock } from "./index.ts";
import { BLOCK_VERSION, NAMESPACE } from "../../_constants.ts";
import stairsPermutations, { placementTrait } from "./permutes/stairs.ts";

export class Lamp extends DecorativeBlock {
  constructor(
    block: Omit<IUsableBlock, "sound" | "isotropic">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "lamp";
    this.title = `${block.color} Lamp`;
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
          states: {},
        },
        components: {
          //   "minecraft:creative_category": {
          //     category: "construction",
          //     group: "itemGroup.name.glazedTerracotta",
          //   },
          "minecraft:geometry": "minecraft:geometry.full_block",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_emission": 15,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "opaque",
            },
          },
        },
        events: {},
      },
    };
  }
}

export class LampSlab extends Lamp {
  constructor(
    block: Omit<IUsableBlock, "sound" | "isotropic">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "lamp_slab";
    this.title = `${block.color} Lamp Slab`;
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
            "minecraft:placement_position": {
              enabled_states: ["minecraft:vertical_half"],
            },
          },
          states: {},
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
        events: {},
      },
    };
  }
}

export class LampStairs extends Lamp {
  constructor(
    block: Omit<IUsableBlock, "sound" | "isotropic">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "lamp_stairs";
    this.title = `${block.color} Lamp Stairs`;
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
        permutations: [...stairsPermutations],
        events: {},
      },
    };
  }
}

export class LampCube extends Lamp {
  constructor(
    block: Omit<IUsableBlock, "sound" | "isotropic">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "lamp_cube";
    this.title = `${block.color} Lamp Cube`;
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
        permutations: [...stairsPermutations],
        events: {},
      },
    };
  }
}

export class CheckerLamp extends Lamp {
  constructor(
    block: Omit<IUsableBlock, "sound" | "isotropic">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "checker_lamp";
    this.title = `${block.color} Checker Lamp`;
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
          //   "minecraft:creative_category": {
          //     category: "construction",
          //     group: "itemGroup.name.glazedTerracotta",
          //   },
          "minecraft:geometry": "geometry.checker",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_emission": 15,
          "minecraft:material_instances": {
            secondary: {
              texture: this.block.complimentary + "_lamp",
              render_method: "opaque",
            },
            "1": "secondary",
            "4": "secondary",
            "6": "secondary",
            "7": "secondary",
            "*": {
              texture: this.textureId,
              render_method: "opaque",
            },
          },
        },
        events: {},
      },
    };
  }
}

export class QuadColorLamp extends Lamp {
  constructor(
    block: Omit<IUsableBlock, "sound" | "isotropic">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "palette_lamp";
    this.title = `${block.color} Palette Lamp`;
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
          states: {
            "rainbow:permute": [1, 2, 3],
          },
        },
        components: {
          //   "minecraft:creative_category": {
          //     category: "construction",
          //     group: "itemGroup.name.glazedTerracotta",
          //   },
          "minecraft:geometry": "geometry.checker",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_emission": 15,
          "minecraft:material_instances": {
            complimentary: {
              texture: this.block.complimentary + "_lamp",
              render_method: "opaque",
            },
            secondary: {
              texture: this.block.secondary + "_lamp",
              render_method: "opaque",
            },
            tertiary: {
              texture: this.block.tertiary + "_lamp",
              render_method: "opaque",
            },
            "1": "complimentary",
            "2": "secondary",
            "4": "tertiary",
            "6": "complimentary",
            "8": "secondary",
            "*": {
              texture: this.textureId,
              render_method: "opaque",
            },
          },
          // "minecraft:on_player_placing": {
          //   event: "rainbow:place_random",
          // },
        },
        permutations: [
          {
            condition: "q.block_state('rainbow:permute') == 1",
            components: {
              "minecraft:material_instances": {
                complimentary: {
                  texture: this.block.complimentary + "_lamp",
                  render_method: "opaque",
                },
                secondary: {
                  texture: this.block.secondary + "_lamp",
                  render_method: "opaque",
                },
                tertiary: {
                  texture: this.block.tertiary + "_lamp",
                  render_method: "opaque",
                },
                "1": "tertiary",
                "2": "complimentary",
                "4": "secondary",
                "6": "tertiary",
                "8": "complimentary",
                "*": {
                  texture: this.textureId,
                  render_method: "opaque",
                },
              },
            },
          },
          {
            condition: "q.block_state('rainbow:permute') == 2",
            components: {
              "minecraft:material_instances": {
                complimentary: {
                  texture: this.block.complimentary + "_lamp",
                  render_method: "opaque",
                },
                secondary: {
                  texture: this.block.secondary + "_lamp",
                  render_method: "opaque",
                },
                tertiary: {
                  texture: this.block.tertiary + "_lamp",
                  render_method: "opaque",
                },
                "1": "secondary",
                "2": "tertiary",
                "4": "complimentary",
                "6": "secondary",
                "8": "tertiary",
                "*": {
                  texture: this.textureId,
                  render_method: "opaque",
                },
              },
            },
          },
        ],
        events: {},
      },
    };
  }
}

export class CornerLamp extends Lamp {
  constructor(
    block: Omit<IUsableBlock, "sound" | "isotropic">,
    hexColor: string,
  ) {
    super(block, hexColor);
    this.name = "corner_lamp";
    this.title = `${block.color} Directional Lamp`;
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
          //   "minecraft:creative_category": {
          //     category: "construction",
          //     group: "itemGroup.name.stairs",
          //   },
          "minecraft:geometry": "geometry.corner_lamp",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_dampening": 4,
          "minecraft:material_instances": {
            lamp: {
              texture: `${NAMESPACE}_${this.block.id}_lamp`,
              render_method: "opaque",
            },
            "*": {
              texture: `${NAMESPACE}_light_gray_50_block`,
              render_method: "opaque",
            },
          },
        },
        permutations: [
          {
            condition: "q.block_state('minecraft:facing_direction') == 'north'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 0, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:facing_direction') == 'east'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 90, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:facing_direction') == 'south'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 180, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:facing_direction') == 'west'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 270, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:facing_direction') == 'up'",
            components: {
              "minecraft:transformation": {
                rotation: [-90, 0, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:facing_direction') == 'down'",
            components: {
              "minecraft:transformation": {
                rotation: [90, 0, 0],
              },
            },
          },
        ],
        events: {},
      },
    };
  }
}
