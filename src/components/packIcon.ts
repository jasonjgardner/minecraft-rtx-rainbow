import type { PaletteInput } from "/typings/types.ts";
import {
  COMPRESSION_LEVEL,
  FONT_FILE,
  FONT_URL,
  PACK_ICON_FONT_SIZE,
  PACK_ICON_SIZE,
} from "/typings/constants.ts";
import { join } from "path/mod.ts";
import { GIF, Image, TextLayout } from "imagescript/mod.ts";
import { handlePaletteInput } from "../_utils.ts";

async function loadFont() {
  try {
    await Deno.readFile(join(Deno.cwd(), "src", "assets", "fonts", FONT_FILE));
  } catch (err) {
    console.log("Failed reading local font: %s", err);
  }

  return new Uint8Array(await (await fetch(FONT_URL)).arrayBuffer());
}

export async function generatePackIcon(
  namespace: string,
  artSrc: PaletteInput,
) {
  const iconSrc = await (artSrc !== null
    ? handlePaletteInput(
      artSrc,
    )
    : Image.decode(
      await Deno.readFile(
        join(Deno.cwd(), "src", "assets", "img", "pack_icon.png"),
      ),
    ));

  const icon = iconSrc instanceof GIF ? iconSrc[0] : iconSrc;

  // Resize to ideal pack_icon.png dimensions
  icon.resize(PACK_ICON_SIZE, PACK_ICON_SIZE);

  // Attempt to overlay the pack title on the icon
  try {
    const dominantRgba = Image.colorToRGBA(icon.dominantColor());
    const dominantHsla = Image.rgbaToHSLA(
      dominantRgba[0],
      dominantRgba[1],
      dominantRgba[2],
      1,
    );
    // Desaturate and lighten text
    const textColor = Image.hslToColor(
      dominantHsla[0],
      Math.max(0, Math.min(0.66, dominantHsla[1])),
      Math.max(0.75, Math.min(0.99, dominantHsla[2])),
    );

    const iconHeadlineImg = Image.renderText(
      await loadFont(),
      PACK_ICON_FONT_SIZE,
      namespace.toUpperCase(),
      textColor,
      new TextLayout({
        horizontalAlign: "middle",
        verticalAlign: "center",
        wrapHardBreaks: false,
      }),
    );
    icon.lightness(0.66); // Dim background for text legibility
    icon.saturation(0.75);
    icon.composite(iconHeadlineImg);
  } catch (err) {
    console.log("Can not render text: %s", err);
  }

  return icon.encode(COMPRESSION_LEVEL);
}
