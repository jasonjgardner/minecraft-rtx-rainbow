import type { Axis } from "../../types/index.ts";
import { type Frame, GIF, Image } from "imagescript/mod.ts";
import { extname, join } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
import { materials } from "../store/_materials.ts";
import BlockEntry from "./BlockEntry.ts";
import { BLOCK_VERSION, DIR_BP } from "../store/_config.ts";
import { hex2rgb } from "https://crux.land/api/get/3RdawE.ts";
import * as NBT from "nbtify";
import type { RGB } from "../../types/index.ts";
import { image } from "deno_markdown/mod.ts";

const MAX_PRINT_SIZE = 3 * 16;
const MASK_COLOR = [
  Image.rgbaToColor(255, 255, 255, 0),
  Image.rgbaToColor(0, 0, 0, 0),
]; // Image.rgbToColor(...hex2rgb("#ff00ff"));
const FUNCTIONS_NAMESPACE = "printer";

const DIR_STRUCTURES = join(DIR_BP, "structures");

function colorDistance(color1: RGB, color2: RGB) {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) + Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2),
  );
}

/**
 * Convert GIF / Image to .mcstructure file
 * @param name - Name of .mcstructure file and structure itself
 * @param frames - The GIF or image source as an array
 * @param palette - The list of blocks permitted to be used in the structure
 */
export async function constructDecoded(
  name: string,
  frames: GIF | Array<Image | Frame>,
  palette: BlockEntry[],
) {
  const frameCount = frames.length;

  /**
   * Block indices primary layer
   */
  const layer: number[] = [];

  /**
   * Block palette
   */
  const blockPalette: Array<{
    version: number;
    name: string;
    states: Record<string, unknown>;
  }> = [];

  /**
   * Block position data. First element is the position index. Second element is the block entity data.
   */
  const positionData: Array<
    [number, Record<string, Record<string, number | string>>]
  > = [];

  /**
   * Structure size (X, Y, Z)
   */
  const size: [number, number, number] = [
    frames[0].width,
    frames[0].height,
    frameCount,
  ];

  let idx = 0;

  for (let z = 0; z < frameCount; z++) {
    const img = frames[z];

    for (const [x, y, c] of img.iterateWithColors()) {
      const nearest =
        getNearestColor(<RGB> Image.colorToRGB(c), palette)?.behaviorId ??
          "minecraft:cobblestone";

      let blockIdx = blockPalette.findIndex(({ name }) => name === nearest);

      if (blockIdx === -1) {
        blockIdx = blockPalette.push(
          {
            version: BLOCK_VERSION,
            name: nearest,
            states: {},
          },
        ) - 1;
      }

      layer.push(blockIdx);

      positionData.push([idx++, {
        block_entity_data: {},
      }]);
    }
  }
  const waterLayer = Array.from({ length: layer.length }, () => -1);

  const tag = {
    format_version: 1,
    size,
    structure_world_origin: [0, 0, 0],
    structure: {
      block_indices: [layer, waterLayer],
      entities: [],
      palette: {
        default: {
          block_palette: blockPalette,
          block_position_data: {},
          // block_position_data: Object
          //   .fromEntries(
          //     positionData,
          //   ),
        },
      },
    },
  };

  const nbtBuffer = await NBT.write(NBT.parse(JSON.stringify(tag)), {
    name: name.replace(/[\s\/]/g, "_").toLowerCase(),
    endian: "little",
    compression: null,
    bedrockLevel: null,
  });

  await Deno.writeFile(
    join(
      DIR_STRUCTURES,
      `${name}.mcstructure`,
    ),
    nbtBuffer,
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
  return `fill ${position} ${position} ${fillWith}`;
}

/**
 * @deprecated
 */
export async function decode(
  src: URL,
  palette: BlockEntry[],
  offset: number[],
  axis: Axis = "z",
  absolutePosition = false,
  resize?: number,
): Promise<string[]> {
  // TODO: Add 10000 line limit
  const img = (await decodeUrl(src))[0];

  if (resize) {
    img.resize(resize, resize);
  }

  return convertImage(img, palette, offset, axis, absolutePosition);
}

const isLightPixel = (c: RGB) => c[0] > 0.5 && c[1] > 0.5 && c[2] > 0.5;

const convertPixelDepth = (c: RGB, limit = 15): number => {
  limit = Math.max(1, Math.min(256, limit));
  const depth = c[0] * limit;
  return Math.max(0, Math.min(limit, Math.round(depth)));
};

export function convertImage(
  img: Image | Frame,
  palette: BlockEntry[],
  offset: number[],
  axis: Axis = "z",
  absolutePosition = false,
  mask?: Image,
  depthMap?: Image,
) {
  const func: string[] = [];

  for (const [x, y, c] of img.iterateWithColors()) {
    const rgba = Image.colorToRGBA(c);
    const maskPixel = rgba[3] < 0.5 ||
      (mask && isLightPixel(<RGB> Image.colorToRGB(mask.getPixelAt(x, y))));

    if (maskPixel) {
      continue;
    }

    const z = depthMap
      ? convertPixelDepth(<RGB> Image.colorToRGB(depthMap.getPixelAt(x, y)))
      : 0;

    const nearest =
      getNearestColor(<RGB> Image.colorToRGB(c), palette)?.behaviorId ??
        "cobblestone";

    if (absolutePosition) {
      func.push(
        `fill ${x + offset[0]} ${(img.height - y) + offset[1]} ${offset[2]} ${
          x + offset[0]
        } ${y + offset[1]} ${offset[2]} ${nearest} 0 keep`,
      );
      continue;
    }

    func.push(
      writeFill(
        Math.abs((x + offset[0]) - img.width), // Starts print column at left
        Math.abs((y + offset[1]) - img.height), // Starts print row at top
        z + offset[2],
        nearest,
        <Axis> axis,
      ),
    );
  }

  return func;
}

export async function decodeUrl({ href }: URL): Promise<GIF | Image[]> {
  const res = await fetch(href);
  const data = new Uint8Array(await res.arrayBuffer());

  return (extname(href) !== ".gif")
    ? [await Image.decode(data)]
    : (await GIF.decode(data, false));
}
