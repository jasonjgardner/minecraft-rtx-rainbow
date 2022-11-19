import type { Axis } from "../../typings/types.ts";
import { decode as decodeImage, Frame, GIF, Image } from "imagescript/mod.ts";
import { extname, join } from "https://deno.land/std@0.123.0/path/mod.ts";
import { sprintf } from "https://deno.land/std@0.125.0/fmt/printf.ts";
import { EOL } from "https://deno.land/std@0.125.0/fs/mod.ts";
import { materials } from "../store/_materials.ts";
import BlockEntry from "./BlockEntry.ts";
import { DIR_BP } from "../store/_config.ts";
import { hex2rgb } from "https://crux.land/3RdawE";

import type { IMaterial, RGB } from "../../typings/types.ts";

const MAX_PRINT_SIZE = 3 * 16;
const MASK_COLOR = [
  Image.rgbaToColor(255, 255, 255, 0),
  Image.rgbaToColor(0, 0, 0, 0),
]; // Image.rgbToColor(...hex2rgb("#ff00ff"));
const FUNCTIONS_NAMESPACE = "printer";
const DIR_FUNCTIONS = join(DIR_BP, "functions", FUNCTIONS_NAMESPACE);

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
  fillWith = "air",
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
  return `fill ${position} ${position} ${fillWith} 0 keep`;
}

export async function decode(
  src: URL,
  palette: BlockEntry[],
  offset: number[],
  axis: Axis = "z",
  absolutePosition = false,
): Promise<string[]> {
  // TODO: Add 10000 line limit
  const imgSrc = await decodeImage(
    await (await fetch(src)).arrayBuffer(),
    true,
  );
  const img = imgSrc instanceof GIF ? imgSrc[0] : imgSrc;

  const func: string[] = [];

  for (const [x, y, c] of img.iterateWithColors()) {
    const nearest =
      getNearestColor(<RGB> Image.colorToRGB(c), palette)?.behaviorId ??
        "cobblestone";

    if (absolutePosition) {
      func.push(
        `fill ${x + offset[0]} ${(img.height - y) + offset[1]})} ${offset[2]} ${
          x + offset[0]
        } ${y + offset[1]} ${offset[2]} ${nearest} 0 keep`,
      );
      continue;
    }

    func.push(
      writeFill(
        x + offset[0],
        Math.abs((y + offset[1]) - img.height), // Starts print row at top
        offset[2],
        nearest,
        <Axis> axis,
      ),
    );
  }

  return func;
}

async function printDecoded(
  name: string,
  idx: number,
  img: Image | Frame,
  palette: BlockEntry[],
  offset: number[],
) {
  const axes = ["x", "y", "z"] as const;

  // TODO: Add 10000 line limit

  return await Promise.all(
    materials.flatMap(async ({ label }: IMaterial) => {
      const materialPalette = palette.filter(({ material }: BlockEntry) =>
        label === material.label
      );

      return await Promise.all(axes.map(async (axis) => {
        const func: string[] = [];

        for (const [x, y, c] of img.iterateWithColors()) {
          const nearest = MASK_COLOR.includes(c)
            ? "air"
            : getNearestColor(<RGB> Image.colorToRGB(c), materialPalette)
              .behaviorId;

          func.push(
            writeFill(
              x + offset[0],
              Math.abs((y + offset[1]) - img.height), // Starts print row at top
              offset[2],
              nearest,
              <Axis> axis,
            ),
          );
        }

        // FIXME: Use sprintf
        const filename = `${name + (idx ? `_${idx}` : "")}_${
          label || ""
        }_${axis}`;

        await Deno.writeTextFile(
          join(
            DIR_FUNCTIONS,
            `${filename}.mcfunction`,
          ),
          func.join(EOL.CRLF),
        );

        return filename;
      }));
    }),
  );
}

export async function pixelPrinter(
  name: string,
  imageUrl: URL,
  palette: BlockEntry[],
  chunks = 2,
) {
  const res = await fetch(imageUrl.href);
  const data = new Uint8Array(await res.arrayBuffer());

  const frames = (extname(imageUrl.href) !== ".gif")
    ? [await Image.decode(data)]
    : (await GIF.decode(data, false));

  const size = Math.min(MAX_PRINT_SIZE, chunks * 16);

  let fnNames: Array<string | undefined> = [];
  let idx = 0;

  for await (const frame of frames) {
    if (frame.width > size) {
      frame.resize(size, Image.RESIZE_AUTO, Image.RESIZE_NEAREST_NEIGHBOR);
    }

    // Align frames end-to-end
    //const offsets = [(idx * frame.width) + 1, 0, idx + 1];

    // Align frames as stack
    const offsets = [0, 0, idx];

    await printDecoded(
      name,
      idx,
      frame,
      palette,
      offsets,
    );
    idx++;
  }
}
