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
          MinecraftRecordTypes | MinecraftEvent | {
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

export type BlendModes =
  | "source-over"
  | "source-in"
  | "source-atop"
  | "destination-over"
  | "lighter"
  | "copy"
  | "xor"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

export interface IMaterial {
  name: MultiLingual;
  label?: string;
  normal?: string;
  sound?: string;
  friction: MaterialMultiplier;
  flammable?: {
    burn_odds: number;
    flame_odds: number;
  };

  explosionResistance: MaterialMultiplier;

  lightAbsorption: MaterialMultiplier;

  lightEmission: MaterialMultiplier;
  metalness: MaterialMultiplier;
  emissive: MaterialMultiplier;
  roughness: MaterialMultiplier;
  opacity: MaterialMultiplier;

  minimumLevel: number;
  maximumLevel: number;

  endStep: number;

  step: number;

  steps: number[];

  geometry?: string;
  shading?: {
    texture: string;
    blend: BlendModes | [BlendModes, BlendModes];
  }[];
  render?: (block: IBlock, size: number) => Promise<Uint8Array>;
}

export interface IBlock {
  name: string | MultiLingual;
  enabled?: boolean;
  color: string;
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

export type WssState = {
  currentRequestIdx: number;
  updatePending?: boolean;
  sendRate?: number;
  offset?: [number, number, number];
  useAbsolutePosition?: boolean;
  axis?: Axis;
  material?: string;
  blockHistory: Array<[number, number, number]>;
  blockHistoryMaxLength: number;
  functionLog?: string;
};

export interface WssParams {
  parameters: URLSearchParams;
  queueCommandRequest: (commandLine: string) => void;
  formatPosition: (
    x: number,
    y: number,
    z: number,
    offsetX?: number,
    offsetY?: number,
    offsetZ?: number,
  ) => string;
  state?: WssState;
}
