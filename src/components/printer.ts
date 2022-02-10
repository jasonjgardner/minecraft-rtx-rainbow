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

async function githubAvatars(palette: BlockEntry[]) {
  const sponsorChunkSize = 4;
  const octokit = new Octokit();

  const { status, data } = await octokit.request(
    "GET /repos/{owner}/{repo}/stargazers",
    {
      owner: Deno.env.get("GITHUB_USER"),
      repo: Deno.env.get("GITHUB_REPO"),
      per_page: 50,
    },
  );

  if (status !== 200) {
    throw Error("Failed fetching GitHub data");
  }

  await Promise.all(
    data.map(async (
      res: {
        login: string;
        avatar_url: string;
        [key: string]: string | boolean;
      },
    ) =>
      await pixelPrinter(
        `stargazers/${res.login}`,
        new URL(res.avatar_url),
        palette,
        sponsorChunkSize,
      )
    ),
  );
}

export default async function print(palette: BlockEntry[], chunks = 6) {
  // Print images in pixel_art directory
  const srcDir = join(DIR_SRC, "assets", "pixel_art");
  for await (const entry of walk(srcDir)) {
    if (entry.isFile) {
      await pixelPrinter(
        basename(entry.name, extname(entry.name)),
        toFileUrl(entry.path),
        palette,
        chunks,
      );
    }
  }

  // Print images from GitHub API
  await githubAvatars(palette);
}
