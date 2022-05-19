import type { ReleaseType } from "semver/mod.ts";
import { inc } from "semver/mod.ts";
import {
  DEFAULT_BUILD_VERSION,
  DEFAULT_LICENSE,
  DEFAULT_RELEASE_TYPE,
  TARGET_VERSION as min_engine_version,
} from "/typings/constants.ts";
import { semverVector } from "../_utils.ts";
import { addToBehaviorPack, addToResourcePack } from "./_state.ts";

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

  const gitHubRepo = Deno.env.get("GITHUB_REPOSITORY");
  const url = gitHubRepo
    ? new URL(
      `${
        Deno.env.get("GITHUB_SERVER_URL") ?? "https://github.com"
      }/${gitHubRepo}`,
    )
    : undefined;

  const authors: string[] = Array.from(
    new Set([
      Deno.env.get("GITHUB_REPOSITORY_OWNER") ?? "",
      Deno.env.get("GITHUB_ACTOR") ?? "",
    ]),
  ).filter((a?: string) => a !== undefined && a.length > 1);

  const metadata: {
    authors?: string[];
    url?: string;
    license: string;
    generated_with: { [k: string]: string[] };
  } = {
    license: DEFAULT_LICENSE,
    generated_with: {
      ...tools,
    },
  };

  if (authors !== undefined && authors.length > 0) {
    metadata.authors = authors;
  }

  if (url) {
    metadata.url = url.href;
  }

  return metadata;
}

function getBuildVersion(
  currentRelease?: string,
  releaseType?: ReleaseType,
): { RP: number[]; BP: number[]; version_history: string[] } {
  const version = semverVector(
    inc(
      currentRelease || DEFAULT_BUILD_VERSION,
      releaseType ?? DEFAULT_RELEASE_TYPE,
    ) ??
      DEFAULT_BUILD_VERSION,
  );
  return {
    version_history: currentRelease ? [currentRelease] : [],
    RP: version,
    BP: version,
  };
}

export function createManifests(
  uuids: [string, string, string, string],
  name: string,
  description?: string,
  releaseType?: ReleaseType,
) {
  const { RP: rpVersion, BP: bpVersion, version_history } = getBuildVersion(
    releaseType,
  );

  const metadata = getMetadata(version_history);

  addToResourcePack(
    "manifest.json",
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name,
          description,
          uuid: uuids[0],
          version: rpVersion,
          min_engine_version,
        },
        modules: [
          {
            description: `${name} generated textures`, // TODO: Allow better module description
            type: "resources",
            uuid: uuids[1],
            version: rpVersion,
          },
        ],
        dependencies: [
          {
            uuid: uuids[2],
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
          name: `${name} Behavior Pack`,
          description: `${name} data dependency`,
          uuid: uuids[2],
          version: bpVersion,
          min_engine_version,
        },
        modules: [
          {
            description: `${name} generated block data`,
            type: "data",
            uuid: uuids[3],
            version: bpVersion,
          },
        ],
        dependencies: [
          {
            uuid: uuids[0],
            version: rpVersion,
          },
        ],
        metadata,
      },
    ),
  );
}
