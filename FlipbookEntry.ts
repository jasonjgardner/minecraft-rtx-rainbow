import type { IBlock, IMaterial, LanguageId, RGB } from "./types.ts";
import BlockEntry from "./BlockEntry.ts";

export function formatFlipbookName(color: string, material?: string): string {
  return `${color}_${material ? `${material}_` : ""}_flipbook`.toLowerCase()
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
      75,
    );

    this._base = formatFlipbookName(block.color);
  }

  get id() {
    return formatFlipbookName(this._id, this._material.name.en_US);
  }

  getTitle(lang: LanguageId) {
    return `${this._material.name[lang]} ${this.color} ${this.tint} Flipbook`;
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
