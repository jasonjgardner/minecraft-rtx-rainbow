import type { ReleaseType } from "https://deno.land/x/semver@v1.4.0/mod.ts";
import { inc } from "semver/mod.ts";
import { join } from "path/mod.ts";
import {
  BP_MODULE_UUID,
  BP_PACK_UUID,
  DIR_SRC,
  PACK_DESCRIPTION,
  PACK_NAME,
  RP_MODULE_UUID,
  RP_PACK_UUID,
  TARGET_VERSION,
} from "/src/store/_config.ts";
import { semverVector } from "/src/_utils.ts";
import {
  addToBehaviorPack,
  addToResourcePack,
} from "/src/components/_state.ts";

function getMetadata(
  buildHistory: string[],
) {
  const tools: { [k: string]: string[] } = {};

  const workflow = Deno.env.get("GITHUB_WORKFLOW");

  if (workflow && workflow.length > 0) {
    tools[workflow] = buildHistory;

    const workflowRef = Deno.env.get("GITHUB_REF_NAME");

    if (workflowRef && Deno.env.get("GITHUB_REF_TYPE") === "tag") {
      tools[workflow].push(workflowRef.toString());
    }
  }

  return {
    metadata: {
      authors: [
        ...new Set([
          Deno.env.get("GITHUB_REPOSITORY_OWNER"),
          Deno.env.get("GITHUB_ACTOR"),
        ]),
      ],
      license: Deno.env.get("LICENSE"), //?? await lookupLicense()
      url: `${Deno.env.get("GITHUB_SERVER_URL")}/${
        Deno.env.get("GITHUB_REPOSITORY")
      }`,
      generated_with: {
        ...tools,
      },
    },
  };
}

async function getBuildVersion(
  releaseType: ReleaseType = "patch",
  defaultVersion = "1.0.0",
): Promise<{ RP: number[]; BP: number[]; version_history: string[] }> {
  const { RP, BP, version_history } = JSON.parse(
    await Deno.readTextFile(join(DIR_SRC, "versions.json")),
  );

  const rpVersion = semverVector(
    inc(RP || defaultVersion, <ReleaseType> releaseType) ?? defaultVersion,
  );

  const bpVersion = semverVector(
    inc(BP || defaultVersion, <ReleaseType> releaseType) ?? defaultVersion,
  );

  return {
    version_history,
    RP: rpVersion,
    BP: bpVersion,
  };
}

export async function createManifests(releaseType?: ReleaseType) {
  const { RP: rpVersion, BP: bpVersion, version_history } =
    await getBuildVersion(releaseType);

  const metadata = getMetadata(version_history,);

  addToResourcePack(
    "manifest.json",
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
    ),
  );

  addToBehaviorPack(
    "manifest.json",
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
          // {
          //   uuid: RP_MODULE_UUID,
          //   version: rpVersion,
          // },
        ],
        metadata,
      },
    ),
  );
}
