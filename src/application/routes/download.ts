import type { PackSizes, PaletteInput } from "/typings/types.ts";
import type Material from "../../components/Material.ts";
import { DEFAULT_NAMESPACE } from "/typings/constants.ts";
import { sanitizeNamespace } from "../../_utils.ts";
import getPalette from "../../components/palettes/fromImage.ts";
import materialPalette from "../../components/palettes/materialDesign.ts";
import PlasticMaterial from "../../components/materials/PlasticMaterial.ts";
import GlowingMaterial from "../../components/materials/GlowingMaterial.ts";
import MetalMaterial from "../../components/materials/MetalMaterial.ts";
import createAddon from "../../mod.ts";

export function getMaterials(): Material[] {
  return [new PlasticMaterial(), new GlowingMaterial(), new MetalMaterial()];
}

export default async function download(
  paletteSource?: PaletteInput,
  namespace?: string,
  rtxMaterials?: { [k: string]: boolean },
  size?: PackSizes,
) {
  const ns = sanitizeNamespace(namespace ?? paletteSource ?? DEFAULT_NAMESPACE);
  const materialOptions: Material[] = [];

  if (rtxMaterials) {
    if (rtxMaterials["plastic"]) {
      materialOptions.push(new PlasticMaterial());
    }

    if (rtxMaterials["glowing"]) {
      materialOptions.push(new GlowingMaterial());
    }

    if (rtxMaterials["metal"]) {
      materialOptions.push(new MetalMaterial());
    }
  }

  if (!materialOptions.length) {
    materialOptions.push(new PlasticMaterial());
  }

  return createAddon([
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID(),
  ], {
    namespace: ns.length > 1 ? ns : DEFAULT_NAMESPACE,
    size: size || 32,
    pixelArtSource: paletteSource,
    blockColors: paletteSource
      ? await getPalette(paletteSource) ?? materialPalette
      : materialPalette,
    materialOptions,
  });
}
