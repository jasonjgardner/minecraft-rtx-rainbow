import type { PackIDs } from "/typings/types.ts";
import {
  DEFAULT_BUILD_VERSION,
  DEFAULT_LICENSE,
  TARGET_VERSION as min_engine_version,
} from "/typings/constants.ts";
import { addToBehaviorPack, addToResourcePack } from "./_state.ts";
import { semverVector } from "../_utils.ts";

function getMetadata() {
  const metadata: {
    authors?: string[];
    url?: string;
    license: string;
  } = {
    license: DEFAULT_LICENSE,
  };

  const authors: string[] = Array.from(
    new Set([
      Deno.env.get("GITHUB_REPOSITORY_OWNER") ?? "",
      Deno.env.get("GITHUB_ACTOR") ?? "",
    ])
  ).filter((a?: string) => a !== undefined && a.length > 1);

  if (authors.length > 0) {
    metadata.authors = authors;
  }

  try {
    const gitHubRepo = Deno.env.get("GITHUB_REPOSITORY");
    const url = gitHubRepo
      ? new URL(
          `${
            Deno.env.get("GITHUB_SERVER_URL") ?? "https://github.com"
          }/${gitHubRepo}`
        )
      : new URL(location.href);

    metadata.url = url.href;
  } catch (err) {
    if (err instanceof ReferenceError) {
      console.log(
        "Can not add URL to manifest metadata. Location flag is not provided and GitHub repository URL is not set in environment."
      );
    } else {
      console.error(
        "Unknown error occurred while creating metadata URL: %s",
        err
      );
    }
  }

  return metadata;
}

export function createManifests(
  uuids: PackIDs,
  name: string,
  description?: string
) {
  const version = semverVector(DEFAULT_BUILD_VERSION);

  const metadata = getMetadata();

  addToResourcePack(
    "manifest.json",
    JSON.stringify({
      format_version: 2,
      header: {
        name,
        description,
        uuid: uuids[0],
        version,
        min_engine_version,
      },
      modules: [
        {
          description: `${name} generated textures`, // TODO: Allow better module description
          type: "resources",
          uuid: uuids[1],
          version,
        },
      ],
      dependencies: [
        {
          uuid: uuids[2],
          version,
        },
      ],
      capabilities: ["raytraced"], // TODO: Do not include if materials palette is not RTX compatible
      metadata,
    })
  );

  addToBehaviorPack(
    "manifest.json",
    JSON.stringify({
      format_version: 2,
      header: {
        name: `${name} Behavior Pack`,
        description: `${name} data dependency`,
        uuid: uuids[2],
        version,
        min_engine_version,
      },
      modules: [
        {
          description: `${name} generated block data`,
          type: "data",
          uuid: uuids[3],
          version,
        },
      ],
      dependencies: [
        {
          uuid: uuids[0],
          version,
        },
      ],
      metadata,
    })
  );
}
