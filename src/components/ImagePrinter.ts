import type { Axis } from "../../typings/types.ts";
import { type Frame, GIF, Image } from "imagescript/mod.ts";
import { extname, join } from "path/mod.ts";
import { sprintf } from "fmt/printf.ts";
import { EOL } from "fs/mod.ts";
import { materials } from "../store/_materials.ts";
import BlockEntry from "./BlockEntry.ts";
import { BLOCK_VERSION, DIR_BP } from "../store/_config.ts";
import { hex2rgb } from "https://crux.land/3RdawE";
//import { encode, Int } from "https://deno.land/x/nbtrex@1.3.0/mod.ts";
//import { encode, Int, stringify } from "npm:nbt-ts@1.3.5";
// import * as nbt from "npm:prismarine-nbt@2.2.1";
import type { IMaterial, RGB } from "../../typings/types.ts";

const MAX_PRINT_SIZE = 3 * 16;
const MASK_COLOR = [
  Image.rgbaToColor(255, 255, 255, 0),
  Image.rgbaToColor(0, 0, 0, 0),
]; // Image.rgbToColor(...hex2rgb("#ff00ff"));
const FUNCTIONS_NAMESPACE = "printer";
const DIR_FUNCTIONS = join(DIR_BP, "functions", FUNCTIONS_NAMESPACE);
const DIR_STRUCTURES = join(DIR_BP, "structures");

function colorDistance(color1: RGB, color2: RGB) {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) + Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2),
  );
}

// export function createStructureTag() {
//   const block_palette: Array<CompoundTag> = [];
//   return {
//     format_version: new Int(1),
//     size: [1, 1, 1] as ListTag<IntTag>,
//     structure_world_origin: [0, 0, 0] as ListTag<IntTag>,
//     structure: {
//       block_indices: [[0, 0, 0], [
//         -1,
//         -1,
//         -1,
//       ]] as ListTag<ListTag<IntTag>>,
//       entities: [] as ListTag<CompoundTag>,
//       palette: {
//         default: {
//           block_palette,
//           block_position_data: {},
//         },
//       },
//     },
//   };
// }

// function placeBlock(name: string, version = 17825806) {
//   return
// }

export async function constructDecoded(
  name: string,
  frames: GIF | Array<Image | Frame>,
  palette: BlockEntry[],
) {
  const frameCount = frames.length;
  const positionData = [];
  const layer = [];
  const waterLayer = [];
  let idx = 0;

  let xDim = 0;
  let yDim = 0;

  const blockPalette = [];

  for (let z = 0; z < frameCount; z++) {
    const img = frames[z];

    for (const [x, y, c] of img.iterateWithColors()) {
      const nearest =
        getNearestColor(<RGB> Image.colorToRGB(c), palette)?.behaviorId ??
          "minecraft:cobblestone";
      layer.push(z, Math.abs(y - img.height), x);
      waterLayer.push(-1, -1, -1);

      blockPalette.push(
        {
          version: BLOCK_VERSION,
          name: nearest,
          //states: nbt.comp({}),
        },
      );

      positionData.push([idx, {
        block_entity_data: {},
      }]);

      xDim = Math.max(xDim, x);
      yDim = Math.max(yDim, y);
      idx++;
    }
  }

  const tag = {
    format_version: 1,
    size: [
      xDim,
      yDim,
      frameCount,
    ],
    structure_world_origin: [0, 0, 0],
    structure: {
      block_indices: [layer, waterLayer],
      //entities: nbt.list([]),
      palette: {
        default: {
          block_palette: blockPalette,
          block_position_data: Object
            .fromEntries(
              positionData,
            ),
        },
      },
    },
  };

  const encoder = new TextEncoder();
  const enc = encoder.encode(JSON.stringify(tag));

  await Deno.writeFile(
    join(
      DIR_STRUCTURES,
      `${name}.mcstructure`,
    ),
    new Uint8Array(new Uint16Array(enc).buffer),
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

export function convertImage(
  img: Image | Frame,
  palette: BlockEntry[],
  offset: number[],
  axis: Axis = "z",
  absolutePosition = false,
): string[] {
  const func: string[] = [];

  for (const [x, y, c] of img.iterateWithColors()) {
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
              ?.behaviorId ?? "cobblestone";

          func.push(
            writeFill(
              Math.abs((x + offset[0]) - img.width), // Starts print column at left
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

export async function decodeUrl({ href }: URL): Promise<GIF | Image[]> {
  const res = await fetch(href);
  const data = new Uint8Array(await res.arrayBuffer());

  return (extname(href) !== ".gif")
    ? [await Image.decode(data)]
    : (await GIF.decode(data, false));
}

/**
 * @deprecated
 */
export async function pixelPrinter(
  name: string,
  imageUrl: URL,
  palette: BlockEntry[],
  chunks = 2,
) {
  const frames = await decodeUrl(imageUrl);

  const size = Math.min(MAX_PRINT_SIZE, chunks * 16);

  let fnNames: Array<string | undefined> = [];
  let idx = 0;
  const results = [];

  for await (const frame of frames) {
    if (frame.width > size) {
      frame.resize(size, Image.RESIZE_AUTO, Image.RESIZE_NEAREST_NEIGHBOR);
    }

    // Align frames end-to-end
    //const offsets = [(idx * frame.width) + 1, 0, idx + 1];

    // Align frames as stack
    const offsets = [0, 0, idx];

    results.push(
      await printDecoded(
        name,
        idx,
        frame,
        palette,
        offsets,
      ),
    );
    idx++;
  }

  fnNames = results.flat(2);

  return fnNames;
}
