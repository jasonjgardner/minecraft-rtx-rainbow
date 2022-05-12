import "https://deno.land/x/dotenv/load.ts";
import {
  basename,
  extname,
  join,
  toFileUrl,
} from "https://deno.land/std@0.125.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.125.0/fs/walk.ts";
import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
import BlockEntry from "./BlockEntry.ts";
import { pixelPrinter } from "./ImagePrinter.ts";
import { DIR_SRC } from "../store/_config.ts";

async function githubAvatars(
  owner: string,
  repo: string,
  palette: BlockEntry[],
) {
  const sponsorChunkSize = 4;
  const octokit = new Octokit();

  const { status, data } = await octokit.request(
    "GET /repos/{owner}/{repo}/stargazers",
    {
      owner,
      repo,
      per_page: 50,
    },
  );

  if (status !== 200) {
    throw Error("Failed fetching GitHub data");
  }

  await Promise.allSettled(
    data.map(async (
      res: {
        login: string;
        avatar_url: string;
        [key: string]: string | boolean;
      },
    ) => {
      try {
        await pixelPrinter(
          `stargazers/${res.login}`,
          new URL(res.avatar_url),
          palette,
          sponsorChunkSize,
        );
      } catch (err) {
        console.error('Failed printing name: "%s"; Reason: %s', err);
      }
    }),
  );
}

export default async function print(palette: BlockEntry[], chunks = 6) {
  // Exclude super-bright blocks from palette
  const printablePalette = palette.filter(({ level, material }: BlockEntry) =>
    material.label !== "emissive" || level <= 90
  );

  // Print images in pixel_art directory
  const srcDir = join(DIR_SRC, "assets", "pixel_art");
  for await (const entry of walk(srcDir)) {
    if (entry.isFile) {
      await pixelPrinter(
        basename(entry.name, extname(entry.name)),
        toFileUrl(entry.path),
        printablePalette,
        Math.max(1, Math.min(16, chunks)),
      );
    }
  }

  const actionRepo = (Deno.env.get("GITHUB_REPOSITORY") || "").split(
    "/",
    2,
  );

  if (actionRepo.length > 1) {
    try {
      // Print images from GitHub API
      await githubAvatars(actionRepo[0], actionRepo[1], printablePalette);
    } catch (err) {
      console.error("Failed adding Stargazers: %s", err);
    }
  }
}
