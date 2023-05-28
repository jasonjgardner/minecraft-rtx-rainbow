import "dotenv/load.ts";
import { decode, type GIF, type Image } from "imagescript/mod.ts";
import { basename, extname, toFileUrl } from "path/mod.ts";
import { walk } from "fs/walk.ts";
import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
import BlockEntry from "./BlockEntry.ts";
import { constructDecoded, pixelPrinter } from "./ImagePrinter.ts";
import { DIR_PIXEL_ART } from "/src/store/_config.ts";
import { image as markdownImage, Markdown } from "deno_markdown/mod.ts";

async function githubAvatars(
  owner: string,
  repo: string,
  palette: BlockEntry[],
): Promise<string> {
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

  const markdown = new Markdown();

  markdown.header("GitHub Stargazers", 3);

  await Promise.allSettled(
    data.map(async (
      res: {
        login: string;
        avatar_url: string;
        [key: string]: string | boolean;
      },
    ) => {
      try {
        const fns = await pixelPrinter(
          `stargazers/${res.login}`,
          new URL(res.avatar_url),
          palette,
          sponsorChunkSize,
        );

        markdown.header(res.login, 5).paragraph(
          markdownImage(res.login, res.avatar_url),
        );
        fns.forEach((fn) =>
          markdown.codeBlock(`/function printer/${fn}`, "mcfunction")
        );
      } catch (err) {
        console.error('Failed printing name: "%s"; Reason: %s', err);
      }

      try {
        const data = new Uint8Array(
          await (await fetch(res.avatar_url)).arrayBuffer(),
        );
        const avatar = (await decode(data, true)) as Image;

        constructDecoded(
          `stargazers/${res.login}`,
          [avatar.resize(64, 64)],
          palette,
        );
      } catch (err) {
        console.error('Failed constructing name: "%s"; Reason: %s', err);
      }
    }),
  );

  return markdown.content;
}

export default async function print(
  palette: BlockEntry[],
  chunks = 6,
): Promise<string> {
  const markdown = new Markdown();

  /**
   * Block palette containing filtered materials. Excludes very bright blocks and lower levels.
   */
  const printablePalette = palette.filter(({ level, material }: BlockEntry) =>
    material.label !== "emissive" || level <= 60
  );

  //const printChunks = Math.max(1, Math.min(16, chunks));

  try {
    markdown.header("Pixel Art", 3);

    // Print images in pixel_art directory
    for await (const entry of walk(DIR_PIXEL_ART)) {
      if (entry.isFile) {
        const name = basename(entry.path, extname(entry.path));

        const remoteUrl = new URL(
          `https://raw.githubusercontent.com/jasonjgardner/minecraft-rtx-rainbow/main/src/assets/pixel_art/${entry.path}`,
        );

        markdown.header(name, 5).paragraph(markdownImage(name, remoteUrl.href));

        try {
          const data = await Deno.readFile(entry.path);
          const decoded = await decode(data);
          const img = extname(entry.path) === ".gif"
            ? (<GIF> decoded)
            : [<Image> decoded];

          constructDecoded(
            `art_${basename(entry.path, extname(entry.path))}`,
            img,
            palette,
          );
        } catch (err) {
          console.error(`Failed constructing ${name}: "%s"`, err);
        }

        const fns = await pixelPrinter(
          name,
          toFileUrl(entry.path),
          printablePalette,
          chunks,
        );

        fns.forEach((fn) =>
          markdown.codeBlock(`/function printer/pixel_art/${fn}`, "mcfunction")
        );
      }
    }
  } catch (err) {
    if (err.kind === Deno.errors.NotFound) {
      throw Error("Pixel art directory not found");
    }

    console.error(err);
  }

  const actionRepo = (Deno.env.get("GITHUB_REPOSITORY") ??
    Deno.env.get("GITHUB_ACTION_REPOSITORY") ?? "").split(
      "/",
      2,
    );

  if (actionRepo.length > 1) {
    try {
      // Print images from GitHub API
      markdown.content += await githubAvatars(
        actionRepo[0],
        actionRepo[1],
        printablePalette,
      );
    } catch (err) {
      console.error("Failed adding Stargazers: %s", err);
    }
  }

  return markdown.content;
}
