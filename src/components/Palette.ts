import HueBlock from "/src/components/blocks/HueBlock.ts";

export default class Palette {
  _hues!: HueBlock[];
  _fns?: { [k: string]: string };

  _name!: string;
  constructor(name: string) {
    this.name = name;
  }

  addHue(hue: HueBlock): Palette {
    this._hues.push(hue);
    return this;
  }

  set name(value: string) {
    this._name = value.trim().toLowerCase();
  }

  get name() {
    return this._name;
  }
}
