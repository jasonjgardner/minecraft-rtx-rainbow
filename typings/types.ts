// TODO: type guard RGB(A)
export type RGB = [number, number, number];

export type RGBA = [number, number, number, number];

export type RgbaObj = { r: number; g: number; b: number; alpha: number };

export type PackSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024;

export type LanguageId = "en_US";

export type OutputMap = [string, string][];

export type DataOutputMap = [string, Uint8Array][];

export type CopyMap = [string, string[]][];

export type PaletteInput = File | string | null;

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
          MinecraftRecordTypes | MinecraftEvent | {
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

export interface IBlock {
  name: string | MultiLingual;
  enabled?: boolean;
  color: string;
  tint: number;
}

export interface IPermutation {
  name: string;
  enabled?: boolean;
  experimental?: boolean;
  properties: MinecraftData;
  events: MinecraftEvent;
  permutations: MinecraftData[];
}

export interface DepthMap {
  heightmap: boolean;
  texture: string;
}
