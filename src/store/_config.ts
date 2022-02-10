import "https://deno.land/x/dotenv/load.ts";
import * as log from "https://deno.land/std@0.125.0/log/mod.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { getConfig, semverVector } from "../_utils.ts";
import type { ReleaseType } from "https://deno.land/x/semver/mod.ts";

/**
 * Project root directory
 */
export const DIR_ROOT = Deno.cwd();

/**
 * Project scripts and assets
 */
export const DIR_SRC = join(DIR_ROOT, "/src");

/**
 * Build output directory
 */
export const DIR_DIST = join(DIR_ROOT, "/build");

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),

    file: new log.handlers.FileHandler("WARNING", {
      filename: join(DIR_ROOT, "/warnings.log"),
      // you can change format of output message using any keys in `LogRecord`.
      formatter: "{levelName} {msg}",
    }),
  },

  loggers: {
    // configure default logger available via short-hand methods above.
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
export const BEHAVIOR_BLOCK_FORMAT_VERSION = "1.16.100";

export const MIP_LEVELS = 0;

export const PACK_NAME = getConfig("PACK_NAME", "RAINBOW!!");
export const PACK_DESCRIPTION = getConfig(
  "PACK_DESCRIPTION",
  "RTX-enabled solid color blocks",
);

export const DIR_RP = join(DIR_DIST, `/${NAMESPACE} RP`);
export const DIR_BP = join(DIR_DIST, `/${NAMESPACE} BP`);

export const TARGET_VERSION = semverVector(
  Deno.env.get("TARGET_VERSION") || "1.18.2",
);

export const RELEASE_TYPE = <ReleaseType> getConfig("RELEASE_TYPE", "patch");
