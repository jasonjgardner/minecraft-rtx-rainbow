/**
 * Coherent Color Schemes for Biome Generation
 *
 * Based on research from procedural generation best practices:
 * - Colors grouped into climate zones (warm, cool, neutral)
 * - Hue wheel adjacency for smooth transitions
 * - Shade represents depth/temperature gradient within zones
 * - Analogous and complementary relationships preserved
 */

import type { Shades } from "../types.ts";

/** Color zone types based on temperature/mood */
export type ClimateZone = "warm" | "cool" | "neutral" | "accent";

/** Full hue wheel ordering for smooth transitions */
export const HUE_WHEEL = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "cyan",
  "light_blue",
  "blue",
  "purple",
  "magenta",
  "pink",
] as const;

export type HueColor = (typeof HUE_WHEEL)[number];

/** Neutral colors that act as transitions */
export const NEUTRALS = ["brown", "gray", "light_gray"] as const;
export type NeutralColor = (typeof NEUTRALS)[number];

export type ColorName = HueColor | NeutralColor;

/** Climate zone definitions with temperature and humidity ranges */
export interface ClimateConfig {
  temperature: [number, number]; // [min, max] - 0 = freezing, 1+ = warm
  downfall: [number, number]; // [min, max] - 0 = dry, 1 = wet
}

export const CLIMATE_ZONES: Record<ClimateZone, ClimateConfig> = {
  warm: { temperature: [0.8, 1.2], downfall: [0.0, 0.3] },
  cool: { temperature: [0.2, 0.6], downfall: [0.5, 0.9] },
  neutral: { temperature: [0.4, 0.8], downfall: [0.3, 0.6] },
  accent: { temperature: [0.6, 1.0], downfall: [0.4, 0.7] },
};

/** Map each color to its climate zone */
export const COLOR_ZONES: Record<ColorName, ClimateZone> = {
  // Warm zone: desert-like, dry, hot
  red: "warm",
  orange: "warm",
  yellow: "warm",

  // Cool zone: oceanic, wet, cold
  cyan: "cool",
  light_blue: "cool",
  blue: "cool",
  purple: "cool",

  // Accent zone: lush, moderate
  lime: "accent",
  green: "accent",
  pink: "accent",
  magenta: "accent",

  // Neutral zone: transitions, plains-like
  brown: "neutral",
  gray: "neutral",
  light_gray: "neutral",
};

/**
 * Biome theme - groups 2-3 adjacent colors into a coherent scheme
 * Each theme represents a distinct "world region"
 */
export interface BiomeTheme {
  name: string;
  primaryColor: ColorName;
  secondaryColor: ColorName;
  accentColor: ColorName;
  zone: ClimateZone;
  /** Colors blend into each other within this theme */
  colorBlend: ColorName[];
}

/**
 * Predefined biome themes based on color harmony principles:
 * - Analogous: adjacent colors on wheel (harmonious)
 * - Triadic: equidistant colors (balanced variety)
 */
export const BIOME_THEMES: BiomeTheme[] = [
  // Warm Desert Region
  {
    name: "desert",
    primaryColor: "orange",
    secondaryColor: "yellow",
    accentColor: "red",
    zone: "warm",
    colorBlend: ["red", "orange", "yellow"],
  },
  // Tropical Region
  {
    name: "tropical",
    primaryColor: "lime",
    secondaryColor: "green",
    accentColor: "yellow",
    zone: "accent",
    colorBlend: ["yellow", "lime", "green"],
  },
  // Ocean/Coastal Region
  {
    name: "oceanic",
    primaryColor: "cyan",
    secondaryColor: "light_blue",
    accentColor: "green",
    zone: "cool",
    colorBlend: ["green", "cyan", "light_blue"],
  },
  // Deep Ocean/Abyss Region
  {
    name: "abyss",
    primaryColor: "blue",
    secondaryColor: "purple",
    accentColor: "light_blue",
    zone: "cool",
    colorBlend: ["light_blue", "blue", "purple"],
  },
  // Mystic/Magical Region
  {
    name: "mystic",
    primaryColor: "magenta",
    secondaryColor: "pink",
    accentColor: "purple",
    zone: "accent",
    colorBlend: ["purple", "magenta", "pink"],
  },
  // Volcanic/Ember Region
  {
    name: "volcanic",
    primaryColor: "red",
    secondaryColor: "orange",
    accentColor: "pink",
    zone: "warm",
    colorBlend: ["pink", "red", "orange"],
  },
  // Stone/Mountain Region
  {
    name: "mountain",
    primaryColor: "gray",
    secondaryColor: "light_gray",
    accentColor: "brown",
    zone: "neutral",
    colorBlend: ["brown", "gray", "light_gray"],
  },
];

/**
 * Get adjacent colors for smooth biome transitions
 * Returns colors that should border each other naturally
 */
export function getAdjacentColors(color: ColorName): ColorName[] {
  // Handle neutrals - they can border anything in their zone
  if (NEUTRALS.includes(color as NeutralColor)) {
    return [...NEUTRALS.filter((n) => n !== color), "brown"] as ColorName[];
  }

  const hueIndex = HUE_WHEEL.indexOf(color as HueColor);
  if (hueIndex === -1) return [];

  const prev = HUE_WHEEL[(hueIndex - 1 + HUE_WHEEL.length) % HUE_WHEEL.length];
  const next = HUE_WHEEL[(hueIndex + 1) % HUE_WHEEL.length];

  return [prev, next];
}

/**
 * Calculate climate values based on shade
 * Lighter shades = highlands (cooler, drier)
 * Darker shades = lowlands (warmer, wetter)
 */
