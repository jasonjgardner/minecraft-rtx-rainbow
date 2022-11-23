import type {
  IBlock,
  IMaterial,
  LanguageId,
  RGB,
} from "../../typings/types.ts";

import BlockEntry from "./BlockEntry.ts";

export function formatFlipbookName(
  color: string,
  material?: IMaterial,
): string {
  return `${color}_${material ? `${material.name.en_US}_` : ""}_flipbook`
    .toLowerCase()
    .replace(/[_ ]+/g, "_");
}

export default class FlipbookEntry extends BlockEntry implements IBlock {
  _base!: string;
  constructor(block: BlockEntry, material: IMaterial) {
    super(
      {
        name: block.color,
        color: block.hexColor(),
      },
      material,
      50,
    );

    this._base = formatFlipbookName(block.color, material);
  }

  get id() {
    return this._base;
  }

  getTitle(lang: LanguageId) {
    return `${super.getTitle(lang)} Flipbook`;
  }

  get textureSet() {
    return {
      color: this._base,
      metalness_emissive_roughness: <RGB> [
        this._material.metalness(this._level),
        this._material.emissive(this._level),
        this._material.roughness(this._level),
      ],
      normal: this._material.normal || "block_normal",
    } as const;
  }
}
