import titleCase from "https://deno.land/x/case@v2.1.0/titleCase.ts";
import type {
  IBlock,
  IMaterial,
  LanguageId,
  MinecraftEvent,
  RGB,
} from "./types.ts";
import { channelPercentage, hex2rgb } from "./_utils.ts";
import { BEHAVIOR_BLOCK_FORMAT_VERSION, NAMESPACE } from "./_config.ts";

export default class BlockEntry {
  _id!: string;

  _hue!: string;

  _tint!: string | number;

  _material: IMaterial;
  _level: number;
  _value!: string;
  _color!: string;
  constructor({ name, color }: IBlock, material: IMaterial, level: number) {
    if (typeof name !== 'string')  {
      name = name.en_US
    }

    const lastDash = name.lastIndexOf("_");
    this._tint = name.substring(lastDash + 1);
    this._hue = name.substring(0, lastDash);
    this._level = Math.abs(level);
    this._material = material;
    this._id = name;
    this._color = color;
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
    return `${this._id}_${this._material.name.en_US}_${this._level}`
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
      color: this.aHexColor,
      metalness_emissive_roughness: <RGB> [
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
      sound: this._material.sound || "dirt",
    };
  }

  get terrainData() {
    return {
      textures: `textures/blocks/${this.id}`,
    };
  }

  toString(prevBlock: BlockEntry, nextBlock: BlockEntry) {
    return JSON.stringify(
      {
        format_version: BEHAVIOR_BLOCK_FORMAT_VERSION,
        "minecraft:block": {
          description: {
            identifier: this.behaviorId,
            is_experimental: false,
            register_to_creative_menu: true,
            properties: this.properties(),
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

  get aHexColor() {
    const opacityLevel = this._material.opacity(this._level);

    if (opacityLevel >= 1) {
      return `#ff${this._color.substring(1)}`;
    }

    const alpha = 100 - channelPercentage(opacityLevel);

    return "#" + (alpha < 7 ? "0" : "") + alpha.toString(16) +
      this._color.substring(1);
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
    return {
      "minecraft:creative_category": {
        category: "construction",
        group: this._material.label === "glass"
          ? "itemGroup.name.glass"
          : "itemGroup.name.concrete",
      },
      "minecraft:unit_cube": {},
      "minecraft:breakonpush": false,
      "minecraft:material_instances": {
        "*": {
          texture: this.resourceId,
          render_method: this._material.label === "glass" ? "blend" : "opaque",
          face_dimming: this._material.label !== "emissive",
          ambient_occlusion: this._material.label === "emissive",
        },
      },
      "minecraft:flammable": this._material.flammable,
      "minecraft:friction": this._material.friction,
      "minecraft:explosion_resistance": this._material.explosionResistance || 0,
      "minecraft:map_color": this.hexColor(),
      "minecraft:block_light_absorption": this._material.lightAbsorption(
        this.level,
      ),
      "minecraft:block_light_emission": this._material.lightEmission(
        this.level,
      ),
      "minecraft:on_interact": {
        // Recolor when holding rainbow
       // condition: `query.get_equipped_item_name('slot.weapon.mainhand') == '${NAMESPACE}.rainbow_trail_key'`,
        event: `${NAMESPACE}:recolor1`,
      },
      "minecraft:on_step_on": {
        event: `${NAMESPACE}:recolor2`,
      },
    } as const;
  }

  events(prevBlock: BlockEntry, nextBlock: BlockEntry) {
    const eventData: Array<
      [
        string,
        MinecraftEvent,
      ]
    > = [];

    eventData.push([`${NAMESPACE}:recolor1`, {
      set_block: {
        block_type: prevBlock.behaviorId,
      },
    }]);

    eventData.push([`${NAMESPACE}:recolor2`, {
      set_block: {
        block_type: nextBlock.behaviorId,
      },
    }]);

    return Object.fromEntries(eventData);
  }
}
