import { toFileUrl } from "path/mod.ts";
import { Image } from "imagescript/mod.ts";
import HueBlock from "/src/components/blocks/HueBlock.ts";
import { fetchData } from "/src/_utils.ts";
import getDefaultPalette from "/src/components/palettes/default.ts";

const MAX_PALETTE_SIZE = 255 ** 3;
const DEFAULT_IMAGE_URL = "https://placekitten.com/64/64";
async function getImageFromUrl(src: string): Promise<Image> {
  return Image.decode(
    await fetchData(
      (src.toLowerCase().startsWith("http://") ||
          src.toLowerCase().startsWith("https://"))
        ? new URL(src)
        : toFileUrl(src),
    ),
  );
}

function getImageFromFile(src: File): Promise<Image> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () =>
      reader.result
        ? res(Image.decode(new Uint8Array(<ArrayBuffer> reader.result)))
        : rej("Failed reading file to array buffer");
    reader.readAsArrayBuffer(src);
  });
}
export default async function getPalette(
  src: File | string | null,
): Promise<HueBlock[]> {
  if (src === null) {
    return getDefaultPalette();
  }

  const img = (src && typeof src !== "string")
    ? await getImageFromFile(src)
    : await getImageFromUrl(src ?? DEFAULT_IMAGE_URL);

  const colors: number[] = [];

  for (const [_x, _y, c] of img.iterateWithColors()) {
    colors.push(c);
  }

  const palette = [...new Set(colors)];

  if (palette.length > MAX_PALETTE_SIZE) {
    palette.length = MAX_PALETTE_SIZE;
    console.log("Palette size has been truncated.");
  }

  return palette.map((color) =>
    new HueBlock(`rgba(${Image.colorToRGBA(color).join(",")})`)
  );
}
