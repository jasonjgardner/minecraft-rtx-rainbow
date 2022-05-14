import type { LanguageId, MultiLingual, RGB, MinecraftData } from "/typings/types.ts";
import { sprintf } from "fmt/printf.ts";
import {
  AO_EMISSIVE_THRESHOLD,
  DEFAULT_BLOCK_SOUND,
  NAMESPACE,
} from "/src/store/_config.ts";

//import { labelLanguage } from '/src/components/BlockEntry.ts'

/**
 * Convert emissive percentage value to 'minecraft:block_light_filter' value
 * @param percentage Emissive percentage
 * @returns Block light filter level (0-15)
 */
function clampBlockLightFilter(percentage: number) {
  /**
   * The amount of light this block will filter out. Higher value means more light will be filtered out (0 - 15).
   * @see https://bedrock.dev/docs/stable/Blocks
   */
  const BLOCK_LIGHT_FILTER_MAX = 15;

  if (percentage > 1) {
    percentage /= 100;
  }

  return Math.max(
    0,
    Math.min(
      BLOCK_LIGHT_FILTER_MAX,
      Math.round(percentage * BLOCK_LIGHT_FILTER_MAX),
    ),
  );
}

export default class Material {
  _label!: string;
  _name!: MultiLingual;

  _normalMap?: string;

  _heightMap?: string;

  /**
   * Set to TRUE to prefer height map over normal maps
   */
  _useHeightMap = false;

   /**
   * 1 - 100
   */
  _intensity = 1;

  _intensityRange: [number, number] = [0, 100];

  _intensityStep = 1;

  constructor(intensity: number, label: string, name: MultiLingual) {
    this._label = label;
    this._name = name;
    this._intensity = intensity;
  }
  
  set label(value: string) {
    this._label = value.trim().toLowerCase();
  }

  get label() {
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
    return Math.ceil((Math.max(0, this._intensity) * 255) / 100);
  }

  get roughness() {
    return Math.ceil((Math.max(0, 100 - this._intensity) * 255) / 100);
  }

  get emissive() {
    return Math.floor((Math.max(0, 100 - this._intensity) * 255) / 100);
  }

  get depthMap() {
    const hasNormalMap = this._normalMap !== undefined &&
      this._normalMap.length;

    if (hasNormalMap && !this._useHeightMap) {
      return {
        normal: this._normalMap,
      } as const;
    }

    if (
      this._heightMap !== undefined && (this._useHeightMap || !hasNormalMap)
    ) {
      return {
        heightmap: this._heightMap,
      } as const;
    }

    return undefined;
  }

  get blocksData(): MinecraftData {
    return {
      //pbr_emissive_brightness: (this.emissive / 255).toFixed(2) || 0,
      sound: DEFAULT_BLOCK_SOUND,
    };
  }

  get textureSet() {
    return {
      metalness_emissive_roughness: <RGB> [
        this.metalness,
        this.emissive,
        this.roughness,
      ],
      ...this.depthMap,
    } as const;
  }

  get materialInstance() {
    return {
      ambient_occlusion:
        (this._intensity * (this.emissive / 255)) < AO_EMISSIVE_THRESHOLD, // Allow AO if block isn't too bright
      face_dimming: !this.emissive,
    } as const;
  }

  get components() {
    const emissivePercentage = this.emissive / 255;

    return {
      // [
      //   sprintf(
      //     "tag:%s:%s",
      //     NAMESPACE,
      //     this.label.replace(/\s+/, ""),
      //   )
      // ]: {},
      "minecraft:material_instances": this.materialInstance,
      "minecraft:block_light_filter": clampBlockLightFilter(emissivePercentage),
      "minecraft:block_light_emission": emissivePercentage,
    } as const;
  }

  get intensityRange() {
    return this._intensityRange;
  }

  set intensityRange(value: [number, number]) {
    this._intensityRange = [Math.min(...value), Math.max(...value)];
  }

  get intensityStep() {
    return this._intensityStep || 1;
  }

  set intensityStep(value: number) {
    const MAX_INTENSITY = Math.min(1000, this._intensityRange[1]); // P.S. "Max Intensity" is a cool name 💪
    this._intensityStep = Math.max(1, Math.min(MAX_INTENSITY, value));
  }
}
