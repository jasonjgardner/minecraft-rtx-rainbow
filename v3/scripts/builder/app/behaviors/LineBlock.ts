import { Plate } from "./Plate";
import type { IBlock, IColorShades } from "../../types";
import { BLOCK_VERSION, NAMESPACE } from "../../_constants";

export default class LineBlock extends Plate {
  constructor(
    block: Omit<IBlock, "sound" | "isotropic"> & {
      shades: Partial<IColorShades>;
    },
  ) {
    super({
      ...block,
      geometry: "geometry.line_block",
    });
    this.block = {
      ...block,
      isotropic: false,
      sound: "glass",
    };

    this.name = "line_lamp";
    this.title = `${block.colorName} Line Lamp`;
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
          "minecraft:geometry": "geometry.line_block",
          "minecraft:map_color": this.hexColor, // TODO: Map color should be primary color
          "minecraft:light_emission": 0,
          "minecraft:light_dampening": 15,
          "minecraft:material_instances": {
            primary: {
              texture: this.textureId
                .replace("plate", "lamp")
                .replace(/[0-9]+/g, "300"),
              render_method: "opaque",
            },
            secondary: {
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
            condition: "q.block_state('minecraft:facing_direction') == 'up'",
            components: {
              "minecraft:transformation": {
                rotation: [90, 0, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:facing_direction') == 'down'",
            components: {
              "minecraft:transformation": {
                rotation: [-90, 0, 0],
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
            condition: "q.block_state('minecraft:facing_direction') == 'west'",
            components: {
              "minecraft:transformation": {
                rotation: [0, -90, 0],
              },
            },
          },
          {
            condition: "q.block_state('minecraft:facing_direction') == 'north'",
            components: {
              "minecraft:transformation": {
                rotation: [0, 180, 0],
              },
            },
          },
        ],
      },
    };
  }
}
