export type RGB = [number, number, number];

export type PackSizes = 16 | 32 | 64 | 128 | 256;

export type LanguageId = "en_US";

export type MaterialMultiplier = (idx: number) => number;

export type MinecraftRecordTypes = boolean | string | number;

export type MinecraftData = {
  [key: string]: MinecraftData | MinecraftRecordTypes
}

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

  minimumLevel: number;
  maximumLevel: number;

  endStep: number;

  step: number;
}