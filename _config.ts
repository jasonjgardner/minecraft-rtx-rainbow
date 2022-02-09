import "https://deno.land/x/dotenv/load.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
export const NAMESPACE = "rainbow";
export const BEHAVIOR_BLOCK_FORMAT_VERSION = "1.16.100";

export const MIP_LEVELS = 0;

export const PACK_NAME = "RAINBOW!!";
export const PACK_DESCRIPTION = "RTX-enabled solid color blocks";

export const DIR_ROOT = Deno.cwd();

export const DIR_SRC = join(DIR_ROOT, '/src');
export const DIR_DIST = join(DIR_ROOT, '/dist');

export const DIR_RP = join(DIR_DIST, `/${NAMESPACE} RP`);
export const DIR_BP = join(DIR_DIST, `/${NAMESPACE} BP`);

export const RP_PACK_UUID = Deno.env.get("RP_PACK_UUID") || crypto.randomUUID();
export const BP_PACK_UUID = Deno.env.get("BP_PACK_UUID") || crypto.randomUUID();

export const RP_MODULE_UUID = Deno.env.get("RP_MODULE_UUID") ||
  crypto.randomUUID();
export const BP_MODULE_UUID = Deno.env.get("BP_MODULE_UUID") ||
  crypto.randomUUID();

  export const TARGET_VERSION = (Deno.env.get("TARGET_VERSION") || "1.18.2").split('.', 3).map((v: string) => parseInt(v, 10))