import "dotenv/load.ts";

import type { CreationParameters } from "/typings/types.ts";
import { DEFAULT_RELEASE_TYPE } from "/typings/constants.ts";
import { join } from "path/mod.ts";
import BlockEntry from "./components/BlockEntry.ts";
import { getBlocks, HueBlock } from "./components/blocks/index.ts";
import Material from "./components/Material.ts";
import { getMaterials } from "./components/materials/index.ts";
//import createFunctions from "/src/components/mcfunctions/index.ts";
import { generatePackIcon } from "./components/packIcon.ts";
import { createManifests } from "./components/manifest.ts";
import printer from "./components/printer.ts";
import {
  addBlock,
  addToBehaviorPack,
  addToResourcePack,
  createArchive,
} from "./components/_state.ts";

// Join base textures with PBR materials
function compileMaterials(
  namespace: string,
  baseTextures: HueBlock[],
  materials: Material[],
) {
  const res: BlockEntry[] = [];
  materials.forEach((material: Material) => {
    baseTextures.forEach((base: HueBlock) => {
      res.push(new BlockEntry(namespace, base, material));
    });
  });

  return res;
}
export default async function createAddon(
  uuids: [string, string, string, string],
  {
    size,
    namespace,
    description,
    blockColors,
    materialOptions,
    pixelArtSource,
    releaseType,
  }: CreationParameters,
) {
  const materials = materialOptions && materialOptions.length
    ? materialOptions
    : getMaterials();
  const res = compileMaterials(
    namespace,
    blockColors && blockColors.length ? blockColors : getBlocks(),
    materials,
  );

  try {
    const packIcon = pixelArtSource
      ? await generatePackIcon(namespace, pixelArtSource)
      : await Deno.readFile(
        join(Deno.cwd(), "src", "assets", "img", "pack_icon.png"),
      );

    addToResourcePack(
      "pack_icon.png",
      packIcon,
    );
    addToBehaviorPack(
      "pack_icon.png",
      packIcon,
    );
  } catch (err) {
    console.log("Failed adding pack icons: %s", err);
  }

  // TODO: Add description input
  createManifests(
    uuids,
    namespace,
    description ?? "Generated",
    releaseType ?? DEFAULT_RELEASE_TYPE,
  );

  await Promise.all(res.map((block: BlockEntry) => addBlock(block, size)));

  //createFunctions();

  try {
    await printer(res, pixelArtSource);
  } catch (err) {
    console.warn("Failed creating pixel art functions: %s", err);
  }

  return createArchive(namespace, size);
}
