import blocks from "../db.json" assert { type: "json" };
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadImage, createCanvas } from "canvas"; // Use "canvas" for texture parsing

interface IBlock {
  version: number;
  id: string;
  states: Record<string, unknown>;
  hexColor: string;
  color: RGB;
}
type RGB = [number, number, number];
type Vector3 = [number, number, number];
type Face = { vertices: Vector3[]; uv: Vector3[] };
type Block = { x: number; y: number; z: number; type: string };
type PaletteSource = Record<string, string | IBlock>;
export const BLOCK_VERSION = 18153475;

/**
 * Converts database of colors to palette of block data.
 * @see {@link IBlock}
 * @param db Block ID/Color database.
 * @returns Array of blocks.
 */
export default function createPalette(db: PaletteSource): IBlock[] {
  const blockPalette: IBlock[] = [];

  for (const idx in db) {
    const block = db[idx];
    const [id, color, hexColor, states, version] =
      typeof block === "string"
        ? [idx, null, block, {}, BLOCK_VERSION]
        : [
            block.id,
            block.color ?? null,
            block.hexColor,
            block.states ?? {},
            block.version ?? BLOCK_VERSION,
          ];

    blockPalette.push({
      id,
      hexColor,
      color:
        color ?? ((hexColor ? hex2rgb(hexColor) : ([0, 0, 0] as RGB)) as RGB),
      states,
      version,
    });
  }

  return blockPalette;
}

/**
 * Calculate the distance between two RGB colors.
 * @param color1 RGB color to compare
 * @param color2 RGB color to compare
 * @returns Distance between the two colors
 */
export function colorDistance(color1: RGB, color2: RGB) {
  return Math.sqrt(
    (color1[0] - color2[0]) ** 2 +
      (color1[1] - color2[1]) ** 2 +
      (color1[2] - color2[2]) ** 2,
  );
}

/**
 * Attempt to find the nearest block to the given color.
 * @param color RGB color to compare
 * @param palette Array of blocks to compare against
 * @returns The block which is closest to the given color
 */
function getNearestColor(color: RGB, palette: IBlock[]): IBlock {
  // https://gist.github.com/Ademking/560d541e87043bfff0eb8470d3ef4894?permalink_comment_id=3720151#gistcomment-3720151
  return palette.reduce(
    (prev: [number, IBlock], curr: IBlock): [number, IBlock] => {
      const distance = colorDistance(color, curr.color.slice(0, 3) as RGB);

      return distance < prev[0] ? [distance, curr] : prev;
    },
    [Number.POSITIVE_INFINITY, palette[0]] as [number, IBlock],
  )[1];
}

