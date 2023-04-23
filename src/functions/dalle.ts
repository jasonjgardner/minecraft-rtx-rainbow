import { load } from "https://deno.land/std@0.184.0/dotenv/mod.ts";
import openai from "npm:openai@^3.2.1";
import { Image } from "imagescript/mod.ts";
import type { Axis, WssParams } from "../../typings/types.ts";
import { convertImage } from "../components/ImagePrinter.ts";
import assemble from "../components/_assemble.ts";
import { join } from "path/mod.ts";

const { Configuration, OpenAIApi } = openai;

const env = await load();
const OPENAI_API_KEY = env.OPENAI_API_KEY || Deno.env.get("OPENAI_API_KEY") ||
  "";

const outputDir = join(Deno.cwd(), "out");

const getRandomPrompt = () => {
  const prompts = [
    "A unicorn in space",
    "A dog in a hat",
  ];

  return prompts[Math.floor(Math.random() * prompts.length)];
};

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const client = new OpenAIApi(configuration);

function getBlockLibrary(material: string, exclude?: string[]) {
  return assemble(exclude).filter((b) => b.behaviorId.includes(material));
}

export default async function dalle(
  { parameters, queueCommandRequest, formatPosition }: WssParams,
) {
  const axis = parameters.get("axis") ?? "y";
  const material = parameters.get("material") ?? "plastic";
  const exclude = (parameters.get("exclude") ?? "").split(",");
  const position = parameters.get("position") ?? "0 0 0";
  const useAbsolutePosition = parameters.get("absolute") === "true";
  const [x, y, z] = position.split(" ").map((v) => parseInt(v, 10));
  const prompt = parameters.get("prompt") ?? getRandomPrompt();
  const response = await client.createImage({
    prompt,
    n: 1,
    size: "256x256",
  });

  const imageUrl: string = response.data.data[0].url ?? "";
  const imageRes = await fetch(imageUrl);
  const imageData = await imageRes.arrayBuffer();
  const decoded = await Image.decode(imageData);

  try {
    await Deno.writeFile(
      join(outputDir, prompt.trim().replace(/[\s:\/\\#\$\?]+/gi, "-") + ".png"),
      new Uint8Array(imageData),
    );
  } catch (err) {
    console.warn(`Failed saving image from DALL-E: ${err}`);
  }

  const resized = decoded.resize(128, 128);

  const commands: string[] = [];

  commands.push(
    ...convertImage(
      resized,
      getBlockLibrary(material, exclude),
      [x, y, z],
      <Axis> axis,
      useAbsolutePosition === true,
    ),
  );

  commands.map((c) => queueCommandRequest(c));
}
