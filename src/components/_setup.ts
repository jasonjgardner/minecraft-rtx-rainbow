import { emptyDir, ensureDir, expandGlob } from "fs/mod.ts";
import { basename, join } from "path/mod.ts";
import {
  DIR_BP,
  DIR_DOCS,
  DIR_RP,
  DIR_SERVER,
  DIR_SRC,
} from "../store/_config.ts";
import { decode, type Image } from "imagescript/mod.ts";

export default async function setup() {
  await emptyDir(DIR_BP);
  await emptyDir(DIR_RP);
  await emptyDir(DIR_DOCS);

  await Promise.all(
    [
      DIR_SERVER,
      `${DIR_BP}/biomes`,
      `${DIR_BP}/blocks`,
      `${DIR_BP}/items`,
      `${DIR_BP}/scripts`,
      `${DIR_BP}/scripts/client`,
      // `${DIR_BP}/scripts/gametests`,
      `${DIR_BP}/scripts/server`,
      `${DIR_BP}/structures`,
      `${DIR_BP}/structures/art`,
      `${DIR_BP}/structures/stargazers`,
      // `${DIR_BP}/functions`,
      // `${DIR_BP}/functions/tags`,
      // `${DIR_BP}/functions/trails`,
      // `${DIR_BP}/functions/printer`,
      // `${DIR_BP}/functions/printer/stargazers`,
      `${DIR_BP}/entities`,
      `${DIR_BP}/biomes`,
      `${DIR_BP}/animations`,
      `${DIR_RP}/textures/blocks`,
      `${DIR_RP}/models/blocks`,
      `${DIR_RP}/texts`,
      `${DIR_RP}/lighting`,
      `${DIR_RP}/sounds`,
      `${DIR_RP}/sounds/blocks`,
      // DIR_DOCS,
      // `${DIR_DOCS}/assets`,
      // `${DIR_DOCS}/assets/blocks`,
      // `${DIR_DOCS}/materials`,
      // `${DIR_DOCS}/functions`,
      // `${DIR_DOCS}/flipbooks`,
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

  await Promise.all([
    Deno.writeFile(
      join(DIR_RP, "textures", "blocks", "block_normal.png"),
      await normalMap.encode(),
    ),
    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "big_brick_normal.png"),
      join(DIR_RP, "/textures/blocks/big_brick_normal.png"),
    ),
    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "big_brick_mer.png"),
      join(DIR_RP, "/textures/blocks/big_brick_mer.png"),
    ),

    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "negative_mer.png"),
      join(DIR_RP, "/textures/blocks/negative_mer.png"),
    ),

    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "negative_normal.png"),
      join(DIR_RP, "/textures/blocks/negative_normal.png"),
    ),

    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "positive_mer.png"),
      join(DIR_RP, "/textures/blocks/positive_mer.png"),
    ),

    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "positive_normal.png"),
      join(DIR_RP, "/textures/blocks/positive_normal.png"),
    ),

    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "brick_normal.png"),
      join(DIR_RP, "/textures/blocks/brick_normal.png"),
    ),

    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "metal_normal.png"),
      join(DIR_RP, "/textures/blocks/metal_normal.png"),
    ),

    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "dot_normal.png"),
      join(DIR_RP, "/textures/blocks/dot_normal.png"),
    ),

    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "pyramid_normal.png"),
      join(DIR_RP, "/textures/blocks/pyramid_normal.png"),
    ),
    Deno.copyFile(
      join(DIR_SRC, "assets", "materials", "planks_normal.png"),
      join(DIR_RP, "/textures/blocks/planks_normal.png"),
    ),
    Deno.copyFile(
      join(DIR_SRC, "assets", "img", "pack_icon.png"),
      join(DIR_RP, "/pack_icon.png"),
    ),
    Deno.copyFile(
      join(DIR_SRC, "assets", "img", "pack_icon.png"),
      join(DIR_BP, "/pack_icon.png"),
    ),
  ]);

  const dotMer = await decode(
    await Deno.readFile(join(DIR_SRC, "assets", "materials", "dot_mer.png")),
    true,
  ) as Image;
  dotMer.resize(16, 16).green(0, true); // Resize and disable emissive channel

  await Deno.writeFile(
    join(DIR_RP, "textures", "blocks", "dot_mer.png"),
    await dotMer.encode(),
  );

  await Deno.copyFile(
    join(DIR_SRC, "assets", "materials", "dot_glowing_mer.png"),
    join(DIR_RP, "/textures/blocks/dot_glowing_mer.png"),
  );

  // await Deno.copyFile(
  //   join(DIR_SRC, "assets", "models", "pane.geo.json"),
  //   join(DIR_RP, "/models/blocks/pane.geo.json"),
  // );

  // Copy all textures in the assets/blocks directory
  for await (
    const file of expandGlob(
      join(DIR_SRC, "assets", "blocks", "*.png"),
    )
  ) {
    await Deno.copyFile(
      file.path,
      join(DIR_RP, "/textures/blocks", file.name),
    );

    // If this file has a _mer and _normal counterpart, then create a .texture_set.json file
    const merFile = join(
      DIR_SRC,
      "assets",
      "blocks",
      file.name.replace(".png", "_mer.png"),
    );

    const normalFile = join(
      DIR_SRC,
      "assets",
      "blocks",
      file.name.replace(".png", "_normal.png"),
    );

    if (
      await Deno.stat(merFile).catch(() => null) &&
      await Deno.stat(normalFile).catch(() => null)
    ) {
      const color = basename(file.name, ".png");

      await Deno.writeTextFile(
        join(
          DIR_RP,
          "/textures/blocks",
          file.name.replace(".png", ".texture_set.json"),
        ),
        JSON.stringify(
          {
            format_version: "1.16.100",
            "minecraft:texture_set": {
              color,
              metalness_emissive_roughness: `${color}_mer`,
              normal: `${color}_normal`,
            },
          },
          null,
          2,
        ),
      );
    }
  }
}