export function hex2rgb(hex: string): RGB {
  return hex.match(/[^#]{1,2}/g)?.map((x) => Number.parseInt(x, 16)) as RGB;
}

export function rgb2hex(rgb: RGB): string {
  return `#${rgb[0].toString(16).padStart(2, "0")}${rgb[1]
    .toString(16)
    .padStart(2, "0")}${rgb[2].toString(16).padStart(2, "0")}`;
}

/**
 * Get a string representation of RGB values for use as object keys
 * @param rgb RGB color array
 * @returns String in format "r,g,b"
 */
function rgbToString(rgb: RGB): string {
  return rgb.join(",");
}

const COLOR_TO_BLOCK: Record<string, string> = {};

async function getBlockFromTexture(
  uv: Vector3,
  texturePath: string,
): Promise<string> {
  const image = await loadImage(texturePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const [u, v] = uv;

  // Calculate pixel coordinates from UV coordinates
  const x = Math.floor(u * image.width);
  const y = Math.floor((1 - v) * image.height);

  // Get pixel data
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const rgb: RGB = [pixel[0], pixel[1], pixel[2]];

  // Get the nearest block for this color using our palette
  const blockPalette = createPalette(blocks);
  return getNearestColor(rgb, blockPalette).id;
}

async function parseMTL(mtlPath: string): Promise<string> {
  const mtlContent = await fs.readFile(mtlPath, "utf-8");
  const lines = mtlContent.split("\n");
  let texturePath = "";
  for (const line of lines) {
    if (line.startsWith("map_Kd ")) {
      texturePath = line.split(" ")[1];
    }
  }
  return texturePath;
}

async function parseOBJ(
  objPath: string,
): Promise<{ faces: Face[]; texturePath: string }> {
  const objContent = await fs.readFile(objPath, "utf-8");
  const lines = objContent.split("\n");
  const vertices: Vector3[] = [];
  const uvs: Vector3[] = [];
  const faces: Face[] = [];
  let texturePath = "";

  // Parse vertices, UVs, and faces
  for (const line of lines) {
    if (line.startsWith("v ")) {
      const [, x, y, z] = line.split(" ").map(parseFloat);
      vertices.push([x, y, z]);
    } else if (line.startsWith("vt ")) {
      const [, u, v] = line.split(" ").map(parseFloat);
      uvs.push([u, v, 0]);
    } else if (line.startsWith("f ")) {
      const faceData = line.split(" ").slice(1);
      const faceVertices: Vector3[] = [];
      const faceUVs: Vector3[] = [];
      for (const part of faceData) {
        const [vi, ti] = part.split("/").map(Number);
        faceVertices.push(vertices[vi - 1]);
        faceUVs.push(uvs[ti - 1]);
      }
      faces.push({ vertices: faceVertices, uv: faceUVs });
    } else if (line.startsWith("mtllib ")) {
      const mtlPath = line.split(" ")[1];
      const mtlDir = path.dirname(objPath);

      try {
        texturePath = await parseMTL(`${mtlDir}/${mtlPath}`);
      } catch (e) {
        console.error(`Error parsing MTL file: ${e}`);
        process.exit(1);
      }
    }
  }

  return { faces, texturePath: `${path.dirname(objPath)}/${texturePath}` };
}

async function voxelize(faces: Face[], texturePath: string): Promise<Block[]> {
  const blocks: Block[] = [];

  for (const face of faces) {
    const [v1, v2, v3] = face.vertices;
    const [uv1, uv2, uv3] = face.uv;

    const minX = Math.floor(Math.min(v1[0], v2[0], v3[0]));
    const minY = Math.floor(Math.min(v1[1], v2[1], v3[1]));
    const minZ = Math.floor(Math.min(v1[2], v2[2], v3[2]));
    const maxX = Math.ceil(Math.max(v1[0], v2[0], v3[0]));
    const maxY = Math.ceil(Math.max(v1[1], v2[1], v3[1]));
    const maxZ = Math.ceil(Math.max(v1[2], v2[2], v3[2]));

    // Process each voxel position
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          // Calculate barycentric coordinates to determine if point is in triangle
          // and to interpolate the UV coordinates correctly
          const area =
            0.5 *
            Math.abs(
              (v2[0] - v1[0]) * (v3[1] - v1[1]) -
                (v3[0] - v1[0]) * (v2[1] - v1[1]),
            );

          if (area === 0) continue; // Skip degenerate triangles

          const alpha =
            Math.abs((v2[0] - x) * (v3[1] - y) - (v3[0] - x) * (v2[1] - y)) /
            (2 * area);

          const beta =
            Math.abs((v3[0] - x) * (v1[1] - y) - (v1[0] - x) * (v3[1] - y)) /
            (2 * area);

          const gamma = 1 - alpha - beta;

          // Check if the point is inside the triangle using barycentric coordinates
          if (
            alpha >= 0 &&
            beta >= 0 &&
            gamma >= 0 &&
            alpha <= 1 &&
            beta <= 1 &&
            gamma <= 1
          ) {
            // Interpolate UV coordinates using barycentric coordinates
            const u = alpha * uv1[0] + beta * uv2[0] + gamma * uv3[0];
            const v = alpha * uv1[1] + beta * uv2[1] + gamma * uv3[1];

            // Get block type based on the interpolated UV coordinates
            const blockType = await getBlockFromTexture([u, v, 0], texturePath);
            blocks.push({ x, y, z, type: blockType });
          }
        }
      }
    }
  }

  return blocks;
}

