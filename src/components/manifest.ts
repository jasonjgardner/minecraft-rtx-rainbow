import { inc, type ReleaseType } from "semver/mod.ts";
import { join } from "path/mod.ts";
import type { PackModule } from "../../types/index.ts";
import {
  BP_MODULE_UUID,
  BP_PACK_UUID,
  DIR_BP,
  DIR_RP,
  MODULE_SERVER_GAMETEST_VERSION,
  MODULE_SERVER_UI_VERSION,
  MODULE_SERVER_VERSION,
  PACK_DESCRIPTION,
  PACK_NAME,
  RP_MODULE_UUID,
  RP_PACK_UUID,
  TARGET_VERSION,
} from "../store/_config.ts";
import { semverVector } from "../_utils.ts";
import { DIR_SRC } from "../store/_config.ts";

async function getBuildVersion(
  defaultVersion = "1.0.0",
): Promise<{ RP: number[]; BP: number[] }> {
  const { RP, BP } = JSON.parse(
    await Deno.readTextFile(join(DIR_SRC, "versions.json")),
  );

  return {
    RP: semverVector(
      RP || defaultVersion,
    ),
    BP: semverVector(
      BP || defaultVersion,
    ),
  };
}

export async function createManifests(
  scripts?: Array<PackModule>,
) {
  const { RP: rpVersion, BP: bpVersion } = await getBuildVersion();

  const metadata = {
    authors: [
      "Jason J. Gardner",
    ],
    generated_with: {
      rainbow_magic: [rpVersion.join(".")],
    },
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
      version: MODULE_SERVER_VERSION,
    }, {
      module_name: "@minecraft/server-gametest",
      version: MODULE_SERVER_GAMETEST_VERSION,
    }, {
      module_name: "@minecraft/server-ui",
      version: MODULE_SERVER_UI_VERSION,
    });
    for (const script of scripts) {
      const v = script.version?.toString().split(".").slice(0, 3).map((v) =>
        parseInt(v, 10)
      );

      modules.push({
        ...script,
        ...{
          type: script.type ?? "script",
          language: script.language ?? "javascript",
          uuid: script.uuid ?? crypto.randomUUID(),
          version: [v?.[0] ?? 1, v?.[1] ?? 0, v?.[2] ?? 0],
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
        capabilities: [
          "editorExtension",
        ],
      },
      null,
      2,
    ),
  );

  return { RP: rpVersion.join("."), BP: bpVersion.join(".") };
}
