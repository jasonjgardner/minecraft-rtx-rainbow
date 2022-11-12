import { DIR_RP } from "../store/_config.ts";
import BlockEntry from "./BlockEntry.ts";
import { Image } from "imagescript/mod.ts";
import {
  converter,
  filterContrast,
  formatHex,
  parse,
} from "https://deno.land/x/culori@v2.1.0-alpha.0/index.js";

export default async function render(block: BlockEntry, size: number) {
  const color = parse(block.hexColor());
  converter("rgb")(color);

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <rect width="15" height="15" style="fill:${block.hexColor()});"/>
  <polygon points="16 0 15 0 15 15 0 15 0 16 16 16 16 0 16 0" style="fill: ${
      formatHex(filterContrast(0.9)(color)) ?? "#121212"
    };"/>
</svg>`;

  const img = Image.renderSVG(svg, Math.max(16, Math.min(256, size)));

  img.opacity(block.alpha);

  await Deno.writeFile(
    `${DIR_RP}/textures/blocks/${block.id}.png`,
    await img.encode(),
  );
}
