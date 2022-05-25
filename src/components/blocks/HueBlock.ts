import type {
  LanguageId,
  MinecraftData,
  MultiLingual,
  RGB,
  RGBA,
} from "/typings/types.ts";
import { formatAhex, hexValue } from "../../_utils.ts";

import { labelLanguage } from "../BlockEntry.ts";

export default class HueBlock {
  _color!: RGBA;
  _name?: MultiLingual;
  constructor(color: RGB | RGBA, name?: MultiLingual) {
    if (color.length < 4) {
      color[3] = 255;
    }

    this._color = <RGBA> color;
    this._name = name;
  }

  title(lang: LanguageId = "en_US") {
    return this._name
      ? this._name[lang]
      : hexValue(this._color).replace("#", "").toUpperCase();
  }

  get name() {
    return this.title(labelLanguage).replaceAll(/\s+/g, "_");
  }

  get hex() {
    return `${hexValue(this._color)}`;
  }

  get rgba() {
    return this._color;
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
}
