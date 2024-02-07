import "dotenv/load.ts";
import { basename, extname, join } from "path/mod.ts";
import { decode, type GIF, Image } from "imagescript/mod.ts";
import { ensureDir, walk } from "fs/mod.ts";
import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
import BlockEntry from "./BlockEntry.ts";
import { constructDecoded } from "./ImagePrinter.ts";
import { DIR_BP, DIR_PIXEL_ART } from "/src/store/_config.ts";
const DIR_STRUCTURES = join(DIR_BP, "structures");
async function githubAvatars(
  owner: string,
  repo: string,
  palette: BlockEntry[],
): Promise<void> {
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

  // const markdown = new Markdown();

  // markdown.header("GitHub Stargazers", 3);

  const materials = [
    ...new Set(
      palette.map(({ material }: BlockEntry) =>
        material.label ?? material.name.en_US
      ),
    ),
  ];

  await Promise.allSettled(
    data.map(async (
      res: {
        login: string;
        avatar_url: string;
        [key: string]: string | boolean;
      },
    ) => {
      try {
        const data = new Uint8Array(
          await (await fetch(res.avatar_url)).arrayBuffer(),
        );
        const avatar = ((await decode(data, true)) as Image).resize(64, 64)
          .rotate(90);

        await ensureDir(
          join(
            DIR_STRUCTURES,
            "stargazers",
            res.login,
          ),
        );
        await Promise.all(materials.map(async (material) => {
          console.log("Constructing %s avatar for %s", material, res.login);

          await constructDecoded(
            `stargazers/${res.login}/${res.login}_${material}`,
            [avatar],
            palette.filter(({ material: { label } }: BlockEntry) =>
              label === material
            ),
          );
        }));

        await constructDecoded(
          `stargazers/${res.login}/${res.login}_vanilla`,
          [avatar],
          [],
        );
      } catch (err) {
        console.error('Failed constructing name: "%s"; Reason: %s', err);
      }
    }),
  );
}

export default async function print(
  palette: BlockEntry[],
): Promise<void> {
  /**
   * Block palette containing filtered materials. Excludes very bright blocks and lower levels.
   */
  const printablePalette = palette.filter(({ level, material }: BlockEntry) =>
    material.label !== "emissive" || level <= 60
  );

  try {
    const materials = [
      ...new Set(
        palette.map(({ material }: BlockEntry) =>
          material.label ?? material.name.en_US
        ),
      ),
    ];

    // Print images in pixel_art directory
    for await (const entry of walk(DIR_PIXEL_ART)) {
      if (entry.isFile) {
        const name = basename(entry.path, extname(entry.path));

        await ensureDir(
          join(
            DIR_STRUCTURES,
            "art",
            name,
          ),
        );

        const data = await Deno.readFile(entry.path);
        const decoded = await decode(data);
        const img = extname(entry.path) === ".gif"
          ? (<GIF> decoded)
          : [<Image> decoded];

        const imgResized = img.map((img) =>
          img.resize(Image.RESIZE_AUTO, Math.min(16 * 8, img.height))
        );

        await Promise.all(materials.map(async (material) => {
          try {
            console.log("Constructing artwork %s from %s", name, material);

            await constructDecoded(
              `art/${name}/${name}_${material}`,
              imgResized,
              palette.filter(({ material: { label } }: BlockEntry) =>
                label === material
              ),
            );
          } catch (err) {
            console.error(`Failed constructing ${name}: "%s"`, err);
          }
        }));

        await constructDecoded(
          `art/${name}/${name}_vanilla`,
          img,
          [],
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
      await githubAvatars(
        actionRepo[0],
        actionRepo[1],
        printablePalette,
      );
    } catch (err) {
      console.error("Failed adding Stargazers: %s", err);
    }
  }
}
