import * as clippy from "https://deno.land/x/clippy@v0.2.0/mod.ts";
import { readAll } from "https://deno.land/std@0.152.0/streams/conversion.ts";
import { convertImage, decode } from "../../src/components/ImagePrinter.ts";
import assemble from "../../src/components/_assemble.ts";
import type { Axis, WssParams } from "../../types/index.ts";
import { Image } from "imagescript/mod.ts";

function getBlockLibrary(material: string, exclude?: string[]) {
  return assemble(exclude).filter((b) => b.behaviorId.includes(material));
}
export default async function print(
  { parameters, queueCommandRequest }: WssParams,
) {
  const axis = parameters.get("axis") ?? "y";
  const material = parameters.get("material") ?? "plastic";
  const exclude = (parameters.get("exclude") ?? "").split(",");
  const position = parameters.get("position") ?? "0 0 0";
  const maxSize = parameters.get("size") ?? "128";
  const url = parameters.get("url") ?? null;
  const useAbsolutePosition = parameters.get("absolute") === "true";
  const [x, y, z] = position.split(" ").map((v) => parseInt(v, 10));

  const commands: string[] = [];

  if (!url) {
    try {
      const r = await clippy.read_image();
      const data = await readAll(r);
      const img = await Image.decode(data);
      commands.push(
        ...convertImage(
          img,
          getBlockLibrary(material, exclude),
          [x, y, z],
          <Axis> axis,
          useAbsolutePosition === true,
        ),
      );
    } catch (err) {
      console.error("Failed to read image from clipboard: %s", err);
    }
  } else {
    commands.push(
      ...await decode(
        new URL(url),
        getBlockLibrary(material, exclude),
        [x, y, z],
        <Axis> axis,
        useAbsolutePosition === true,
        parseInt(maxSize, 10),
      ),
    );
  }

  commands.map((c) => queueCommandRequest(c));
}
