import { DIR_SRC } from "../store/_config.ts";
import BlockEntry from "./BlockEntry.ts";
import { createCanvas, loadImage } from "canvas/mod.ts";
import {
  convertRgbToHsl,
  filterBrightness,
  filterSaturate,
  formatHex,
  parseHex,
} from "culori";

type CuloriColor = {
  mode: string;
  r: number;
  g: number;
  b: number;
  alpha?: undefined;
} | {
  mode: string;
  r: number;
  g: number;
  b: number;
  alpha: number;
} | undefined;

const dim = (c: CuloriColor, level: number) =>
  filterBrightness(level, "rgb")(filterSaturate(0.98, "rgb")(c));

export default async function render(block: BlockEntry, size: number) {
  if (
    block.material.render !== undefined &&
    typeof block.material.render === "function"
  ) {
    return await block.material.render(block, size);
  }

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.globalAlpha = block.alpha;
  ctx.fillStyle = block.hexColor();

  const color = parseHex(block.hexColor());
  const hsl = convertRgbToHsl({
    r: color?.r,
    g: color?.g,
    b: color?.b,
    alpha: block.alpha,
  });
  const isLight = hsl.l > 0.5;

  // Making "glowing 0%" appear darker
  if (block.material.label === "emissive") {
    ctx.fillStyle = formatHex(
      dim(color, Math.min(0.99, Math.max(0.5, block.level * 0.001) + 0.1)),
    ) ??
      block.hexColor();
  }

  ctx.fillRect(0, 0, size, size);

  if (block.material.shading) {
    for (let idx = 0; idx < block.material.shading.length; idx++) {
      let blendMode = block.material.shading[idx]?.blend ?? "source-over";

      if (Array.isArray(blendMode)) {
        blendMode = blendMode[isLight ? 0 : 1];
      }

      ctx.globalCompositeOperation = blendMode;

      try {
        const shading = await loadImage(
          await Deno.readFile(
            `${DIR_SRC}/assets/materials/${
              block.material.shading[idx]?.texture ?? "plastic"
            }.png`,
          ),
        );
        ctx.drawImage(shading, 0, 0, size, size);
      } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
          throw err;
        }
      }
    }
  }

  return canvas.toBuffer("image/png");
}
