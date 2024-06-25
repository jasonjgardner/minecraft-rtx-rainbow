import { BLOCK_VERSION, NAMESPACE } from "../../_constants.ts";
import type { IBlock } from "../../types.ts";
import { BlockComponents } from "../../types.ts";
import { BlockEvents } from "../../types.ts";
import { Lamp } from "./Lamp.ts";

const directions = {
  north: [0, 0, 0],
  east: [0, 270, 0],
  south: [0, 180, 0],
  west: [0, 90, 0],
};

export const states = {
  [`${NAMESPACE}:permute`]: [0, 1, 2, 3, 4, 5, 6, 7],
};

const permutes: Array<{
  condition: string;
  components: BlockComponents;
}> = [];

for (const [direction, rotation] of Object.entries(directions)) {
  permutes.push(
    {
      condition: `q.block_state('minecraft:cardinal_direction') == '${direction}' && q.block_state('minecraft:vertical_half') == 'bottom'`,
      components: {
        "minecraft:transformation": {
          rotation,
        },
      },
    },
    {
      condition: `q.block_state('minecraft:cardinal_direction') == '${direction}' && q.block_state('minecraft:vertical_half') == 'top'`,
      components: {
        "minecraft:transformation": {
          rotation: [rotation[0] - 180, rotation[1], rotation[2]],
        },
      },
    },
  );
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

const events: BlockEvents = {};

// states["rainbow:permute"].forEach((state, idx) => {
//   events[`${NAMESPACE}:on_interact_${state}`] = {
//     set_block_state: {
//       [`${NAMESPACE}:permute`]: `${idx + 1}`,
//     },
//   };

//   permutes.push({
//     condition: `q.block_state('${NAMESPACE}:permute') == '${idx + 1}'`,
//     components: {
//       "minecraft:geometry": {
//         identifier: "geometry.cube",
//         bone_visibility: {
//           bone0: idx >= 0,
//           bone1: idx >= 1,
//           bone2: idx >= 2,
//           bone3: idx >= 3,
//           bone4: idx >= 4,
//           bone5: idx >= 5,
//           bone6: idx >= 6,
//           bone7: idx >= 7,
//         },
//       },
//       "minecraft:on_interact": {
//         event: `${NAMESPACE}:on_interact_${idx + 1}`,
//       },
//     },
//   });
// });

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
          //   states,
        },
        components: {
          "minecraft:geometry": "geometry.cube",
          //   "minecraft:geometry": {
          //     identifier: "geometry.cube",
          //     bone_visibility: {
          //       bone1: true,
          //       bone2: false,
          //       bone3: false,
          //       bone4: false,
          //       bone5: false,
          //       bone6: false,
          //       bone7: false,
          //       bone8: false,
          //     },
          //   },
          "minecraft:map_color": this.hexColor,
          "minecraft:light_dampening": 6,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "opaque",
            },
          },
          "minecraft:on_interact": {
            event: `${NAMESPACE}:on_interact_0`,
          },
          //   "minecraft:creative_category": {
          //     category: "construction",
          //     group: "itemGroup.name.glazedTerracotta",
          //   },
        },
        permutations: [...permutes],
        events,
      },
    };
  }
}
