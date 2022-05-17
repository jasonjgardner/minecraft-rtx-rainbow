import type { PaletteInput, RGB, RgbaObj } from "/typings/types.ts";
import { DEFAULT_NAMESPACE } from "/typings/constants.ts";
import { GIF, Image } from "imagescript/mod.ts";
import { basename, extname, toFileUrl } from "path/mod.ts";

export function sanitizeNamespace(entry: FormDataEntryValue | PaletteInput) {
  return (entry instanceof File
    ? basename(entry.name, extname(entry.name))
    : entry ?? DEFAULT_NAMESPACE)
    .trim()
    .replace(/[^A-Za-z0-9_\-]/gi, "");
}
export function hex2rgb(hex: string): [number, number, number] {
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    throw Error("Invalid HEX string input");
  }

  const rgb = result.slice(1, 4).map((hexCode) => parseInt(hexCode, 16));
  return [rgb[0], rgb[1], rgb[2]];
}

export function clamp(value: number, max: number, min = 0) {
  return Math.max(min, Math.min(max, value));
}

const hexValue = (values: number[] | RGB) =>
  values.map((v: number) => v.toString(16).padStart(2, "0")).join("");

export function formatAhex({ r, g, b, alpha }: RgbaObj) {
  return "#" + hexValue([channelPercentage(alpha * 100), r, g, b]);
}

export function formatHex(color: RgbaObj) {
  const values = Object.values(color);
  values.length = 3; // Truncate excess
  return "#" + hexValue(values);
}

export async function encodeRGBColor(layerValue: number[], size = 16) {
  const [r, g, b, alpha] = layerValue;
  const imgOutput = new Image(size, size);

  imgOutput.fill(
    alpha !== undefined
      ? Image.rgbaToColor(r, g, b, alpha)
      : Image.rgbToColor(r, g, b),
  );

  return await imgOutput.encode(0);
}

function getImageFromUrl(src: string): Promise<Image | GIF> {
  return fetchImage(
    (src.toLowerCase().startsWith("http://") ||
        src.toLowerCase().startsWith("https://"))
      ? new URL(src)
      : toFileUrl(src),
  );
}

export function handlePaletteInput(src: PaletteInput, defaultSrc: Image | GIF) {
  if (!src) {
    return defaultSrc;
  }

  return (src && typeof src !== "string")
    ? getImageFromFile(src)
    : getImageFromUrl(src);
}

// TODO: Use Deno.open instead of FileReader?
export function getImageFromFile(src: File): Promise<Image> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () =>
      reader.result
        ? res(Image.decode(new Uint8Array(<ArrayBuffer> reader.result)))
        : rej("Failed reading file to array buffer");
    reader.readAsArrayBuffer(src);
  });
}

export function semverVector(ver: string): number[] {
  return ver.split(".", 3).map((v: string) => parseInt(v, 10));
}

export function getArg(
  key: string,
  defaultValue: string | number | boolean,
): string {
  const k = Deno.args.indexOf(`--${key}`);
  return `${(k > -1 ? Deno.args[k + 1] : null) ?? defaultValue}`;
}

export function getConfig(
  key: string,
  defaultValue?: string | number,
): string | number | undefined {
  const k = Deno.args.indexOf(`--${key}`);
  return (k > -1 ? Deno.args[k + 1] : null) ?? (Deno.env.get(key) ||
    defaultValue);
}

export function channelPercentage(percentage: number) {
  return Math.ceil((Math.max(0, percentage) * 255) / 100);
}

export async function fetchImage(source: URL): Promise<Image | GIF> {
  const res = await fetch(source.href);
  const data = new Uint8Array(await res.arrayBuffer());
  const isGif =
    res.headers.get("content-type")?.startsWith("image/gif") === true;

  return isGif ? GIF.decode(data) : Image.decode(data);
}
