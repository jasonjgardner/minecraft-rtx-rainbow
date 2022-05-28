import type Material from "/src/components/Material.ts";
import type HueBlock from "/src/components/blocks/HueBlock.ts";
import { v4 } from "https://deno.land/std@0.140.0/uuid/mod.ts";

export type ChannelValue = number;

export type RGB = [ChannelValue, ChannelValue, ChannelValue];

export type RGBA = [ChannelValue, ChannelValue, ChannelValue, ChannelValue];

export function isRgbNumber(value: number): value is ChannelValue {
  return Number.isInteger(value) && value >= 0 && value < 256;
}

export function isRgbaArray(value: number[]): value is RGBA {
  return value.length === 4 && value.every(isRgbNumber);
}

export type PackSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024;

export type LanguageId = "en_US" | "en_GB"; // TODO: Add more languages

export type PaletteInput = File | string | null;

export type Alignment = "e2e" | "b2b" | "even" | "odd" | "none";

export type Axis = "x" | "y" | "z";

export type UUID = string;

export function isUUID(value: string): value is UUID {
  return v4.validate(value);
}

export type PackIDs = [UUID, UUID, UUID, UUID];

export interface TextureSet {
  heightmap?: string;
  normal?: string;
  color: string | RGB | RGBA;
  metalness_emissive_roughness?: string | RGB;
}

export interface BlockComponents {
  description: MinecraftData;
  components: MinecraftData;
  events: { [k: string]: MinecraftEvent };
  permutations: MinecraftData[];
}

export interface FlipbookComponent {
  flipbook_texture: string;
  atlas_tile: string;
  atlas_index?: number;
  ticks_per_frame: number;
  frames: number[];
  replicate?: number;
  blend_frames?: boolean;
}

export type MaterialMultiplier = (idx: number) => number;

export type MinecraftTerrainData = {
  [key: string]: {
    textures: string | string[];
  };
};

export type MinecraftRecordTypes = boolean | string | number;

export type MinecraftData = {
  [key: string]: MinecraftData | MinecraftRecordTypes;
};

export type MinecraftEvent = {
  [key: string]:
    | {
      [key: string]:
        | MinecraftRecordTypes
        | MinecraftEvent
        | Array<
          | MinecraftRecordTypes
          | MinecraftEvent
          | {
            [key: string]: MinecraftRecordTypes | MinecraftEvent;
          }
        >;
    }
    | MinecraftRecordTypes
    | MinecraftEvent[];
};

export type MultiLingual = {
  [key in LanguageId]: string;
};

export type LanguagesContainer = Record<LanguageId, string[]>;

export interface IPermutation {
  name: string;
  enabled?: boolean;
  experimental?: boolean;
  properties: MinecraftData;
  events: MinecraftEvent;
  permutations: MinecraftData[];
}

export interface CreationParameters {
  size: PackSizes;
  namespace: string;
  pixelArtSourceName?: string;
  description?: string;
  blockColors?: HueBlock[];
  materialOptions?: Material[];
  outputFunctions?: boolean;
  outputPixelArt?: boolean;
  pixelArtSource?: string;
  animationAlignment?: Alignment;
}
