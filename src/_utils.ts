import { Image } from "imagescript/mod.ts";

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

export function semverVector(ver: string): number[] {
  return ver.split(".", 3).map((v: string) => parseInt(v, 10));
}

export function getArg(
  key: string,
  defaultValue: string | number | boolean,
): string {
  return `${Deno.args[Deno.args.indexOf(`--${key}`) + 1] ?? defaultValue}`;
}

export function getConfig(
  key: string,
  defaultValue?: string | number,
): string | number | undefined {
  return (Deno.args[Deno.args.indexOf(`--${key}`) + 1] ?? Deno.env.get(key)) ||
    defaultValue;
}

export function channelPercentage(percentage: number) {
  return Math.ceil((Math.max(0, percentage) * 255) / 100);
}

export async function fetchData(source: URL): Promise<Uint8Array> {
  const res = await fetch(source.href)
  return new Uint8Array(await res.arrayBuffer())
}