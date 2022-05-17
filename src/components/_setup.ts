import type { PackSizes, PaletteInput } from "/typings/types.ts";
import { join, toFileUrl } from "path/mod.ts";
import { GIF, Image, TextLayout } from "imagescript/mod.ts";
import { DIR_SRC } from "/src/store/_config.ts";
import { fetchImage, handlePaletteInput } from "/src/_utils.ts";
import {
  addToBehaviorPack,
  addToResourcePack,
} from "/src/components/_state.ts";

export function getDefaultIcon() {
  return fetchImage(
    toFileUrl(join(DIR_SRC, "assets", "img", "pack_icon.png")),
  );
}

// FIXME: Host font locally
async function fetchFont(): Promise<Uint8Array> {
  return new Uint8Array(
    await (await fetch(
      "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.otf",
    )).arrayBuffer(),
  );
}

export async function generatePackIcon(
  namespace: string,
  artSrc: PaletteInput,
) {
  const icon = <Image> await handlePaletteInput(
    artSrc,
    await getDefaultIcon(), // FIXME: Avoid fetching default icon when artSrc is not null
  );

  const iconHeadlineImg = Image.renderText(
    await fetchFont(),
    12,
    namespace,
    Image.rgbToColor(255, 255, 255),
    new TextLayout({
      maxWidth: 250,
      maxHeight: 250,
      horizontalAlign: "middle",
      verticalAlign: "center",
      wrapHardBreaks: false,
    }),
  );

  icon.composite(iconHeadlineImg);

  return icon.encode(3);
}

export default async function setup(
  outputSize: PackSizes,
  packIcon: Uint8Array,
) {
  try {
    addToResourcePack(
      "pack_icon.png",
      packIcon,
    );
    addToBehaviorPack(
      "pack_icon.png",
      packIcon,
    );
  } catch (err) {
    console.error("Failed adding pack icons! %s", err);
  }

  try {
    const normalMap = await fetchImage(
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
    const itemTexture = await fetchImage(
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
