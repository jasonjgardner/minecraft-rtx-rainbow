import "dotenv/load.ts";
import type { Alignment, PaletteInput } from "/typings/types.ts";
import type Material from "/src/components/Material.ts";
import { basename, dirname, extname, join, toFileUrl } from "path/mod.ts";
import { walk } from "fs/walk.ts";
import { Octokit } from "@octokit/core";
import {
  DEFAULT_PRINT_CHUNKS,
  MAX_PRINT_CHUNKS,
  MIN_PALETTE_LENGTH,
} from "/typings/constants.ts";
import BlockEntry from "/src/components/BlockEntry.ts";
import { pixelPrinter } from "/src/components/ImagePrinter.ts";
import { DIR_SRC } from "/src/store/_config.ts";
import { fetchImage, handlePaletteInput } from "/src/_utils.ts";

async function githubAvatars(
  owner: string,
  repo: string,
  palette: BlockEntry[],
  materials: Material[],
) {
  const sponsorChunkSize = Math.min(MAX_PRINT_CHUNKS, DEFAULT_PRINT_CHUNKS + 1);
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
          await fetchImage(new URL(res.avatar_url)),
          palette,
          materials,
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
  materials: Material[],
  options: {
    repo: string;
    chunks?: number;
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
    await githubAvatars(actionRepo[0], actionRepo[1], palette, materials);
  } catch (err) {
    throw Error(`Failed adding Stargazers: ${err}`);
  }
}

export async function printPixelArt(
  palette: BlockEntry[],
  materials: Material[],
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
  const srcsDir = join(DIR_SRC, "assets", "pixel_art");

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
        materials,
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

export function printStarGazers(res: BlockEntry[], materials: Material[]) {
  const thisRepo = Deno.env.get("GITHUB_REPOSITORY") ?? "";

  if (!thisRepo || thisRepo.length < 1) {
    throw Error("Can not find GitHub repo stargazer source");
  }

  return printPatrons(getPrintablePalette(res), materials, {
    repo: thisRepo,
    chunks: 3,
  });
}

export function printPixelArtDirectory(
  res: BlockEntry[],
  materials: Material[],
) {
  try {
    const printPalette = getPrintablePalette(res);

    return printPixelArt(printPalette, materials);
  } catch (err) {
    console.error(err);
  }
}

async function printPaletteInput(
  artSrc: PaletteInput,
  res: BlockEntry[],
  materials: Material[],
) {
  if (artSrc === null) {
    throw Error("Invalid palette input source");
  }

  // TODO: Create default palette source. Currently using default pack icon as source
  const paletteImageSource = await handlePaletteInput(
    artSrc,
    await fetchImage(
      toFileUrl(join(DIR_SRC, "assets", "img", "pack_icon.png")),
    ),
  );

  return pixelPrinter(
    "Input",
    paletteImageSource,
    res,
    materials,
    {
      alignment: "none",
    },
  );
}

export default function printer(
  res: BlockEntry[],
  materials: Material[],
  artSrc?: PaletteInput,
) {
  if (res.length < MIN_PALETTE_LENGTH) {
    throw Error("Can not print pixel art. Palette source is too small.");
  }

  const tasks: Promise<void>[] = [];

  if (artSrc) {
    try {
      tasks.push(printPaletteInput(artSrc, res, materials));
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

  if (Deno.env.get("GITHUB_REPOSITORY") !== undefined) {
    try {
      tasks.push(printStarGazers(res, materials));
    } catch (err) {
      console.log("Failed printing stargazers: %s", err);
    }
  }

  return Promise.allSettled(tasks);
}
