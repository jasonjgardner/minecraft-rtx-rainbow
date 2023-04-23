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

const SYSTEM_PROMPT = "Act as a Minecraft Bedrock add-on creator. " +
  "You will be asked to create commands, functions, and structures for a Minecraft Bedrock Edition add-on. " +
  "You will provide responses in the form of a Minecraft command. " +
  "Reply with the solutions only, no explanations.";
const getRandomPrompt = () => {
  const prompts = [
    "Summon a zombie",
    "Play a prank on nearby players",
    "Teleport a player to a random location",
  ];

  return prompts[Math.floor(Math.random() * prompts.length)];
};

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const client = new OpenAIApi(configuration);

export default async function chatgpt(
  { parameters, queueCommandRequest }: WssParams,
) {
  const prompt = parameters.get("prompt") ?? getRandomPrompt();

  const completion = await client.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", name: "Minecraft", content: prompt },
    ],
    temperature: 0.3,
    n: 1,
  });

  const completionCommands =
    (completion.data.choices[0].message?.content?.split("\n") ?? []).map((c) =>
      c.replace(/^\//, "").trim()
    ).filter((c) => c.length > 0);

  console.group("ChatGPT response");
  console.log(completionCommands);
  console.groupEnd();

  const commands: string[] = [];

  commands.push(
    ...completionCommands,
  );

  commands.map((c) => queueCommandRequest(c));
}
