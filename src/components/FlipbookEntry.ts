import type Material from "/src/components/Material.ts";
import type HueBlock from "/src/components/blocks/HueBlock.ts";
import type { LanguageId, RGB } from "/typings/types.ts";
import BlockEntry from "./BlockEntry.ts";

export function formatFlipbookName(color: string, material?: string): string {
  return `${color}_${material ? `${material}_` : ""}_flipbook`.toLowerCase()
    .replace(/[_ ]+/g, "_");
}

export default class FlipbookEntry extends BlockEntry {
  _base!: string;
  constructor(block: HueBlock, material: Material) {
    super(
      block,
      material,
    );

    this._base = formatFlipbookName(block.name);
  }

  get id() {
    return formatFlipbookName(this._base, this._material.label);
  }

  getTitle(lang: LanguageId) {
    return `${this._material.title(lang)} ${this.color.title(lang)} Flipbook`;
  }

  get textureSet() {
    return {
      color: this._base,
      metalness_emissive_roughness: <RGB> [
        this._material.metalness,
        this._material.emissive,
        this._material.roughness,
      ],
      ...this._material.depthMap,
    } as const;
  }
}
