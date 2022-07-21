import type { ReleaseType } from "https://deno.land/std/semver/mod.ts";
import { inc } from "https://deno.land/std/semver/mod.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import {
  BP_MODULE_UUID,
  BP_PACK_UUID,
  DIR_BP,
  DIR_ROOT,
  DIR_RP,
  PACK_DESCRIPTION,
  PACK_NAME,
  RP_MODULE_UUID,
  RP_PACK_UUID,
  TARGET_VERSION,
} from "../store/_config.ts";
import { semverVector } from "../_utils.ts";
import { DIR_SRC } from "../store/_config.ts";

async function getBuildVersion(
  releaseType: ReleaseType = "patch",
  defaultVersion = "1.0.0",
): Promise<{ RP: number[]; BP: number[] }> {
  const { RP, BP } = JSON.parse(
    await Deno.readTextFile(join(DIR_SRC, "versions.json")),
  );

  return {
    RP: semverVector(
      inc(RP || defaultVersion, <ReleaseType> releaseType) ?? defaultVersion,
    ),
    BP: semverVector(
      inc(BP || defaultVersion, <ReleaseType> releaseType) ?? defaultVersion,
    ),
  };
}

export async function createManifests(releaseType?: ReleaseType) {
  const { RP: rpVersion, BP: bpVersion } = await getBuildVersion(releaseType);

  await Deno.writeTextFile(
    join(DIR_RP, "manifest.json"),
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name: PACK_NAME,
          description: PACK_DESCRIPTION,
          uuid: RP_PACK_UUID,
          version: rpVersion,
          min_engine_version: TARGET_VERSION,
        },
        modules: [
          {
            description: `${PACK_NAME} generated textures`,
            type: "resources",
            uuid: RP_MODULE_UUID,
            version: rpVersion,
          },
        ],
        dependencies: [
          {
            uuid: BP_PACK_UUID,
            version: bpVersion,
          },
        ],
        capabilities: ["raytraced"],
      },
      null,
      2,
    ),
  );

  await Deno.writeTextFile(
    join(DIR_BP, "manifest.json"),
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name: `${PACK_NAME} Behavior Pack`,
          description: `${PACK_NAME} data dependency`,
          uuid: BP_PACK_UUID,
          version: bpVersion,
          min_engine_version: TARGET_VERSION,
        },
        modules: [
          {
            description: `${PACK_NAME} generated block data`,
            type: "data",
            uuid: BP_MODULE_UUID,
            version: bpVersion,
          },
        ],
        dependencies: [
          {
            uuid: RP_PACK_UUID,
            version: rpVersion,
          },
        ],
      },
      null,
      2,
    ),
  );
}
