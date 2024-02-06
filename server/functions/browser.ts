import type { Axis, WssParams } from "../../types/index.ts";
import { Image } from "imagescript/mod.ts";
import { convertImage } from "../../src/components/ImagePrinter.ts";
import assemble from "../../src/components/_assemble.ts";




export default async function stableDiffusion(
  { parameters, queueCommandRequest }: WssParams,
) {
  const url = parameters.get("url") ?? "https://minecraft.net";
  const material = parameters.get("material") ?? "plastic";
  const axis = parameters.get("axis") ?? "y";
  const position = parameters.get("position") ?? "0 0 0";
  const useAbsolutePosition = parameters.get("absolute") === "true";
  const [x, y, z] = position.split(" ").map((v) => parseInt(v, 10));
  console.group("Astral request");



  console.log("Position %s %s %s:", x, y, z);
  // Open a new page


  const resized = decoded.resize(256, Image.RESIZE_AUTO);
  const blockLibrary = assemble().filter((b) =>
    b.behaviorId.includes(material)
  );

  const commands: string[] = [];

  console.log("converting image");

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

  console.log("commands sent");

  console.groupEnd();
}
