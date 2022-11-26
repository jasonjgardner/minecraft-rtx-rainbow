import { emptyDir, ensureDir } from "fs/mod.ts";
import { join } from "path/mod.ts";
import { DIR_BP, DIR_DOCS, DIR_RP, DIR_SRC } from "../store/_config.ts";
import { decode } from "imagescript/mod.ts";

export default async function setup() {
  await emptyDir(DIR_BP);
  await emptyDir(DIR_RP);
  await emptyDir(DIR_DOCS);

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
      DIR_DOCS,
      `${DIR_DOCS}/assets`,
      `${DIR_DOCS}/assets/blocks`,
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
    join(DIR_SRC, "assets", "materials", "brick_normal.png"),
    join(DIR_RP, "/textures/blocks/brick_normal.png"),
  );

  await Deno.copyFile(
    join(DIR_SRC, "assets", "materials", "metal_normal.png"),
    join(DIR_RP, "/textures/blocks/metal_normal.png"),
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
