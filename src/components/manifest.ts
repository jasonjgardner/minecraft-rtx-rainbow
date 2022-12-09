import { inc, type ReleaseType } from "semver/mod.ts";
import { join } from "path/mod.ts";
import type { PackModule } from "../../typings/types.ts";
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

export async function createManifests(
  scripts?: Array<PackModule>,
  releaseType?: ReleaseType,
) {
  const { RP: rpVersion, BP: bpVersion } = await getBuildVersion(releaseType);

  const metadata = {
    authors: [
      "Jason J. Gardner",
    ],
    // generated_with: {
    //   rainbow_magic: rpVersion.map((v) => v.toString()),
    // },
  } as const;

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
        metadata,
      },
      null,
      2,
    ),
  );

  const dependencies: Array<PackModule> = [
    {
      uuid: RP_PACK_UUID,
      version: rpVersion,
    },
  ];

  const modules: Array<PackModule> = [
    {
      description: `${PACK_NAME} generated block data`,
      type: "data",
      uuid: BP_MODULE_UUID,
      version: bpVersion,
    },
  ];

  if (scripts && scripts.length) {
    dependencies.push({
      module_name: "@minecraft/server",
      version: "1.0.0-beta",
    }, {
      module_name: "@minecraft/server-gametest",
      version: "1.0.0-beta",
    }, {
      module_name: "@minecraft/server-ui",
      version: "1.0.0-beta",
    });
    for (const script of scripts) {
      modules.push({
        ...script,
        ...{
          type: script.type ?? "script",
          language: script.language ?? "javascript",
          uuid: script.uuid ?? crypto.randomUUID(),
          version: (script.version ?? "1.0.0").toString().split(".").map((v) =>
            parseInt(v, 10)
          ).slice(0, 3),
        },
      });
    }
  }

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
        modules,
        dependencies,
        metadata,
      },
      null,
      2,
    ),
  );

  return { RP: rpVersion.join("."), BP: bpVersion.join(".") };
}
