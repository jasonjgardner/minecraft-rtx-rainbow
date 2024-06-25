import type { PackSizes } from "./types.ts";
import { join } from "node:path";
export const ROOT_DIR = process.cwd();
export const TEXTURES_DIR = join(ROOT_DIR, "blocks");
export const ADDON_DIR = join(ROOT_DIR, "addon");
export const RP_DIR = join(ROOT_DIR, "bedrock/RP");
export const BP_DIR = join(ROOT_DIR, "bedrock/BP");

export const sizes: PackSizes[] = [16, 32, 64, 128, 256];

export const NAMESPACE = "rainbow";

export const TARGET_VERSION = [1, 21, 0];

export const BLOCK_VERSION = "1.20.80"; //TARGET_VERSION.join(".");
