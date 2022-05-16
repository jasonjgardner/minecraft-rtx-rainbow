import { join, toFileUrl } from "path/mod.ts";
import { DIR_SRC } from "/src/store/_config.ts";
import { fetchData } from "/src/_utils.ts";
import {
  addToBehaviorPack,
  addToResourcePack,
} from "/src/components/_state.ts";

type OutputSizes = 16 | 32 | 64 | 128 | 256;

export default async function setup(outputSize: OutputSizes, iconSrc?: URL) {
  const iconUrl = iconSrc ??
    toFileUrl(join(DIR_SRC, "assets", "img", "pack_icon.png"));
  try {
    // TODO: Generate pack icon with each build
    const packIcon = await (await fetchData(iconUrl)).encode(3);

    addToResourcePack(
      "pack_icon.png",
      packIcon,
    );
    addToBehaviorPack(
      "pack_icon.png",
      packIcon,
    );
  } catch (err) {
    console.error('Failed adding pack icons from URL "%s"! %s', iconUrl, err);
  }

  try {
    const normalMap = await fetchData(
      toFileUrl(
        join(
          DIR_SRC,
          "assets",
          "materials",
          `block_normal@${outputSize}x.png`,
        ),
      ),
    );

    addToResourcePack(
      "textures/blocks/block_normal.png",
      await normalMap.encode(3),
    );
  } catch (err) {
    console.error("Failed adding normal map: %s", err);
  }

  try {
    const itemTexture = await fetchData(
      toFileUrl(join(DIR_SRC, "assets", "img", "rainbow_trail_key.png")),
    );
    addToResourcePack(
      "textures/items/rainbow_trail_key.png",
      await itemTexture.encode(3),
    );
  } catch (err) {
    console.error("Failed adding rainbow trail key texture: %s", err);
  }
}
