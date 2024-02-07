import { Image } from "imagescript/mod.ts";

export function rgb2hex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
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
  const keyPos = Deno.args.indexOf(`--${key}`);
  return keyPos >= 0
    ? `${Deno.args[keyPos + 1] ?? defaultValue}`
    : `${defaultValue}`;
}

export function getConfig(
  key: string,
  defaultValue?: string | number,
): string | number | undefined {
  const keyPos = Deno.args.indexOf(`--${key}`);
  return keyPos >= 0
    ? (Deno.args[keyPos + 1] ?? Deno.env.get(key)) ||
      defaultValue
    : defaultValue;
}

export function channelPercentage(percentage: number) {
  return Math.ceil((Math.max(0, percentage) * 255) / 100);
}

export function getMinecraftLocation(): string {
  const { code, stdout, stderr } = (new Deno.Command("powershell.exe", {
    args: [
      'Get-AppxPackage -Name "Microsoft.MinecraftUWP*" | Select-Object -ExpandProperty InstallLocation',
    ],
  })).outputSync();

  if (code !== 0) {
    console.error(stderr);
    Deno.exit(code);
  }

  const decoder = new TextDecoder();
  return decoder.decode(stdout).trim();
}
