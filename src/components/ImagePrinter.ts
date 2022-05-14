import { Frame, GIF, Image } from "imagescript/mod.ts";
import { basename, extname, join } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import * as log from "log/mod.ts";
import { EOL } from "fs/mod.ts";
import { materials } from "/src/store/_materials.ts";
import BlockEntry from "./BlockEntry.ts";
import { hex2rgb, fetchData } from "/src/_utils.ts";
import { addToBehaviorPack } from "/src/components/_state.ts";

import type { IMaterial, RGB } from "/typings/types.ts";

const GLASS_ID = "glass";
const MAX_FRAMES = 10;
const MAX_PRINT_SIZE = 24 * 16;
const FUNCTIONS_NAMESPACE = "printer";
const DIR_FUNCTIONS = join("functions", FUNCTIONS_NAMESPACE);

const logger = log.getLogger();

export type Alignment = "e2e" | "b2b" | "even" | "odd" | "none";
type Axis = "x" | "y" | "z";

interface PrinterResult {
  label: string;
  axis: Axis;
  func: string;
}

function colorDistance(color1: RGB, color2: RGB) {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) + Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2),
  );
}

export function getNearestColor(
  color: number[],
  palette: BlockEntry[],
  crystal = false,
): BlockEntry {
  const rgbColor = <RGB> [color[0] || 0, color[1] || 0, color[2] || 0];
  const alpha = color[3] || 0;

  const materialPalette = (alpha >= 100 && !crystal)
    ? palette
    : palette.filter(({ color: { rgba } }: BlockEntry) => rgba[3] < 1); // Restrict palette to blocks with transparency

  // https://gist.github.com/Ademking/560d541e87043bfff0eb8470d3ef4894?permalink_comment_id=3720151#gistcomment-3720151
  return materialPalette.reduce(
    (prev: [number, BlockEntry], curr: BlockEntry): [number, BlockEntry] => {
      const distance = colorDistance(rgbColor, hex2rgb(curr.color.hex));

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

function printDecoded(
  name: string,
  img: Image | Frame,
  palette: BlockEntry[],
  offset: number[],
  dest: string,
) {
  const axises = ["x", "y", "z"] as const;
  const glassAvailable = palette.some(({ material }: BlockEntry) =>
    material.label === GLASS_ID
  );

  let maxLines = 10000;

  return materials.flatMap(({ label }: IMaterial) => {
    if (maxLines <= 0) {
      logger.warning("Function %s has exceeded max length", name);
    }

    // Glass sculptures get extra attention
    const thisIsGlass = glassAvailable && label === GLASS_ID;
    const materialPalette = palette.filter(({ material }: BlockEntry) =>
      label === material.label || thisIsGlass // Always include glass for semi-opaque pixels
    );

    return axises.map((axis): PrinterResult => {
      const func: string[] = [];

      for (const [x, y, c] of img.iterateWithColors()) {
        const rgba = Image.colorToRGBA(c);
        const alpha = glassAvailable ? rgba[3] : 100;

        const nearest = alpha < 50 // Minimum alpha of 50%
          ? "air"
          : getNearestColor(rgba, materialPalette, thisIsGlass)?.behaviorId ||
            "stone";

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

      const filename = sprintf("%s_%s_%s.mcfunction", name, label, axis);

      addToBehaviorPack(
        join(
          dest,
          filename,
        ),
        func.join(EOL.CRLF),
      );

      maxLines -= func.length;

      return { label, axis, func: filename };
    });
  });
}

function getAlignment(
  align: Alignment,
  options?: { idx: number; frame: Image | Frame; coords?: number[] },
): number[] {
  const idx = options?.idx || 1;
  const [x, y, z] = options?.coords && options.coords.length >= 3
    ? options.coords
    : [0, 0, 0];

  if (align === "e2e" && options !== undefined) {
    // End-to-end alignment
    // (Places blocks like sprite sheet row)
    return [
      x + (idx * options.frame.width),
      y,
      z,
    ];
  }

  if (align === "b2b") {
    // Back-to-back alignment
    // (Places block in a stack. Offsets by index.)
    return [0, 0, idx];
  }

  // Back-to-back alternating options
  if (align === "even") {
    return [x, y, idx % 2 === 0 ? z + idx : 1 + z + idx];
  }

  if (align === "odd") {
    return [x, y, idx % 2 ? z + idx : 1 + z + idx];
  }

  // Align in-place
  return [x, y, z];
}

/**
 * @param name File name
 * @param imageUrl Source image
 * @param palette Color options
 * @param options Alignment and chunk size
 */
export async function pixelPrinter(
  name: string,
  imageUrl: URL,
  palette: BlockEntry[],
  options: {
    alignment?: Alignment;
    chunks?: number;
  },
) {
  const data = await fetchData(imageUrl)

  const frames = (extname(imageUrl.href) !== ".gif")
    ? [await Image.decode(data)]
    : (await GIF.decode(data, false));

  const size = Math.min(MAX_PRINT_SIZE, (options.chunks ?? 2) * 16);
  const frameCount = Math.min(MAX_FRAMES, frames.length);
  frames.length = frameCount;

  let idx = 0;

  const groupFn: Array<PrinterResult[]> = [];
  const alignGroup = options.alignment || "b2b";

  for await (const frame of frames) {
    if (frame.width > size) {
      frame.resize(size, Image.RESIZE_AUTO, Image.RESIZE_NEAREST_NEIGHBOR);
    }

    let dest = DIR_FUNCTIONS;
    let fileName = name;

    if (frameCount > 1) {
      fileName = sprintf("%s_%02s", name, `${idx}`);
      dest = join(DIR_FUNCTIONS, name);
      //await ensureDir(relative(Deno.cwd(), dest));
    }

    groupFn.push(
      printDecoded(
        fileName,
        frame,
        palette,
        getAlignment(alignGroup, {
          idx,
          frame,
        }),
        dest,
      ),
    );
    idx++;
  }

  if (frameCount < 2) {
    return;
  }

  // GIFs with "none" alignment get delay to animate fill
  createParentFunction(name, groupFn, size);
}

function createParentFunction(
  name: string,
  groupFn: Array<PrinterResult[]>,
  _size: number,
) {
  const fns: { [key: string]: string[] } = {};
  groupFn.forEach((group) => {
    group.forEach(({ label, axis, func }) => {
      const key = `${label}_${axis}`;

      if (!Array.isArray(fns[key])) {
        fns[key] = [];
      }

      const line = `function ${FUNCTIONS_NAMESPACE}/${name}/${
        basename(func, ".mcfunction")
      }`;

      fns[key].push(line);
    });
  });

  for (const materialPositionKey in fns) {
    const structureId = `${name}_${materialPositionKey}`;
    //fns[materialPositionKey] = `structure save ~ ~ ~ ~${size} ~${size} `

    addToBehaviorPack(
      join(DIR_FUNCTIONS, `${structureId}.mcfunction`),
      fns[materialPositionKey].join(EOL.CRLF),
    );
  }
}
