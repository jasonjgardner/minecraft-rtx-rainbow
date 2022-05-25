import type {
  LanguageId,
  MinecraftData,
  MultiLingual,
  RGB,
  TextureSet,
} from "/typings/types.ts";
import {
  AO_EMISSIVE_THRESHOLD,
  DEFAULT_BLOCK_SOUND,
  DEFAULT_HEIGHTMAP_NAME,
} from "/typings/constants.ts";
import { basename, extname } from "path/mod.ts";

/**
 * Convert emissive percentage value to 'minecraft:block_light_filter' value
 * @param percentage Emissive percentage
 * @returns Block light filter level (0-15)
 */
// function clampBlockLightFilter(percentage: number) {
//   /**
//    * The amount of light this block will filter out. Higher value means more light will be filtered out (0 - 15).
//    * @see https://bedrock.dev/docs/stable/Blocks
//    */
//   const BLOCK_LIGHT_FILTER_MAX = 15;

//   if (percentage > 1) {
//     percentage /= 100;
//   }

//   return Math.max(
//     0,
//     Math.min(
//       BLOCK_LIGHT_FILTER_MAX,
//       Math.round(percentage * BLOCK_LIGHT_FILTER_MAX),
//     ),
//   );
// }

export default class Material {
  _label!: string;
  _name!: MultiLingual;

  /**
   * Path to normal map in assets directory
   */
  _normalMap?: string;

  _heightMap?: string;

  /**
   * Set to TRUE to prefer height map over normal maps
   */
  _useHeightMap = false;

  _translucent = false;

  constructor(label: string, name: MultiLingual) {
    this._label = label;
    this._name = name;
  }

  set label(value: string) {
    this._label = value.trim().toLowerCase();
  }

  get label(): string {
    return this._label;
  }

  set name(langs: MultiLingual) {
    this._name = langs;
  }

  get name() {
    return this._name;
  }

  title(lang: LanguageId = "en_US") {
    return this._name[lang];
  }
  get metalness() {
    return Math.round(255 * 0.5);
  }

  get roughness() {
    return Math.round(255 * 0.5);
  }

  get emissive() {
    return 0;
  }

  get depthMap() {
    const hasNormalMap = this._normalMap !== undefined &&
      this._normalMap.length;

    if (hasNormalMap && !this._useHeightMap) {
      return {
        normal: basename(`${this._normalMap}`, extname(`${this._normalMap}`)),
      };
    }

    if (!this._heightMap && (this._useHeightMap || !hasNormalMap)) {
      this._heightMap = DEFAULT_HEIGHTMAP_NAME;
    }

    return {
      heightmap: basename(`${this._heightMap}`, extname(`${this._heightMap}`)),
    };
  }

  get blocksData(): MinecraftData {
    return {
      //pbr_emissive_brightness: (this.emissive / 255).toFixed(2) || 0,
      sound: DEFAULT_BLOCK_SOUND,
    };
  }

  get textureSet() {
    const values: Omit<TextureSet, "color"> = {
      metalness_emissive_roughness: <RGB> [
        this.metalness,
        this.emissive,
        this.roughness,
      ],
    };

    const depth = this.depthMap;

    if (depth.heightmap && !depth.normal) {
      values.heightmap = depth.heightmap;
    }

    if (depth.normal && !depth.heightmap) {
      values.normal = depth.normal;
    }

    return values;
  }

  get materialInstance() {
    return {
      "*": {
        ambient_occlusion: 100 * (this.emissive / 255) < AO_EMISSIVE_THRESHOLD, // Allow AO if block isn't too bright
        face_dimming: !this.emissive,
      },
    };
  }

  get components(): { [k: string]: string | number | Record<never, never> } {
    const emissivePercentage = Math.floor(this.emissive / 255);

    return {
      "minecraft:unit_cube": Object.freeze({}),
      "minecraft:material_instances": this.materialInstance,
      //"minecraft:block_light_filter": clampBlockLightFilter(emissivePercentage),
      "minecraft:block_light_emission": emissivePercentage,
    };
  }

  /**
   * Controls combining materials and HueBlocks with alpha transparency
   */
  get translucent() {
    return this._translucent === true;
  }
}
