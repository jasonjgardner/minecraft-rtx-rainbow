import type { ChannelValue, PaletteInput, RGB, RGBA } from "/typings/types.ts";
import { DEFAULT_NAMESPACE } from "/typings/constants.ts";
import { decode } from "https://deno.land/std@0.140.0/encoding/base64.ts";
import { GIF, Image } from "imagescript/mod.ts";
import { basename, extname, toFileUrl } from "path/mod.ts";

/**
 * Ensure namespace input is usable in Minecraft
 * @param entry Form submission value
 * @returns Sanitized namespace string
 */
export function sanitizeNamespace(entry: FormDataEntryValue | PaletteInput) {
  const namespace = (
    entry instanceof File
      ? basename(entry.name, extname(entry.name))
      : entry ?? DEFAULT_NAMESPACE
  )
    .trim()
    .replace(/[^A-Za-z0-9_\-]/gi, "");

  if (namespace === "minecraft" || namespace === "minecon") {
    throw Error(`Can not used reserved namespace "${namespace}"`);
  }

  return namespace;
}

/**
 * Convert a hex color into an RGB number array
 * @param hex HEX color string to parse
 * @returns Array of equivalent RGB values [0-255]
 */
export function hex2rgb(hex: string): RGB {
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    throw Error("Invalid HEX string input");
  }

  const rgb = result.slice(1, 4).map((hexCode) => parseInt(hexCode, 16));
  return [rgb[0], rgb[1], rgb[2]];
}

/**
 * Restrict a number value to be within a certain minimum and maximum value
 * @param value Number to restrict
 * @param max Maximum value
 * @param min Minimum value
 * @returns Number within maximum and minimum values
 */
export function clamp(value: number, max: number, min = 0) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Convert an array of RGB values [0-255] to a HEX color string
 * @param values RGB values [0-255]
 * @returns HEX color string
 */
export function hexValue(values: RGB | RGBA) {
  return values.map((v: number) => v.toString(16).padStart(2, "0")).join("");
}

/**
 * Convert RGBA into an ARGB hex color string
 * @param rgba RGBA number values
 * @returns ARGB hex string
 */
export function formatAhex(rgba: RGBA) {
  const [r, g, b, a] = rgba;
  return "#" + hexValue([a, r, g, b]);
}

/**
 * Convert a RGB(A) value into an image
 * @param layerValue RGB(A) color value
 * @param size Image output size
 * @returns Solid-color RGB(A) value as an encoded image
 */
export function encodeRGBColor(layerValue: RGB | RGBA, size = 16) {
  const [r, g, b, alpha] = layerValue;
  const imgOutput = new Image(size, size);

  imgOutput.fill(
    alpha !== undefined
      ? Image.rgbaToColor(r, g, b, alpha)
      : Image.rgbToColor(r, g, b),
  );

  return imgOutput.encode(0);
}

/**
 * Convert a string into a URL and decode the remote image
 * @uses fetchImage
 * @param src Image file path or URL
 * @returns Promise from fetched URL
 */
function getImageFromUrl(src: string): Promise<Image | GIF> {
  return fetchImage(
    src.toLowerCase().startsWith("http://") ||
      src.toLowerCase().startsWith("https://")
      ? new URL(src)
      : toFileUrl(src),
  );
}

/**
 * Decode image or URL input
 * @param src File or text input value
 * @returns Decoded file or image from URL/path
 */
export async function handlePaletteInput(src: Exclude<PaletteInput, null>) {
  let data;
  let decoded;
  //let ext = ".png";

  if (typeof src === "string") {
    data = decode(src);
    //return getImageFromUrl(src);
  } else {
    data = new Uint8Array(await src.arrayBuffer());
    //ext = extname(src.name);
  }

  try {
    decoded = await GIF.decode(data);
  } catch {
    console.log("Can not decode as GIF");
  }

  return decoded ?? Image.decode(data);
}

/**
 * Convert a semver string into an array of numbers
 * @param ver Semantic version number
 * @returns Version number values as an array
 */
export function semverVector(ver: string): number[] {
  return ver.split(".", 3).map((v: string) => parseInt(v, 10));
}

/**
 * Convert channel value to decimal percentage
 * @param value Channel value [0-255]
 * @returns Decimal value [0-1]
 */
export function channelToPercentage(value: number | ChannelValue): number {
  return Math.max(0, Math.min(1, value / 255));
}

/**
 * Calculate channel value from a decimal percentage
 * @param percentage Decimal percentage level
 * @returns Channel equivalent of percentage
 */
export function percentageToChannel(percentage: number): ChannelValue {
  return Math.ceil((Math.max(0, Math.min(1, percentage)) * 255) / 100);
}

/**
 * Decode an image from a URL source
 * @param source Image URL
 * @returns Decoded image fetched from URL
 */
export async function fetchImage(source: URL): Promise<Image | GIF> {
  const res = await fetch(source.href);
  const data = new Uint8Array(await res.arrayBuffer());
  const isGif = extname(source.href) === ".gif" ||
    res.headers.get("content-type")?.startsWith("image/gif") === true;

  return isGif ? GIF.decode(data) : Image.decode(data);
}

/**
 * Compare two RGB(A) values
 * @param colorOne First RGB(A) color value
 * @param colorTwo Second RGB(A) color value
 * @param fuzziness The color range difference allowed per channel (0 = exact match)
 * @returns `TRUE` if colors are the same RGB(A) values
 */
export function rgbaMatch(
  colorOne: RGB | RGBA | number[],
  colorTwo: RGB | RGBA | number[],
  fuzziness: RGB | RGBA | number[],
) {
  const len = colorOne.length;
  const len2 = colorTwo.length;

  return (
    len === len2 &&
    len <= 4 &&
    colorOne.every((value: ChannelValue, idx) =>
      Math.abs(value - colorTwo[idx]) <=
        Math.min(255, Math.max(0, fuzziness[idx]))
    )
  );
}
