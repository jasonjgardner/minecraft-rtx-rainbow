import titleCase from "case/titleCase.ts";
import type { LanguageId, MultiLingual, MinecraftData } from "/typings/types.ts";
import { formatHex, parse } from "culori/index.js";

import { formatTag, labelLanguage } from "/src/components/BlockEntry.ts";

type RgbColor = { mode: "rgb"; r: number; g: number; b: number; alpha: number };

export default class HueBlock {
  _color!: RgbColor;
  _name?: MultiLingual;
  constructor(color: string, name?: MultiLingual) {
    this._color = parse(color);
    this._name = name;
  }

  title(lang: LanguageId = "en_US") {
    return titleCase(
      (this._name ? this._name[lang] : false) || `${formatHex(this._color)}`,
    );
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
      color: this.rgba
    };
  }

  get components(): MinecraftData {
    return {
      ...formatTag(this.name),
      "minecraft:map_color": this.hex,
    };
  }

  valueOf() {
    return this.rgba;
  }
}
