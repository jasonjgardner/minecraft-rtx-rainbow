import type {
  LanguageId,
  MinecraftData,
  MultiLingual,
  RGB,
  RGBA,
  RgbaObj,
} from "/typings/types.ts";
import { clamp, formatAhex, formatHex } from "/src/_utils.ts";

import { labelLanguage } from "/src/components/BlockEntry.ts";

export default class HueBlock {
  _color!: RgbaObj;
  _name?: MultiLingual;
  constructor(color: RGB | RGBA, name?: MultiLingual) {
    this._color = {
      r: clamp(color[0], 255),
      g: clamp(color[1], 255),
      b: clamp(color[2], 255),
      alpha: color.length === 4 ? clamp(color[3], 1) : 1,
    };
    this._name = name;
  }

  title(lang: LanguageId = "en_US") {
    return this._name
      ? this._name[lang]
      : `${formatHex(this._color).replace("#", "").toUpperCase()}`;
  }

  get name() {
    return this.title(labelLanguage);
  }
  get value() {
    return this._color;
  }

  get hex() {
    return `${formatHex(this._color)}`;
  }

  get rgba() {
    return [
      this._color.r || 0,
      this._color.b || 0,
      this._color.g || 0,
      this._color.alpha ?? 1,
    ];
  }

  get textureSet() {
    return {
      color: formatAhex(this._color),
    };
  }

  get components(): MinecraftData {
    return {
      //...formatTag(this.name),
      "minecraft:map_color": this.hex,
    };
  }

  valueOf() {
    return this.rgba;
  }
}
