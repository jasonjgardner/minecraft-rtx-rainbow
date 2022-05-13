import "dotenv/load.ts";
import * as log from "https://deno.land/std@0.125.0/log/mod.ts";
import { join } from "path/mod.ts";
import { ensureDir } from "fs/mod.ts";
import { getConfig, semverVector } from "/src/_utils.ts";
import type { ReleaseType } from "semver/mod.ts";

/**
 * Project root directory
 */
export const DIR_ROOT = Deno.cwd();

/**
 * Project scripts and assets
 */
export const DIR_SRC = join(DIR_ROOT, "src");

/**
 * Build output directory
 */
export const DIR_DIST = join(DIR_ROOT, "build");

export const DIR_AMULET = join(DIR_ROOT, "dist", "amulet");

export const BEHAVIOR_BLOCK_FORMAT_VERSION = "1.16.100";

export const TARGET_VERSION = semverVector(
  Deno.env.get("TARGET_VERSION") || "1.18.3",
);

const DIR_LOGS = join(DIR_DIST, "logs");

await ensureDir(DIR_LOGS);

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),

    file: new log.handlers.FileHandler("WARNING", {
      filename: join(DIR_LOGS, "/warnings.log"),
      formatter: "{levelName} {msg}",
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },

    tasks: {
      level: "ERROR",
      handlers: ["console"],
    },
  },
});

function getUuid(rp = true, pack = true): string {
  const key = `${rp ? "RP" : "BP"}_${pack ? "PACK" : "MODULE"}_UUID`;
  const envVar = Deno.env.get(key);

  if (envVar && envVar.length > 1) {
    return envVar;
  }

  const fallbackUuid = crypto.randomUUID();
  const logger = log.getLogger();

  logger.warning(
    `Using generated UUID for ${rp ? "resource" : "behavior"} ${
      pack ? "pack" : "module"
    }: ${fallbackUuid}`,
  );

  return fallbackUuid;
}

export const RP_PACK_UUID = getUuid();
export const BP_PACK_UUID = getUuid(false);

export const RP_MODULE_UUID = getUuid(true, false);
export const BP_MODULE_UUID = getUuid(false, false);

export const NAMESPACE = `${getConfig("NAMESPACE", "rainbow")}`;

export const PACK_NAME = getConfig("PACK_NAME", "RAINBOW!!");
export const PACK_DESCRIPTION = getConfig(
  "PACK_DESCRIPTION",
  "RTX-enabled solid color blocks",
);

export const DIR_RP = join(DIR_DIST, `/${NAMESPACE} RP`);
export const DIR_BP = join(DIR_DIST, `/${NAMESPACE} BP`);

export const RELEASE_TYPE = <ReleaseType> getConfig("RELEASE_TYPE", "patch");

// Magic numbers
export const MIP_LEVELS: number = parseInt(`${getConfig("MIP_LEVELS", 0) ?? 0}`, 10);

/**
 * Emissive level at which ambient occlusion is disabled on a block's face
 */
export const AO_EMISSIVE_THRESHOLD = 50;

/**
 * Default sound ID applied in blocks.json
 */
export const DEFAULT_BLOCK_SOUND = "dirt";
