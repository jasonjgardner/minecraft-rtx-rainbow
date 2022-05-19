import type Material from "/src/components/Material.ts";
import type { Alignment, Axis, RGB, RGBA } from "/typings/types.ts";
import { Frame, GIF, Image } from "imagescript/mod.ts";
import { basename } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
import {
  CHUNK_SIZE,
  DEFAULT_PRINT_BLOCK,
  DEFAULT_PRINT_CHUNKS,
  FUNCTIONS_NAMESPACE,
  MAX_FRAMES,
  MAX_FUNCTION_LINES,
  MAX_PRINT_SIZE,
  TRANSPARENT_PRINT_BLOCK,
  TRANSPARENT_PRINT_BLOCK_THRESHOLD,
} from "/typings/constants.ts";
import BlockEntry from "/src/components/BlockEntry.ts";
import { addToBehaviorPack } from "/src/components/_state.ts";
import { rgbaMatch } from "/src/_utils.ts";

const axises: [Axis, Axis, Axis] = ["x", "y", "z"];
const DIR_FUNCTIONS = `functions/${FUNCTIONS_NAMESPACE}`;

interface PrinterResult {
  label: string;
  axis: Axis;
  func: string;
}

const hasTransparency = ({ color: { rgba } }: BlockEntry) =>
  rgba[3] < 1 && rgba[3] >= TRANSPARENT_PRINT_BLOCK_THRESHOLD;

function colorDistance(color1: RGB, color2: RGB) {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) + Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2),
  );
}

export function getNearestColor(
  color: RGB | RGBA,
  palette: BlockEntry[],
): BlockEntry {
  const rgbColor: RGB = [color[0] || 0, color[1] || 0, color[2] || 0];
  const alpha = Math.floor((color[3] || 0) / 255);

  const materialPalette = (alpha >= 1)
    ? palette
    : palette.filter(({ color: { rgba } }: BlockEntry) => rgba[3] / 255 < 1); // Restrict palette to blocks with transparency

  // https://gist.github.com/Ademking/560d541e87043bfff0eb8470d3ef4894?permalink_comment_id=3720151#gistcomment-3720151
  return materialPalette.reduce(
    (prev: [number, BlockEntry], curr: BlockEntry): [number, BlockEntry] => {
      const distance = colorDistance(
        rgbColor,
        <RGB> curr.color.rgba.slice(0, 2),
      );

      return (distance < prev[0]) ? [distance, curr] : prev;
    },
    [Number.POSITIVE_INFINITY, palette[0]],
  )[1];
}

function writeFill(
  x: number,
  y: number,
  z: number,
  fillWith?: string,
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
  return `fill ${position} ${position} ${
    fillWith ?? TRANSPARENT_PRINT_BLOCK
  } 0 keep`;
}

function printDecoded(
  name: string,
  img: Image | Frame,
  palette: BlockEntry[],
  offset: number[],
  dest: string,
) {
  const transparencyPalette = palette.filter((b) => hasTransparency(b));

  let maxLines = MAX_FUNCTION_LINES;

  const materials = palette.map(({ material }) => material);

  return materials.flatMap(({ label }: Material) => {
    if (maxLines <= 0) {
      throw Error(sprintf("Function %s has exceeded max length", name));
    }

    const materialPalette = palette.filter((entry: BlockEntry) =>
      label === entry.material.label || hasTransparency(entry) // Always include transparency to allow printing semi-opaque pixels
    );

    return axises.map((axis): PrinterResult => {
      const func: string[] = [];

      for (const [x, y, c] of img.iterateWithColors()) {
        const rgba = <RGBA> Image.colorToRGBA(c);
        const alpha = transparencyPalette.length > 0 ? rgba[3] / 255 : 1;

        const exact = materialPalette.filter(({ color: { rgba: _rgba } }) =>
          rgbaMatch([rgba[0], rgba[1], rgba[2], alpha], _rgba)
        );

        const nearest = exact
          ? exact[0]?.behaviorId
          : alpha < TRANSPARENT_PRINT_BLOCK_THRESHOLD // Minimum alpha of 50%
          ? TRANSPARENT_PRINT_BLOCK
          : getNearestColor(rgba, materialPalette)?.behaviorId ||
            DEFAULT_PRINT_BLOCK;

        func.push(
          writeFill(
            Math.abs((x + offset[0]) - img.width), // Flip artwork face
            Math.abs((y + offset[1]) - img.height), // Starts print row at top
            offset[2],
            nearest,
            axis,
          ),
        );
      }

      const filename = sprintf("%s_%s_%s.mcfunction", name, label, axis);
      const filePath = `${dest}/${filename}`;

      addToBehaviorPack(
        filePath,
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
): [number, number, number] {
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

export async function pixelPrinter(
  name: string,
  imageData: Image | GIF,
  palette: BlockEntry[],
  options: {
    alignment?: Alignment;
    chunks?: number;
  },
) {
  const frames = Array.isArray(imageData) ? imageData : [imageData];
  const size = Math.min(
    MAX_PRINT_SIZE,
    (options.chunks ?? DEFAULT_PRINT_CHUNKS) * CHUNK_SIZE,
  );
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
      dest += `/${name}`;
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

      const line = sprintf(
        "function %s/%s/%s",
        FUNCTIONS_NAMESPACE,
        name,
        basename(func, ".mcfunction"),
      );

      fns[key].push(line);
    });
  });

  for (const materialPositionKey in fns) {
    const structureId = `${name}_${materialPositionKey}`;
    //fns[materialPositionKey] = `structure save ~ ~ ~ ~${size} ~${size} `

    addToBehaviorPack(
      `${DIR_FUNCTIONS}/${structureId}.mcfunction`,
      fns[materialPositionKey].join(EOL.CRLF),
    );
  }
}