export function getClimateFromShade(
  shade: Shades,
  zone: ClimateZone,
): { temperature: number; downfall: number } {
  const config = CLIMATE_ZONES[zone];
  const shadeNormalized = (shade - 50) / 850; // 0-1 range from shade 50-900

  // Lighter shades = lower temp & downfall, darker = higher
  const tempRange = config.temperature[1] - config.temperature[0];
  const downRange = config.downfall[1] - config.downfall[0];

  return {
    temperature: config.temperature[0] + shadeNormalized * tempRange,
    downfall: config.downfall[0] + shadeNormalized * downRange,
  };
}

/**
 * Get harmonious color palette for a biome
 * Returns colors that work well together based on color theory
 */
export interface HarmoniousPalette {
  primary: ColorName;
  secondary: ColorName;
  tertiary: ColorName;
  water: ColorName;
  accent: ColorName;
}

export function getHarmoniousPalette(
  baseColor: ColorName,
  shade: Shades,
): HarmoniousPalette {
  const zone = COLOR_ZONES[baseColor];
  const adjacent = getAdjacentColors(baseColor);

  // Find theme this color belongs to
  const theme = BIOME_THEMES.find((t) => t.colorBlend.includes(baseColor));

  // Water color based on zone
  const waterColor: ColorName =
    zone === "warm"
      ? "cyan"
      : zone === "cool"
        ? "blue"
        : zone === "accent"
          ? "light_blue"
          : "gray";

  return {
    primary: baseColor,
    secondary: adjacent[0] ?? baseColor,
    tertiary: adjacent[1] ?? adjacent[0] ?? baseColor,
    water: waterColor,
    accent: theme?.accentColor ?? adjacent[0] ?? baseColor,
  };
}

/**
 * Generate cohesive sky/fog colors that match the biome palette
 * Uses lighter, desaturated versions of the base color
 */
export function getAtmosphereColors(
  baseColor: ColorName,
  shade: Shades,
): {
  skyColor: string;
  fogColor: string;
  waterSurfaceColor: string;
  waterFogColor: string;
} {
  const palette = getHarmoniousPalette(baseColor, shade);
  const zone = COLOR_ZONES[baseColor];

  // Base atmosphere colors by zone (more subtle than current implementation)
  const atmosphereBase: Record<ClimateZone, { sky: string; fog: string }> = {
    warm: { sky: "#FFE4B5", fog: "#FFDAB9" }, // Moccasin / Peach Puff
    cool: { sky: "#B0E0E6", fog: "#ADD8E6" }, // Powder Blue / Light Blue
    neutral: { sky: "#D3D3D3", fog: "#C0C0C0" }, // Light Gray / Silver
    accent: { sky: "#E6E6FA", fog: "#DDA0DD" }, // Lavender / Plum
  };

  // Water colors based on primary color zone
  const waterColors: Record<ClimateZone, { surface: string; fog: string }> = {
    warm: { surface: "#40E0D0", fog: "#20B2AA" }, // Turquoise / Light Sea Green
    cool: { surface: "#4169E1", fog: "#191970" }, // Royal Blue / Midnight Blue
    neutral: { surface: "#708090", fog: "#2F4F4F" }, // Slate Gray / Dark Slate Gray
    accent: { surface: "#00CED1", fog: "#008B8B" }, // Dark Turquoise / Dark Cyan
  };

  // Adjust brightness based on shade (lighter shades = brighter atmosphere)
  const brightnessOffset = (900 - shade) / 900; // 0-1, lighter = higher

  return {
    skyColor: atmosphereBase[zone].sky,
    fogColor: atmosphereBase[zone].fog,
    waterSurfaceColor: waterColors[zone].surface,
    waterFogColor: waterColors[zone].fog,
  };
}

/**
 * Determine which biomes can be adjacent to each other
 * Used for smooth world generation transitions
 */
export function canBeAdjacent(colorA: ColorName, colorB: ColorName): boolean {
  // Same color always ok
  if (colorA === colorB) return true;

  // Check if in same theme
  const themeA = BIOME_THEMES.find((t) => t.colorBlend.includes(colorA));
  const themeB = BIOME_THEMES.find((t) => t.colorBlend.includes(colorB));

  if (themeA && themeB && themeA.name === themeB.name) return true;

  // Check if adjacent on hue wheel
  const adjacent = getAdjacentColors(colorA);
  if (adjacent.includes(colorB)) return true;

  // Neutrals can border anything
  if (
    NEUTRALS.includes(colorA as NeutralColor) ||
    NEUTRALS.includes(colorB as NeutralColor)
  ) {
    return true;
  }

  return false;
}

/**
 * Get the noise frequency scale for biome replacement
 * Higher values = more fragmented (smaller patches)
 * Lower values = more coherent (larger regions)
 */
export function getNoiseFrequencyForTheme(theme: BiomeTheme): number {
  // Warm and cool zones get larger coherent regions
  // Neutral zones are more scattered (transitional)
  switch (theme.zone) {
    case "warm":
      return 15; // Large desert regions
    case "cool":
      return 20; // Large oceanic regions
    case "accent":
      return 35; // Medium lush regions
    case "neutral":
      return 50; // Scattered transitional areas
    default:
      return 25;
  }
}

export default {
  HUE_WHEEL,
  NEUTRALS,
  CLIMATE_ZONES,
  COLOR_ZONES,
  BIOME_THEMES,
  getAdjacentColors,
  getClimateFromShade,
  getHarmoniousPalette,
  getAtmosphereColors,
  canBeAdjacent,
  getNoiseFrequencyForTheme,
};
