import "dotenv/load.ts";
import type { Alignment, PaletteInput } from "/typings/types.ts";
import { basename, dirname, extname, join, toFileUrl } from "path/mod.ts";
import { walk } from "fs/walk.ts";
import { Octokit } from "@octokit/core";
import {
  ART_SOURCE_ID,
  CHUNK_SIZE,
  DEFAULT_PRINT_CHUNKS,
  MAX_PRINT_CHUNKS,
  MIN_PALETTE_LENGTH,
} from "/typings/constants.ts";
import BlockEntry from "/src/components/BlockEntry.ts";
import { pixelPrinter } from "/src/components/ImagePrinter.ts";
import { fetchImage, handlePaletteInput } from "/src/_utils.ts";

async function githubAvatars(
  owner: string,
  repo: string,
  palette: BlockEntry[],
) {
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

  return Promise.allSettled(
    data.map(async (
      res: {
        login: string;
        avatar_url: string;
        [key: string]: string | boolean;
      },
    ) =>
      pixelPrinter(
        `stargazers/${res.login}`,
        await fetchImage(new URL(res.avatar_url)),
        palette,
        {
          alignment: "none",
          chunks: MAX_PRINT_CHUNKS,
        },
      )
    ),
  );
}

export function getPrintablePalette(palette: BlockEntry[]) {
  const filtered = palette.filter(({ printable }: BlockEntry) =>
    printable === true
  );

  if (filtered.length) {
    return filtered;
  }

  throw Error("No blocks available in palette");
}

export async function printPatrons(
  palette: BlockEntry[],
  options: {
    repo: string;
  },
) {
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

export async function printPixelArt(
  palette: BlockEntry[],
  options?: {
    chunks?: number;
  },
) {
  const chunks = Math.max(
    1,
    Math.min(MAX_PRINT_CHUNKS, options?.chunks ?? DEFAULT_PRINT_CHUNKS),
  );

  // Exclude unpalatable blocks
  const printablePalette = getPrintablePalette(palette);

  // Print images in pixel_art directory
  const srcsDir = join(Deno.cwd(), "src", "assets", "pixel_art");

  for await (const entry of walk(srcsDir)) {
    const alignment = <Alignment> basename(dirname(entry.path));

    if (!entry.isFile) {
      continue;
    }

    const fileExt = extname(entry.name);
    const fileUrl = toFileUrl(entry.path);
    const structureName = basename(entry.name, fileExt);

    // if (fileExt === 'psd') {

    // }

    try {
      await pixelPrinter(
        structureName,
        await fetchImage(fileUrl),
        printablePalette,
        { alignment, chunks },
      );
    } catch (err) {
      console.error(
        'Failed creating pixel art for file %s: "%s"',
        entry.name,
        err,
      );
    }
  }
}

export function printStarGazers(res: BlockEntry[]) {
  const thisRepo = Deno.env.get("GITHUB_REPOSITORY") ?? "";

  if (!thisRepo || thisRepo.length < 1) {
    throw Error("Can not find GitHub repo stargazer source");
  }

  return printPatrons(getPrintablePalette(res), {
    repo: thisRepo,
  });
}

export function printPixelArtDirectory(
  res: BlockEntry[],
) {
  try {
    const printPalette = getPrintablePalette(res);

    return printPixelArt(printPalette);
  } catch (err) {
    console.error(err);
  }
}

export default async function printer(
  res: BlockEntry[],
  artSrc?: PaletteInput,
) {
  if (res.length < MIN_PALETTE_LENGTH) {
    throw Error("Can not print pixel art. Palette source is too small.");
  }

  const tasks: Promise<void>[] = [];

  if (artSrc) {
    try {
      const img = await handlePaletteInput(
        artSrc,
      );

      const chunks = Math.min(
        MAX_PRINT_CHUNKS,
        Math.max(1, Math.max(img.width, img.height) / CHUNK_SIZE),
      );

      tasks.push(pixelPrinter(
        ART_SOURCE_ID,
        img,
        res,
        {
          alignment: "none",
          chunks,
        },
      ));
    } catch (err) {
      console.log("Failed printing pixel art from input: %s", err);
    }
  }

  // try {
  //   // TODO: Check to see if directory exists or is needed before calling function
  //   const pxArtDir = printPixelArtDirectory(res, materials);

  //   if (pxArtDir !== undefined) {
  //     tasks.push(pxArtDir);
  //   }
  // } catch (err) {
  //   console.log("Failed printing from pixel art directory: %s", err);
  // }

  // if (Deno.env.get("GITHUB_REPOSITORY") !== undefined) {
  //   try {
  //     tasks.push(printStarGazers(res));
  //   } catch (err) {
  //     console.log("Failed printing stargazers: %s", err);
  //   }
  // }

  return Promise.allSettled(tasks);
}
