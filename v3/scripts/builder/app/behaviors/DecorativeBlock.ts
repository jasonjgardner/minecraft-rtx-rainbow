import type { IBlock, Shades } from "../../types.ts";
import { BLOCK_VERSION, BP_DIR, NAMESPACE } from "../../_constants.ts";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
export default class DecorativeBlock {
  block: IBlock & {
    complimentary: string;
    secondary: string;
    tertiary: string;
    nextShade: Shades;
    nextColor: string;
  };
  name: string;
  title: string;
  textId: string;
  hexColor: string;
  blockId: string;
  textureId: string;

  constructor(
    block: Omit<IBlock, "sound" | "isotropic" | "name"> & {
      complimentary: string;
      secondary: string;
      tertiary: string;
      nextShade: Shades;
      nextColor: string;
    },
    hexColor: string,
  ) {
    this.block = {
      name: "block",
      isotropic: false,
      sound: "glass",
      ...block,
    };

    this.name = "block";
    this.title = `${block.color} Block`;
    this.blockId = `${this.block.id}_${this.name}`;
    this.textId = `tile.${NAMESPACE}:${this.blockId}.name`;
    this.hexColor = hexColor;
    this.textureId = `${NAMESPACE}_${this.blockId}`;
  }

  addText(texts: Record<string, string>) {
    texts[this.textId] = this.title;

    return this;
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
          // "minecraft:creative_category": {
          //   category: "construction",
          //   group: "itemGroup.name.concrete",
          // },
          //
          "minecraft:geometry": "minecraft:geometry.full_block",
          "minecraft:map_color": this.hexColor,
          "minecraft:material_instances": {
            "*": {
              texture: this.textureId,
              render_method: "opaque",
              ambient_occlusion: true,
              face_dimming: true,
            },
          },
        },
        permutations: [],
        events: {},
      },
    };
  }

  async save(dir: string) {
    await writeFile(
      join(dir, `/blocks/${this.blockId}.json`),
      JSON.stringify(this.toJsonObject(), null, 2),
    );

    return this;
  }
}
