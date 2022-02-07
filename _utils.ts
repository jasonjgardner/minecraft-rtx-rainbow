import { Image } from "https://deno.land/x/imagescript/mod.ts";
import type { PackSizes, RGB } from "./types.ts";

export function hex2rgb(hex: string): [number, number, number] {
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    throw Error("Invalid HEX string input");
  }

  const rgb = result.slice(1, 4).map((hexCode) => parseInt(hexCode, 16));
  return [rgb[0], rgb[1], rgb[2]];
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

export async function makeAtlas(frames: Array<RGB>, size?: PackSizes) {
  const frameCount = frames.length;
  const s = size || 16;
  const atlasOutput = new Image(s, Math.min(20, Math.max(s, s * frameCount)));

  // Create atlas frames
  for (let itr = 0; itr < frameCount; itr++) {
    const imgOutput = new Image(s, s);

    imgOutput.fill(
      Image.rgbToColor(...frames[itr]),
    );

    // Join frames into single image
    atlasOutput.composite(imgOutput, 0, itr * s);
  }

  return await atlasOutput.encode(0);
}

export function getArg(
  key: string,
  defaultValue: string | number | boolean,
): string {
  return `${(Deno.args.indexOf(`--${key}`) + 1) || defaultValue}`;
}

export function channelPercentage(percentage: number) {
  return Math.floor((Math.max(0, percentage) * 255) / 100);
}
