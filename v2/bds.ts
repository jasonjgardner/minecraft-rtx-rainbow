import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
import { Image, decode, GIF } from "imagescript/mod.ts";
import { convertImage } from "./src/components/ImagePrinter.ts";
import assemble from "./src/components/_assemble.ts";
import openai from "npm:openai@^3.2.1";
import { Axis } from "./types/index.ts";

const { Configuration, OpenAIApi } = openai;

const env = await load();
const OPENAI_API_KEY = env.OPENAI_API_KEY || Deno.env.get("OPENAI_API_KEY") ||
  "";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const client = new OpenAIApi(configuration);

const colorList = [
    "yellow",
    "amber",
    "orange",
    "deep_orange",
    "red",
    "pink",
    "purple",
    "deep_purple",
    "indigo",
    "blue",
    "light_blue",
    "cyan",
    "teal",
    "light_green",
    "green",
    "lime",
  ];

  let lastColor = 0;
let lastFrame = 0;
let lastMaterialIdx = 0;

  const material = ["glass","negative", "glowing", "metallic"];
  // const imageRes = await fetch(
  //   "https://raw.githubusercontent.com/jasonjgardner/minecraft-rtx-rainbow/main/src/assets/pixel_art/chest.png",
  // );
  // const imageData = await imageRes.arrayBuffer();
const imageData = await Deno.readFile("./src/assets/pixel_art/big.jpeg")
  // const decoded = await decode(imageData, false) as GIF;

const mask = (await Image.decode(await Deno.readFile("./src/assets/mask/tunnel_mask.png"))).invert();
const depth = (await Image.decode(await Deno.readFile("./src/assets/mask/poly_depth.png")));
const axises = ["x", "y", "z"];

async function printImage() {
    const blockLibrary = assemble(["glass_pane", "brick_lit"]).filter((b) =>
    b.behaviorId.includes(material[lastMaterialIdx])
  );

  const commands: string[] = [];

  // if (lastFrame >= decoded.length) {
  //   lastFrame = 0;
  // }

  if (lastMaterialIdx >= material.length) {
    lastMaterialIdx = 0;
  }

  commands.push(
    ...convertImage(
      // decoded[lastFrame].resize(72, Image.RESIZE_AUTO),
      (await decode(imageData, false)).resize(64, Image.RESIZE_AUTO) as Image,
      blockLibrary,
      [0, 0, 20],
      axises[lastFrame % 3] as Axis,
      undefined,
      mask,
    ),
  );

    lastFrame += 1;
    lastMaterialIdx += 1;

  return commands;
}

const app = new Application();

function getBlockName(color: string, material: string, level = 50, tint = 500) {
  return `rainbow:${color}_${tint}_${material}_${level}`;
}

function getBlocks(tint = 500) {
  const colors = [
    "yellow",
    "amber",
    "orange",
    "deep_orange",
    "red",
    "pink",
    "purple",
    "deep_purple",
    "indigo",
    "blue",
    "light_blue",
    "cyan",
    "teal",
    "light_green",
    "green",
    "lime",
  ];

  const materials = ["glowing"];
  const levels = [25];

  const blockList = [];

  for (const color of colors) {
    for (const material of materials) {
      for (const level of levels) {
        blockList.push(getBlockName(color, material, level, tint));
      }
    }
  }

  return blockList;
}

let cameraVector = [10, 20, 10];

app.use(async (ctx) => {
  if (ctx.request.method !== "GET") {

    console.log(ctx.request)
  }

  ctx.response.headers.set("Content-Type", "text/plain");

  if (lastColor >= colorList.length) {
    lastColor = 0;
  }

  if (lastMaterialIdx >= material.length) {
    lastMaterialIdx = 0;
  }

    const lines = [
      // ...await printImage(),
      // '/setblock ~ ~9 ~ redstone_block',
      // '/setblock ~ ~10 ~ tnt',
      `/setblock ~ ~-1 ~ ${getBlockName(colorList[lastColor], material[lastMaterialIdx], 50, 500)}`,
      `/execute at @e[type=!player] as @e[r=5] at @s run setblock ~ ~-1 ~ ${getBlockName(colorList[lastColor], material[lastMaterialIdx], 50, 800)}`,
      `/execute at @e[type=!player] as @e[r=5] at @s run fill ~-4 ~-1 ~3 ~4 ~-1 ~5 ${getBlockName(colorList[lastColor], material[lastMaterialIdx], 50, 200)}`,
    ]

    
    // Update camera vector to move camera in circle around player
    // cameraVector = [
    //     Math.sin(Date.now() / 1000) * 5,
    //     Math.sin(Date.now() / 1000) * 5,
    //     Math.cos(Date.now() / 1000) * 5,
    // ]

    lastColor += 1;
    lastMaterialIdx += 1;

  ctx.response.body = JSON.stringify({ command: lines.join(";"), target: "eljaysun", tick: 5 });
});

await app.listen({ port: 8000 });
