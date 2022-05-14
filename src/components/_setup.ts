import { join, toFileUrl } from "path/mod.ts";
import { DIR_SRC } from "../store/_config.ts";
import { fetchData } from "/src/_utils.ts";
import {
  addToBehaviorPack,
  addToResourcePack,
} from "/src/components/_state.ts";

export default async function setup(outputSize = 64) {
  try {
    addToResourcePack(
      "textures/blocks/block_normal.png",
      await fetchData(
        toFileUrl(
          join(
            DIR_SRC,
            "assets",
            "materials",
            `block_normal@${outputSize}x.png`,
          ),
        ),
      ),
    );
  } catch (err) {
    console.error("Failed adding normal map: %s", err);
  }

  try {
    addToResourcePack(
      "textures/items/rainbow_trail_key.png",
      await fetchData(
        toFileUrl(join(DIR_SRC, "assets", "img", "rainbow_trail_key.png")),
      ),
    );
  } catch (err) {
    console.error("Failed adding rainbow trail key texture: %s", err);
  }

  const iconUrl = toFileUrl(join(DIR_SRC, "assets", "img", "pack_icon.png"));
  try {
    // TODO: Generate pack icon with each build
    const packIcon = await fetchData(iconUrl);

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
}
