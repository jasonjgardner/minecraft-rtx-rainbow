import { emptyDir, ensureDir } from "https://deno.land/std@0.123.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { DIR_BP, DIR_RP, DIR_SRC } from "./_config.ts";

export default async function setup() {
  await Promise.all([
    DIR_BP,
    DIR_RP,
  ].map((dir) => emptyDir(dir)));

  await Promise.all(
    [
      `${DIR_BP}/blocks`,
      `${DIR_BP}/items`,
      `${DIR_BP}/functions`,
      `${DIR_BP}/functions/printer`,
      `${DIR_BP}/entities`,
      `${DIR_BP}/animations`,
      `${DIR_RP}/textures/blocks`,
      `${DIR_RP}/textures/items`,
      `${DIR_RP}/texts`,
    ].map(
      (dir) => ensureDir(dir),
    ),
  );

  await Promise.all([
    Deno.copyFile(
      join(DIR_SRC, "block_normal.png"),
      join(DIR_RP, "/textures/blocks/block_normal.png"),
    ),
    Deno.copyFile(
      join(DIR_SRC, "rainbow_trail_key.png"),
      join(DIR_RP, "/textures/items/rainbow_trail_key.png"),
    ),
    Deno.copyFile(
      join(DIR_SRC, "pack_icon.png"),
      join(DIR_RP, "/pack_icon.png"),
    ),
    Deno.copyFile(
      join(DIR_SRC, "pack_icon.png"),
      join(DIR_BP, "/pack_icon.png"),
    ),
  ]);
}
