import "https://deno.land/x/dotenv/load.ts";
import {
  basename,
  dirname,
  extname,
  join,
  toFileUrl,
} from "https://deno.land/std@0.125.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.125.0/fs/walk.ts";
import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
import BlockEntry from "./BlockEntry.ts";
import { pixelPrinter } from "./ImagePrinter.ts";
import { DIR_SRC } from "../store/_config.ts";
import type { Alignment } from "./ImagePrinter.ts";

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
          {
            alignment: "none",
            chunks: sponsorChunkSize,
          },
        );
      } catch (err) {
        console.error('Failed printing name: "%s"; Reason: %s', err);
      }
    }),
  );
}

export function getPrintablePalette(palette: BlockEntry[]) {
  const filtered = palette.filter(({ level, material }: BlockEntry) =>
    level <= material.paletteLevel && level >= material.minimumLevel
  );

  if (filtered.length) {
    return filtered;
  }

  throw Error("No blocks available in palette");
}

export async function printPatrons(palette: BlockEntry[], options: {
  repo: string;
  chunks?: number;
}) {
  const actionRepo = options.repo.split(
    "/",
    2,
  );

  if (actionRepo.length < 2) {
    throw TypeError('Invalid repo format. Expected "owner/repo"');
  }

  try {
    // Print images from GitHub API
    await githubAvatars(actionRepo[0], actionRepo[1], palette);
  } catch (err) {
    throw Error(`Failed adding Stargazers: ${err}`);
  }
}

export async function printPixelArt(palette: BlockEntry[], options?: {
  chunks?: number;
}) {
  const chunks = Math.max(1, Math.min(16, options?.chunks ?? 4));

  // Exclude unpalatable blocks
  const printablePalette = getPrintablePalette(palette);

  // Print images in pixel_art directory
  const srcsDir = join(DIR_SRC, "assets", "pixel_art");

  for await (const entry of walk(srcsDir)) {
    const alignment = <Alignment> basename(dirname(entry.path));

    if (entry.isFile) {
      await pixelPrinter(
        basename(entry.name, extname(entry.name)),
        toFileUrl(entry.path),
        printablePalette,
        { alignment, chunks },
      );
    }
  }
}
