import titleCase from "https://deno.land/x/case@2.2.0/titleCase.ts";
import type {
  IBlock,
  IMaterial,
  LanguageId,
  MinecraftEvent,
  RGB,
} from "../../types/index.ts";
import { hex2rgb } from "https://crux.land/3RdawE";
import { BEHAVIOR_BLOCK_FORMAT_VERSION, NAMESPACE } from "../store/_config.ts";

export default class BlockEntry {
  _id!: string;

  _hue!: string;

  _tint!: string | number;

  _material: IMaterial;
  _level: number;
  _value!: string;
  _color!: string;
  _geometry?: string;
  constructor({ name, color }: IBlock, material: IMaterial, level: number) {
    if (typeof name !== "string") {
      name = name.en_US;
    }

    const lastDash = name.lastIndexOf("_");
    this._tint = name.substring(lastDash + 1);
    this._hue = name.substring(0, lastDash);
    this._level = Math.abs(level);
    this._material = material;
    this._id = name.replace(/\s+/g, "_").toLowerCase();
    this._color = color;
    this._geometry = material.geometry;
  }

  getTitle(lang: LanguageId) {
    return `${this._level}% ${
      this._material.name[lang]
    } ${this.color} ${this.tint}`;
  }

  get material() {
    return this._material;
  }

  get level() {
    return Math.max(0, Math.min(100, this._level));
  }

  get color() {
    return titleCase(this._hue);
  }

  get tint(): string | number {
    return isNaN(+this._tint)
      ? `${this._tint}`.toUpperCase()
      : parseInt(`${this._tint}`, 10);
  }

  get id() {
    return `${this._id}_${this._material.name.en_US}_${this._level}`.replace(
      /\s+/g,
      "_",
    )
      .toLowerCase();
  }

  get behaviorId() {
    return `${NAMESPACE}:${this.id}`;
  }

  get resourceId() {
    return `${NAMESPACE}_${this.id}`;
  }

  get name() {
    return {
      en_US: this.getTitle("en_US"),
    };
  }

  get textureSet() {
    return {
      color: this.id, // this.aHexColor,
      metalness_emissive_roughness: this._material.mer ?? <RGB> [
        this._material.metalness(this._level),
        this._material.emissive(this._level),
        this._material.roughness(this._level),
      ],
      normal: this._material.normal || "block_normal",
    } as const;
  }

  get blocksData() {
    return {
      // pbr_emissive_brightness: this._material.label === "emissive" ? 0 : 0,
      // brightness_gamma: this._material.label === "emissive" ? 0 : 0,
      textures: this.resourceId,
      // sound: this.behaviorId.replace(":", "."),
    };
  }

  get terrainData() {
    return {
      textures: `textures/blocks/${this.id}`,
    };
  }

  toString(prevBlock: BlockEntry, nextBlock: BlockEntry) {
    let group = "itemGroup.name.concrete";

    if (this._material.label?.startsWith("glass") === true) {
      group = "itemGroup.name.glass";
    } else if (this._material.label?.startsWith("metal") === true) {
      group = "itemGroup.name.copper";
    } else if (
      this._material.label === "emissive" || this._material.label === "dot_lit"
    ) {
      group = "itemGroup.name.stainedClay";
    }

    return JSON.stringify(
      {
        format_version: BEHAVIOR_BLOCK_FORMAT_VERSION,
        "minecraft:block": {
          description: {
            identifier: this.behaviorId,
            properties: this.properties(),
            menu_category: {
              category: "construction",
              group,
            },
          },
          components: this.behaviors(),
          events: this.events(prevBlock, nextBlock),
          permutations: this.permutations(),
        },
      },
      null,
      2,
    );
  }

  get alpha() {
    return this._material.opacity(this._level);
  }

  hexColor() {
    return this._color;
  }

  valueOf() {
    return hex2rgb(this._color);
  }

  setPosition(offset: number) {
    return [
      `~`,
      `~${offset}`,
      `~`,
    ].join(" ");
  }

  permutations() {
    return [];
  }

  properties() {
    return {};
  }

  behaviors() {
    const isGlass = this._material.label?.startsWith("glass") === true;

    const components: {
      [k: string]:
        | string
        | number
        | boolean
        | { [k: string]: string | number }
        | Record<never, never>;
    } = {
      "minecraft:material_instances": {
        "*": {
          texture: this.resourceId,
          render_method: isGlass ? "blend" : "opaque",
          face_dimming: this._material.label !== "emissive",
          ambient_occlusion: this._material.label === "emissive",
        },
      },
      //"minecraft:flammable": this._material.flammable ?? false,
      //"minecraft:friction": this._material.friction,
      // "minecraft:explosion_resistance": this._material.explosionResistance ??
      //   true,
      "minecraft:map_color": this.hexColor(),
      "minecraft:light_dampening": Math.round(this._material.lightAbsorption(
        this.level,
      )),
      "minecraft:light_emission": Math.round(this._material.lightEmission(
        this.level,
      )),
    };

    if (this._geometry) {
      components["minecraft:geometry"] = `geometry.${this._geometry}`;
    } else {
      components["minecraft:unit_cube"] = {};
    }

    return components;
  }

  events(prevBlock: BlockEntry, nextBlock: BlockEntry) {
    const eventData: Array<
      [
        string,
        MinecraftEvent,
      ]
    > = [];

    return Object.fromEntries(eventData);
  }

  serialize() {
    return {
      id: this.id,
      behaviorId: this.behaviorId,
      resourceId: this.resourceId,
      name: this.name,
      textureSet: this.textureSet,
      blocksData: this.blocksData,
      terrainData: this.terrainData,
      material: JSON.stringify(this._material),
      level: this._level,
    };
  }

  static deserialize(data: ReturnType<BlockEntry["serialize"]>) {
    const block = new BlockEntry(
      {
        name: data.name,
        color: data.id.split("_")[0],
      },
      JSON.parse(data.material),
      data.level,
    );

    return block;
  }
}
