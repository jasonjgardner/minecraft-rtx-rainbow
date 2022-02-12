import { emptyDir, ensureDir } from "https://deno.land/std@0.123.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { DIR_BP, DIR_RP, DIR_SRC } from "../store/_config.ts";

const blockTextures = join(DIR_RP, "textures", "blocks");
const itemTextures = join(DIR_RP, "textures", "items");

export default async function setup() {
  await emptyDir(DIR_BP);
  await emptyDir(DIR_RP);

  await Promise.all(
    [
      join(DIR_BP, "blocks"),
      join(DIR_BP, "items"),
      join(DIR_BP, "functions"),
      join(DIR_BP, "entities"),
      join(DIR_BP, "animations"),
      join(DIR_RP, "texts"),
      blockTextures,
      itemTextures,
      join(DIR_BP, "functions", "printer", "stargazers"),
      join(DIR_BP, "functions", "printer", "pixel_art", "frames"),
    ].map(
      (dir) => ensureDir(dir),
    ),
  );

  await Deno.copyFile(
    join(DIR_SRC, "assets", "materials", "block_normal.png"),
    join(blockTextures, "block_normal.png"),
  );

  await Deno.copyFile(
    join(DIR_SRC, "assets", "img", "rainbow_trail_key.png"),
    join(itemTextures, "rainbow_trail_key.png"),
  );

  // TODO: Generate pack icon with each build
  await Deno.copyFile(
    join(DIR_SRC, "assets", "img", "pack_icon.png"),
    join(DIR_RP, "pack_icon.png"),
  );
  await Deno.copyFile(
    join(DIR_SRC, "assets", "img", "pack_icon.png"),
    join(DIR_BP, "pack_icon.png"),
  );
}
