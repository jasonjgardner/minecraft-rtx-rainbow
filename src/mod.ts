import "dotenv/load.ts";

import type { CreationParameters, PackIDs } from "/typings/types.ts";
import { DEFAULT_DESCRIPTION } from "/typings/constants.ts";
import BlockEntry from "./components/BlockEntry.ts";
import { getBlocks, HueBlock } from "./components/blocks/index.ts";
import Material from "./components/Material.ts";
import { getMaterials } from "./components/materials/index.ts";
//import createFunctions from "/src/components/mcfunctions/index.ts";
import { generatePackIcon, getDefaultIcon } from "./components/packIcon.ts";
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
  uuids: PackIDs,
  {
    size,
    namespace,
    description,
    blockColors,
    materialOptions,
    pixelArtSource,
    animationAlignment,
  }: CreationParameters,
) {
  if (!blockColors || !blockColors.length) {
    console.log("Default palette will be used");
  }

  const materials = materialOptions && materialOptions.length
    ? materialOptions
    : getMaterials();

  const res = compileMaterials(
    namespace,
    blockColors ?? getBlocks(),
    materials,
  );

  try {
    const packIcon = pixelArtSource
      ? await generatePackIcon(namespace, pixelArtSource)
      : await getDefaultIcon();

    addToResourcePack("pack_icon.png", packIcon);
    addToBehaviorPack("pack_icon.png", packIcon);
  } catch (err) {
    console.log("Failed adding pack icons: %s", err);
  }

  // TODO: Add description input
  createManifests(uuids, namespace, description ?? DEFAULT_DESCRIPTION);

  await Promise.all(res.map((block: BlockEntry) => addBlock(block, size)));

  //createFunctions();

  try {
    await printer(res, pixelArtSource, animationAlignment);
  } catch (err) {
    console.warn("Failed creating pixel art functions: %s", err);
  }

  return createArchive(namespace, size);
}
