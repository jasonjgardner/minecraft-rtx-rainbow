import type { PaletteInput } from "/typings/types.ts";
import { join } from "path/mod.ts";
import { GIF, Image, TextLayout } from "imagescript/mod.ts";
import { PACK_ICON_FONT_SIZE, PACK_ICON_SIZE } from "/typings/constants.ts";
import { DIR_SRC } from "/src/store/_config.ts";
import { handlePaletteInput } from "/src/_utils.ts";

const FONT_FILE = "Inter-Bold.ttf";
export async function generatePackIcon(
  namespace: string,
  artSrc: PaletteInput,
) {
  const iconSrc = await (artSrc !== null
    ? handlePaletteInput(
      artSrc,
    )
    : Image.decode(
      await Deno.readFile(join(DIR_SRC, "assets", "img", "pack_icon.png")),
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
      Math.max(0, Math.min(0.95, dominantHsla[1])),
      Math.max(0.5, Math.min(0.99, dominantHsla[2])),
    );

    const iconHeadlineImg = Image.renderText(
      await Deno.readFile(join(DIR_SRC, "assets", "fonts", FONT_FILE)),
      PACK_ICON_FONT_SIZE,
      namespace.toUpperCase(),
      textColor,
      new TextLayout({
        maxWidth: PACK_ICON_SIZE - PACK_ICON_FONT_SIZE,
        maxHeight: PACK_ICON_SIZE - PACK_ICON_FONT_SIZE,
        horizontalAlign: "middle",
        verticalAlign: "center",
        wrapHardBreaks: false,
      }),
    );
    icon.lightness(0.75); // Dim background for text legibility
    icon.composite(iconHeadlineImg);
  } catch (err) {
    console.log("Can not render text: %s", err);
  }

  return icon.encode(3);
}
