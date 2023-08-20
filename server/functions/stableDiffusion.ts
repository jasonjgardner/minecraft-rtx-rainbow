import type { Axis, WssParams } from "../../types/index.ts";
import { Image } from "imagescript/mod.ts";
import { convertImage } from "../../src/components/ImagePrinter.ts";
import assemble from "../../src/components/_assemble.ts";
import { join } from "path/mod.ts";
import { SDHelper } from "https://deno.land/x/stable_diffusion_client@0.0.3/mod.ts";

const helper = new SDHelper("http://127.0.0.1:7860");

export default async function stableDiffusion(
  { parameters, queueCommandRequest }: WssParams,
) {
  const material = parameters.get("material") ?? "plastic";
  const prompt = parameters.get("prompt") ?? "A unicorn in space";
  const axis = parameters.get("axis") ?? "y";
  const position = parameters.get("position") ?? "0 0 0";
  const useAbsolutePosition = parameters.get("absolute") === "true";
  const [x, y, z] = position.split(" ").map((v) => parseInt(v, 10));
  console.group("Stable Diffusion request");
  console.log("Prompt:", prompt);

  const batch = await helper.txt2img({
    prompt,
    steps: Number(parameters.get("steps") ?? 30),
    batch_size: 1,
    width: 256,
    height: 256,
    cfg_scale: Number(parameters.get("cfg_scale") ?? 7),
    sampler_name: parameters.get("sampler") ?? "Euler a",
  });

  if (batch.images === undefined) {
    console.log("No images returned");
    return;
  }

  const image = batch.images[0];
  const decoded = await Image.decode(image);

  const resized = decoded.resize(128, 128);
  const blockLibrary = assemble().filter((b) =>
    b.behaviorId.includes(material)
  );

  const commands: string[] = [];

  commands.push(
    ...convertImage(
      resized,
      blockLibrary,
      [x, y, z],
      <Axis> axis,
      useAbsolutePosition === true,
    ),
  );

  commands.map((c) => queueCommandRequest(c));

  console.groupEnd();
}
