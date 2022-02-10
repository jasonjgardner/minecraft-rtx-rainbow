import { Image } from "https://deno.land/x/imagescript/mod.ts";
import { join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { sprintf } from "https://deno.land/std@0.125.0/fmt/printf.ts";
import { EOL } from "https://deno.land/std@0.125.0/fs/mod.ts";
import { materials } from "../store/_materials.ts";
import BlockEntry from "./BlockEntry.ts";
import { DIR_BP } from "../store/_config.ts";
import { hex2rgb } from "../_utils.ts";

import type { IMaterial, RGB } from "../../typings/types.ts";

const MAX_PRINT_SIZE = 3 * 16;
const MASK_COLOR = Image.rgbToColor(...hex2rgb("#ff00ff"));

type Axis = "x" | "y" | "z";

function colorDistance(color1: RGB, color2: RGB) {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) + Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2),
  );
}

export function getNearestColor(
  color: RGB,
  palette: BlockEntry[],
): BlockEntry {
  // https://gist.github.com/Ademking/560d541e87043bfff0eb8470d3ef4894?permalink_comment_id=3720151#gistcomment-3720151
  return palette.reduce(
    (prev: [number, BlockEntry], curr: BlockEntry): [number, BlockEntry] => {
      const distance = colorDistance(color, hex2rgb(curr.hexColor()));

      return (distance < prev[0]) ? [distance, curr] : prev;
    },
    [Number.POSITIVE_INFINITY, palette[0]],
  )[1];
}

function writeFill(
  x: number,
  y: number,
  z: number,
  fillWith?: BlockEntry,
  flipAxis?: Axis,
): string {
  const position = sprintf(
    "~%d ~%d ~%d",
    ...(flipAxis === "x"
      ? [z, y, x]
      : flipAxis === "y"
      ? [x, z, y]
      : [x, y, z]),
  );
  return `fill ${position} ${position} ${fillWith?.behaviorId || "air"} 0 keep`;
}

export async function pixelPrinter(
  name: string,
  imageUrl: URL,
  palette: BlockEntry[],
  chunks = 2,
) {
  const res = await fetch(imageUrl.href);
  const decoded = await Image.decode(new Uint8Array(await res.arrayBuffer()));

  const size = Math.min(MAX_PRINT_SIZE, chunks * 16);

  const img = decoded.width > size
    ? decoded.resize(size, Image.RESIZE_AUTO)
    : decoded;

  const OFFSET_Z = -1;

  const axises = ["x", "y", "z"] as const;

  await Promise.all(materials.map(async ({ label }: IMaterial) => {
    const materialPalette = palette.filter(({ material }: BlockEntry) =>
      label === material.label
    );

    await Promise.all(axises.map(async (axis) => {
      const func: string[] = [];
      for (const [x, y, c] of img.iterateWithColors()) {
        const nearest = c !== MASK_COLOR
          ? getNearestColor(<RGB> Image.colorToRGB(c), materialPalette)
          : undefined;

        func.push(
          writeFill(
            x,
            Math.abs(y - img.height),
            OFFSET_Z,
            nearest,
            <Axis> axis,
          ),
        );

        await Deno.writeTextFile(
          join(
            DIR_BP,
            `functions/printer/${name}_${label || ""}_${axis}.mcfunction`,
          ),
          func.join(EOL.CRLF),
        );
      }
    }));
  }));
}
