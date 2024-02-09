import type { PackSize } from "./types.ts";
import { join } from "./deps.ts";
export const ROOT_DIR = Deno.cwd();
export const TEXTURES_DIR = join(ROOT_DIR, "blocks");

export const RP_DIR = join(ROOT_DIR, "pack/RP");
export const BP_DIR = join(ROOT_DIR, "pack/BP");

export const sizes: PackSize[] = [16, 32, 64, 128, 256];

export const NAMESPACE = "rainbow";

export const TARGET_VERSION = [1, 20, 20];

export const BLOCK_VERSION = TARGET_VERSION.join(".");
