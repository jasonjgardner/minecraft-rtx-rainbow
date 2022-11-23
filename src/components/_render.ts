import { DIR_RP, DIR_SRC } from "../store/_config.ts";
import BlockEntry from "./BlockEntry.ts";
import { decode, Image } from "imagescript/mod.ts";
import { createCanvas, loadImage } from "canvas/mod.ts";

export default async function render(block: BlockEntry, size: number) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.globalAlpha = block.alpha;
  ctx.fillStyle = block.hexColor();
  ctx.fillRect(0, 0, size, size);

  if (block.material.shading) {
    for (let idx = 0; idx < block.material.shading.length; idx++) {
      ctx.globalCompositeOperation = block.material.shading[idx]?.blend ??
        "source-over";

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
