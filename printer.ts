import { join, toFileUrl } from "https://deno.land/std@0.125.0/path/mod.ts";
import BlockEntry from "./BlockEntry.ts";
import { pixelPrinter } from "./ImagePrinter.ts";
import { DIR_SRC } from "./_config.ts";

const imgQueue: { [key: string]: URL | [URL, number] } = {
  //   chest: [
  //     new URL(
  //       "https://raw.githubusercontent.com/MicrosoftDocs/minecraft-creator/main/creator/Reference/Source/VanillaResourcePack/textures/blocks/chest_front.png",
  //     ),
  //     3,
  //   ],
  //   lamp_off: new URL(
  //     "https://raw.githubusercontent.com/MicrosoftDocs/minecraft-creator/main/creator/Reference/Source/VanillaResourcePack/textures/blocks/redstone_lamp_off.png",
  //   ),
  //   lamp_on: new URL(
  //     "https://raw.githubusercontent.com/MicrosoftDocs/minecraft-creator/main/creator/Reference/Source/VanillaResourcePack/textures/blocks/redstone_lamp_on.png",
  //   ),
  //   glazed_terracotta_cyan: new URL(
  //     "https://raw.githubusercontent.com/MicrosoftDocs/minecraft-creator/main/creator/Reference/Source/VanillaResourcePack/textures/blocks/glazed_terracotta_cyan.png",
  //   ),
  unicorn: toFileUrl(join(DIR_SRC, "/pixelart.png")),
  sponsor1: new URL("https://avatars.githubusercontent.com/u/1903667?s=32"),
};

export default async function print(palette: BlockEntry[], chunks = 6) {
  for (const k in imgQueue) {
    const isArr = Array.isArray(imgQueue[k]);
    await pixelPrinter(
      k,
      // @ts-ignore URL is at zero-index when imgQueue[k] is an array
      isArr ? imgQueue[k][0] : imgQueue[k],
      palette,
      // @ts-ignore Size is at 1 index when imgQueue[k] is an array
      isArr ? imgQueue[k][1] : chunks,
    );
  }
}
