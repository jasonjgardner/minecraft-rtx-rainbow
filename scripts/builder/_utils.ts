import { basename } from "./deps.ts";
import { join } from "./deps.ts";
import type { IBlock } from "./types.ts";

/**
 * @link https://github.com/denorg/recursive-readdir/blob/master/mod.ts
 */
export async function recursiveReaddir(path: string) {
  const files: string[] = [];
  const getFiles = async (path: string) => {
    for await (const dirEntry of Deno.readDir(path)) {
      if (dirEntry.isDirectory) {
        await getFiles(join(path, dirEntry.name));
      } else if (dirEntry.isFile) {
        files.push(join(path, dirEntry.name));
      }
    }
  };
  await getFiles(path);
  return files;
}

export async function getColorDbs() {
  const colorDbs = await recursiveReaddir(
    join(Deno.cwd(), "db", "colors"),
  );

  const src: Record<string, IBlock[]> = {};

  for (const colorDb of colorDbs) {
    const db = await Deno.readTextFile(colorDb);
    const blocks = JSON.parse(db) as { colors: IBlock[] };

    src[basename(colorDb, ".json")] = blocks.colors;
  }

  return src;
}
