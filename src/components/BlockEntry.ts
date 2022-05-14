import type {
  IPermutation,
  LanguageId,
  MinecraftData,
  MinecraftEvent,
  RGB,
} from "/typings/types.ts";
import { Label } from "/typings/enums.ts";
import {
  BEHAVIOR_BLOCK_FORMAT_VERSION,
  NAMESPACE,
} from "/src/store/_config.ts";
import titleCase from "case/titleCase.ts";
import { sprintf } from "fmt/printf.ts";
import HueBlock from "/src/components/blocks/HueBlock.ts";
import Material from "/src/components/Material.ts";

interface TextureSet {
  heightmap?: string;
  normal?: string;
  color: string | RGB | number[];
  metalness_emissive_roughness?: RGB | number[];
}

interface BlockComponents {
  description: MinecraftData;
  components: MinecraftData;
  events: { [k: string]: MinecraftEvent };
  permutations: MinecraftData[];
}

export const labelLanguage: LanguageId = "en_US";

export function formatTag(tagName: string) {
  return {
    [
      sprintf(
        "tag:%s:%s",
        NAMESPACE,
        tagName.replace(/\s+/, "").toLowerCase(),
      )
    ]: {},
  };
}

export default class BlockEntry {
  _idx!: number;

  _hue!: HueBlock;

  _material!: Material;

  _permutations?: IPermutation[];

  _printable?: boolean;
  constructor(block: HueBlock, material: Material) {
    this._hue = block;
    this._material = material;
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
    ).toLowerCase();
  }

  get behaviorId() {
    return `${NAMESPACE}:${this.id}`;
  }

  get resourceId() {
    return `${NAMESPACE}_${this.id}`;
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

  get textureSet(): TextureSet {
    return {
      ...this._hue.textureSet,
      ...this._material.textureSet,
    };
  }

  get blocksData() {
    return {
      textures: this.resourceId,
      ...this._material.blocksData,
    } as const;
  }

  get terrainData() {
    return {
      textures: `textures/blocks/${this.id}`,
    } as const;
  }

  get permutations(): IPermutation[] | [] {
    return this._permutations || [];
  }

  get block() {
    const formatEvent = (
      { name, events }: IPermutation,
    ): [string, MinecraftEvent] => {
      return [sprintf("%s:%s_%s", NAMESPACE, name, Label.BlockEvent), events];
    };

    const formatProperty = (
      { name, properties }: IPermutation,
    ): [string, MinecraftData] => {
      return [
        sprintf("%s:%s%s", NAMESPACE, name, Label.BlockProperty),
        properties,
      ];
    };

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
        permutes.map(formatProperty),
      );
      block.events = Object.fromEntries(permutes.map(formatEvent));

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
    // TODO: Allow material instance per face/bone
    return {
      "*": {
        texture: this.resourceId,
        ...this._material.materialInstance,
      },
    } as const;
  }

  get components() {
    return {
      // ...formatTag(this._hue.name),
      // ...formatTag(
      //   `material:${this._material.label}`,
      // ),
      ...this._hue.components,
      ...this._material.components,
    } as const;
  }
}
