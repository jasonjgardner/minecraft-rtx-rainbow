import type { CreationParameters } from "/typings/types.ts";
import type Material from "../components/Material.ts";
import { DEFAULT_NAMESPACE, DEFAULT_PACK_SIZE } from "/typings/constants.ts";
import { sanitizeNamespace } from "../_utils.ts";
import getPalette from "../components/palettes/fromImage.ts";
import materialPalette from "../components/palettes/materialDesign.ts";
import PlasticMaterial from "../components/materials/PlasticMaterial.ts";
import GlowingMaterial from "../components/materials/GlowingMaterial.ts";
import MetalMaterial from "../components/materials/MetalMaterial.ts";
import createAddon from "../mod.ts";

const materialLibrary: { [k: string]: () => Material } = {
  plastic: () => new PlasticMaterial(),
  glowing: () => new GlowingMaterial(),
  metal: () => new MetalMaterial(),
} as const;

function materialFactory(materialIds: string[]): Material[] {
  const res: Material[] = [];

  materialIds.forEach((id) => {
    if (id in materialLibrary) {
      res.push(materialLibrary[id]());
    }
  });

  return res;
}

export default async function download({
  pixelArtSource,
  namespace,
  size,
  animationAlignment,
}: CreationParameters, materialIds?: string) {
  const ns = sanitizeNamespace(
    namespace ?? pixelArtSource ?? DEFAULT_NAMESPACE,
  );

  // Include all materials if no IDs are specified
  const materialOptions = materialFactory(
    materialIds ? materialIds.split(",") : Object.keys(materialLibrary),
  );

  if (!materialOptions.length) {
    materialOptions.push(new PlasticMaterial());
  }

  let blockColors = materialPalette;

  if (pixelArtSource) {
    try {
      blockColors = await getPalette(pixelArtSource);
    } catch (err) {
      console.log("Failed extracting color palette: %s", err);
    }
  }

  return createAddon([
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID(),
  ], {
    namespace: ns.length > 1 ? ns : DEFAULT_NAMESPACE,
    size: size || DEFAULT_PACK_SIZE,
    pixelArtSource,
    blockColors,
    materialOptions,
    animationAlignment,
  });
}
