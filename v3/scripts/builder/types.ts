export type RGB = [number, number, number];

export type PackSizes = 16 | 32 | 64 | 128 | 256;

export type LanguageId = "en_US";

export type OutputMap = [string, string][];

export type DataOutputMap = [string, Uint8Array][];

export type CopyMap = [string, string[]][];

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

export type MinecraftRecordTypes =
  | boolean
  | string
  | number
  | MinecraftRecordTypes[];

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

export type MinecraftPermute = {
  [key: string]: MinecraftRecordTypes | MinecraftPermute;
};

export type MultiLingual = {
  [key in LanguageId]: string;
};

export type LanguagesContainer = Record<LanguageId, string[]>;

export interface IBlock {
  id: string;
  name: string | MultiLingual;
  enabled?: boolean;
  color: string;
  isotropic?: boolean;
  sound?: string;
}

export type Axis = "x" | "y" | "z";

export type PackModule = {
  uuid?: string;
  module_name?: string;
  description?: string;
  version: number[] | string;
  language?: "javascript" | "json";
  type?: "script" | "data" | "resource";
  entry?: string;
};

export interface IColorShades {
  shades: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}