// Convert each block's color hex to RGB and map it to the block name
for (const [blockName, hexColor] of Object.entries(blocks)) {
  const rgbColor = rgbToString(hex2rgb(hexColor as string));
  COLOR_TO_BLOCK[rgbColor] = blockName;
}

const MC_WORLD = "mineways";
console.log(`Minecraft world: [${MC_WORLD}]`);

//console.log(`Change blocks: from 0-255 to "${block}" at ${fromLoc} to ${toLoc}`);

function generateMWScript(blocks: Block[]): string {
  return blocks
    .map(
      (b) =>
        `Change blocks: from 0-255 to "${b.type}" at ${b.x},${b.y},${b.z} to ${b.x},${b.y},${b.z}`,
    )
    .join("\n");
}

/**
 * Processes an image file and converts it to blocks at 1:1 pixel scale
 * @param imagePath Path to the image file
 * @returns Array of blocks representing the image
 */
async function processImage(imagePath: string): Promise<Block[]> {
  const imageBlocks: Block[] = [];

  try {
    // Load the image using canvas
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    // Get image data - every pixel
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    console.log(`Processing image: ${image.width}x${image.height} pixels`);

    // Create a palette once to avoid recreation for every pixel
    const blockPalette = createPalette(blocks);
    console.log(`Created block palette with ${blockPalette.length} blocks`);

    // For debugging: log some palette entries
    if (blockPalette.length > 0) {
      console.log(`First 3 palette entries:`);
      for (let i = 0; i < Math.min(3, blockPalette.length); i++) {
        console.log(
          `${i}. Block: ${blockPalette[i].id}, Color: RGB(${blockPalette[i].color.join(",")})`,
        );
      }
    }

    // Process each pixel, converting to a block
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const idx = (y * image.width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        // Skip fully transparent pixels
        if (a < 128) continue;

        // Get the nearest block for this color
        const rgb: RGB = [r, g, b];
        const blockMatch = getNearestColor(rgb, blockPalette);

        // Log every 1000th pixel for debugging
        if ((y * image.width + x) % 1000 === 0) {
          console.log(
            `Pixel at ${x},${y}: RGB(${rgb.join(",")}) → Block: ${blockMatch.id}`,
          );
        }

        // Add block at the x,z plane (y is height in Minecraft)
        imageBlocks.push({ x, y: 0, z: y, type: blockMatch.id });
      }
    }

    // Count unique block types used
    const blockTypes = new Set(imageBlocks.map((b) => b.type));
    console.log(
      `Used ${blockTypes.size} different block types out of ${blockPalette.length} available`,
    );

    return imageBlocks;
  } catch (error) {
    console.error(`Error processing image: ${error}`);
    process.exit(1);
  }
}

// Main Execution
// Parse command line arguments
const inputPath = process.argv[2];
if (!inputPath) {
  console.error(
    "Error: Please provide the path to an OBJ or image file as an argument.",
  );
  process.exit(1);
}

// Determine file type from extension
const fileExt = path.extname(inputPath).toLowerCase();
let srcBlocks: Block[] = [];
let mwscript = "";

console.log(`Processing file: ${inputPath}`);

try {
  if (fileExt === ".obj") {
    // Original OBJ processing
    const { faces, texturePath } = await parseOBJ(inputPath);
    srcBlocks = await voxelize(faces, texturePath);
  } else if ([".png", ".jpg", ".jpeg", ".bmp", ".gif"].includes(fileExt)) {
    // New image processing
    srcBlocks = await processImage(inputPath);
    console.log(`Generated ${srcBlocks.length} blocks from image`);
  } else {
    console.error(
      `Unsupported file type: ${fileExt}. Please use .obj, .png, .jpg, .jpeg, .bmp, or .gif files.`,
    );
    process.exit(1);
  }

  // Generate and save the mwscript
  mwscript = generateMWScript(srcBlocks);
  const outputFile = `output${fileExt.replace(".", "_")}.mwscript`;
  await fs.writeFile(outputFile, mwscript);
  console.log(`Script saved to ${outputFile}`);
} catch (error) {
  console.error(`Error during processing: ${error}`);
  process.exit(1);
}
