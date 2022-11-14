import { emptyDir, ensureDir } from "https://deno.land/std@0.123.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { DIR_BP, DIR_RP, DIR_SRC } from "../store/_config.ts";
import { decode } from "imagescript/mod.ts";

export default async function setup() {
  await emptyDir(DIR_BP);
  await emptyDir(DIR_RP);

  await Promise.all(
    [
      `${DIR_BP}/blocks`,
      `${DIR_BP}/items`,
      `${DIR_BP}/functions`,
      `${DIR_BP}/functions/tags`,
      `${DIR_BP}/functions/trails`,
      `${DIR_BP}/functions/printer`,
      `${DIR_BP}/functions/printer/stargazers`,
      `${DIR_BP}/entities`,
      `${DIR_BP}/animations`,
      `${DIR_RP}/textures/blocks`,
      `${DIR_RP}/models/blocks`,
      `${DIR_RP}/texts`,
    ].map(
      (dir) => ensureDir(dir),
    ),
  );

  const normalMap = await decode(
    await Deno.readFile(
      join(DIR_SRC, "assets", "materials", "block_normal.png"),
    ),
  );
  normalMap.resize(16, 16);
  await Deno.writeFile(
    join(DIR_RP, "textures", "blocks", "block_normal.png"),
    await normalMap.encode(),
  );

  await Deno.copyFile(
    join(DIR_SRC, "assets", "models", "pane.geo.json"),
    join(DIR_RP, "/models/blocks/pane.geo.json"),
  );

  // TODO: Generate pack icon with each build
  await Deno.copyFile(
    join(DIR_SRC, "assets", "img", "pack_icon.png"),
    join(DIR_RP, "/pack_icon.png"),
  );
  await Deno.copyFile(
    join(DIR_SRC, "assets", "img", "pack_icon.png"),
    join(DIR_BP, "/pack_icon.png"),
  );
}
