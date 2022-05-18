import { join } from "path/mod.ts";

/**
 * Project root directory
 */
export const DIR_ROOT = Deno.cwd();

/**
 * Project scripts and assets
 */
export const DIR_SRC = join(DIR_ROOT, "src");
