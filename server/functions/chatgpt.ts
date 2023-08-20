import { load } from "https://deno.land/std@0.184.0/dotenv/mod.ts";
import openai from "npm:openai@^3.2.1";
import { sprintf } from "fmt/printf.ts";
import type { WssParams } from "../../types/index.ts";

const { Configuration, OpenAIApi } = openai;

const env = await load();
const OPENAI_API_KEY = env.OPENAI_API_KEY || Deno.env.get("OPENAI_API_KEY") ||
  "";

const getRandomPrompt = (system: string) => {
  let prompts: string[] = [];

  if (system === "navigate") {
    prompts = [
      "Move forward 10 steps, then turn left and move forward 5 steps. Move up 20 steps then turn left. Move forward 10 steps.",
      "Move forward 100 steps in any direction.",
      "Move left any number of steps, then move forward 10 steps.",
      "Move diagonally forward 10 steps, while moving up 5 steps.",
    ];
  } else if (system === "commandBlock") {
    prompts = [
      "Summon a zombie",
      "Play a prank on nearby players",
      "Teleport a player to a random location",
    ];
  }

  return prompts[Math.floor(Math.random() * prompts.length)];
};

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const client = new OpenAIApi(configuration);

async function commandBlockBot(prompt: string) {
  const completion = await client.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: [
          "Act as a Minecraft Bedrock add-on creator.",
          "You will be asked to create commands and structures in Minecraft.",
          "Provide responses in the form of a Minecraft command.",
          "Do not include NBT data.",
          "Reply with the solutions only, no explanations.",
        ].join("\n"),
      },
      { role: "user", name: "Minecraft", content: prompt },
    ],
    temperature: 0.1,
    n: 1,
    max_tokens: 1024,
  });

  const completionCommands =
    (completion.data.choices[0].message?.content?.split("\n") ?? []).map((c) =>
      c.replace(/\//, "").trim()
    ).filter((c) => c.length > 2);

  console.group("ChatGPT response");
  console.log(completionCommands);
  console.groupEnd();

  return completionCommands;
}

async function navigatorBot(prompt: string, block?: string) {
  let stepFormat = "tp @s %d %d %d";

  if (block) {
    stepFormat = `setblock %d %d %d ${block}`;
  }

  const completion = await client.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: [
          'You are a player in a 3D world. Navigate around the world using X, Y, and Z coordinates. Respond with your position in the world in the form of "X Y Z".',
          "Do not include any additional text. I will tell you a start position and where to go.",
          "Then report your coordinates. Output the position from every time you move with one line per step.",
        ].join("\n"),
      },
      { role: "user", name: "Minecraft", content: prompt },
    ],
    temperature: 0.1,
    n: 1,
    max_tokens: 1024,
  });

  const completionCommands =
    (completion.data.choices[0].message?.content?.split("\n") ?? []).map((c) =>
      c.replace(/\//, "").trim()
    ).filter((c) => c.length > 2);

  console.group("ChatGPT response");
  console.log(completionCommands);
  console.groupEnd();

  return completionCommands.map((c) => {
    const [x, y, z] = c.split(" ").map((v) => parseInt(v, 10));
    return sprintf(stepFormat, x, y, z);
  });
}

export default async function chatgpt(
  { parameters, queueCommandRequest }: WssParams,
) {
  const system = parameters.get("system") ?? "commandBlock";
  const prompt = parameters.get("prompt") ?? getRandomPrompt(system);

  const commands: string[] = system === "navigate"
    ? await navigatorBot(prompt, parameters.get("block") ?? "cobblestone")
    : await commandBlockBot(prompt);

  commands.map((c) => queueCommandRequest(c));
}
