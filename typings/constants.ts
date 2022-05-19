import type { ReleaseType } from "semver/mod.ts";
import { PackSizes } from "/typings/types.ts";

export const MIN_PACK_SIZE: PackSizes = 16;
export const MAX_PACK_SIZE: PackSizes = 1024;

export const DEFAULT_PACK_SIZE: PackSizes = MIN_PACK_SIZE;

export const DEFAULT_NAMESPACE = "rainbow";
export const BEHAVIOR_BLOCK_FORMAT_VERSION = "1.16.100";

export const DEFAULT_RELEASE_TYPE: ReleaseType = "prerelease";

export const DEFAULT_HEIGHTMAP_NAME = "default_heightmap";

/**
 * Emissive level at which ambient occlusion is disabled on a block's face
 */
export const AO_EMISSIVE_THRESHOLD = 50;

/**
 * Default sound ID applied in blocks.json
 */
export const DEFAULT_BLOCK_SOUND = "dirt";

export const GLASS_ID = "glass";
export const MAX_FRAMES = 10;
export const FUNCTIONS_NAMESPACE = "print";

export const MIN_PALETTE_LENGTH = 2;

export const CHUNK_SIZE = 16;
export const MAX_PRINT_SIZE = 24 * CHUNK_SIZE;

// Print 1:1 scale
export const DEFAULT_PRINT_CHUNKS = 1;

export const MAX_PRINT_CHUNKS = CHUNK_SIZE;

export const MAX_FUNCTION_LINES = 10000;

export const DEFAULT_PRINT_BLOCK = "minecraft:stone";

export const TRANSPARENT_PRINT_BLOCK = "minecraft:air";

export const TRANSPARENT_PRINT_BLOCK_THRESHOLD = 0.5;

export const TARGET_VERSION: [number, number, number] = [1, 18, 3];

export const DEFAULT_BUILD_VERSION = "1.0.0";

export const PACK_ICON_SIZE = 256;
export const PACK_ICON_FONT_SIZE = 12;

export const ART_SOURCE_ID = "input";
