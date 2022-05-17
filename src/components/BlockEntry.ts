import type {
  BlockComponents,
  IPermutation,
  LanguageId,
  MinecraftData,
  MinecraftEvent,
  TextureSet,
} from "/typings/types.ts";
import { Label } from "/typings/enums.ts";
import {
  BEHAVIOR_BLOCK_FORMAT_VERSION,
  DEFAULT_NAMESPACE,
} from "/typings/constants.ts";
import titleCase from "case/titleCase.ts";
import { sprintf } from "fmt/printf.ts";
import { deepMerge } from "collections/mod.ts";
import { sanitizeNamespace } from "/src/_utils.ts";
import HueBlock from "/src/components/blocks/HueBlock.ts";
import Material from "/src/components/Material.ts";

export const labelLanguage: LanguageId = "en_US";

export default class BlockEntry {
  _namespace!: string;
  _idx!: number;

  _hue!: HueBlock;

  _material!: Material;

  _permutations?: IPermutation[];

  _printable?: boolean;
  constructor(namespace: string, block: HueBlock, material: Material) {
    this.namespace = namespace;
    this._hue = block;
    this._material = material;
  }

  set namespace(value: string) {
    this._namespace = sanitizeNamespace(value);
  }

  get namespace() {
    return this._namespace ?? DEFAULT_NAMESPACE;
  }

  set printable(value: boolean) {
    this._printable = value;
  }

  get printable() {
    return this._printable !== false;
  }
  get color() {
    return this._hue;
  }

  get material() {
    return this._material;
  }

  get id() {
    return sprintf(
      "%s_%s",
      this._hue.name,
      this._material.label,
    ).replace(/\s+/g, "_").toLowerCase();
  }

  get behaviorId() {
    return sprintf("%s:%s", this.namespace, this.id);
  }

  get resourceId() {
    return sprintf("%s_%s", this.namespace, this.id);
  }

  title(lang: LanguageId) {
    return titleCase(sprintf(
      "%s %s",
      this._material.title(lang),
      this._hue.title(lang),
    ));
  }

  get name() {
    return this.title(labelLanguage);
  }

  get textureSet() {
    return deepMerge(this._hue.textureSet, this._material.textureSet);
  }

  get blocksData() {
    return deepMerge({
      textures: this.resourceId,
    }, this._material.blocksData);
  }

  get terrainData() {
    return {
      textures: `textures/blocks/${this.id}`,
    };
  }

  get permutations(): IPermutation[] | [] {
    return this._permutations || [];
  }

  formatEvent(
    { name, events }: IPermutation,
  ): [string, MinecraftEvent] {
    return [
      sprintf("%s:%s_%s", this.namespace, name, Label.BlockEvent),
      events,
    ];
  }

  formatProperty(
    { name, properties }: IPermutation,
  ): [string, MinecraftData] {
    return [
      sprintf("%s:%s%s", this.namespace, name, Label.BlockProperty),
      properties,
    ];
  }

  get block() {
    const permutes = this.permutations.filter(({ enabled }: IPermutation) =>
      enabled !== false
    );

    const block: BlockComponents = {
      description: {
        identifier: this.behaviorId,
        is_experimental: permutes.some((
          { experimental }: IPermutation,
        ) => experimental === true),
        register_to_creative_menu: "minecraft:creative_category" in
            this.components ||
          this.permutations.some(({ permutations }: IPermutation) =>
            permutations.filter((
              { ["minecraft:creative_category"]: category },
            ) => category !== undefined)
          ),
        properties: {},
      },
      components: this.components,
      events: {},
      permutations: [],
    };

    if (permutes.length) {
      block.description.properties = Object.fromEntries(
        permutes.map((p) => this.formatProperty(p)),
      );
      block.events = Object.fromEntries(
        permutes.map((p) => this.formatEvent(p)),
      );

      block.permutations = permutes.flatMap((
        { permutations }: IPermutation,
      ) => permutations);
    }

    return block;
  }

  toString() {
    return JSON.stringify(
      {
        format_version: BEHAVIOR_BLOCK_FORMAT_VERSION,
        "minecraft:block": this.block,
      },
    );
  }

  get materialInstances() {
    return deepMerge({
      "*": {
        texture: this.resourceId,
      },
    }, this._material.materialInstance);
  }

  get components() {
    return deepMerge(
      {
        "minecraft:material_instances": this.materialInstances,
      },
      deepMerge(this._hue.components, this._material.components),
    );
  }
}
