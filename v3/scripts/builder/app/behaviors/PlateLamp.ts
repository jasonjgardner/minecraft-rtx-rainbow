import { Plate } from "./Plate";
import type { IBlock, IColorShades } from "../../types";
import { BLOCK_VERSION, NAMESPACE } from "../../_constants";

export default class PlateLamp extends Plate {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic"> & {
      shades: Partial<IColorShades>;
    },
  ) {
    super({
      ...block,
      geometry: "geometry.plate_lamp",
    });
    this.block = {
      ...block,
      isotropic: false,
      sound: "glass",
    };

    this.name = "plate_lamp";
    this.title = `${block.colorName} Plate Lamp`;
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
            "minecraft:placement_direction": {
              enabled_states: ["minecraft:facing_direction"],
            },
          },
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
          "minecraft:geometry": "geometry.plate_lamp",
          "minecraft:map_color": this.hexColor,
          "minecraft:light_emission": 10,
          "minecraft:light_dampening": 15,
          "minecraft:material_instances": {
            primary_lamp: {
              texture: this.textureId
                .replace("plate", "lamp")
                .replace(/[0-9]+/g, "300"),
              render_method: "opaque",
            },
            secondary_lamp: {
              texture: this.textureId
                .replace("plate", "lamp")
                .replace(/[0-9]+/g, "400"),
              render_method: "opaque",
            },
            "*": {
              texture: this.textureId,
              render_method: "opaque",
            },
          },
        },
        permutations: [
          {
            condition:
              "q.block_state('minecraft:facing_direction') == 'up' || q.block_state('minecraft:facing_direction') == 'down' ",
            components: {
              "minecraft:transformation": {
                rotation: [90, 0, 90],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:facing_direction') == 'east'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 0, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:facing_direction') == 'west'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 180, 0],
              },
            },
          },
          {
            condition:
              "q.block_state('minecraft:facing_direction') == 'north' || q.block_state('minecraft:facing_direction') == 'south' ",
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
