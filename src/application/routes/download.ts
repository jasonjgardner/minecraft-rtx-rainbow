import type { PackSizes, PaletteInput } from "/typings/types.ts";
import { DEFAULT_NAMESPACE } from "/typings/constants.ts";
import { sanitizeNamespace } from "../../_utils.ts";
import getPalette from "../../components/palettes/fromImage.ts";
import materialPalette from "../../components/palettes/materialDesign.ts";
import createAddon from "../../mod.ts";
export default async function download(
  paletteSource?: PaletteInput,
  namespace?: string,
  size?: PackSizes,
) {
  const ns = sanitizeNamespace(namespace ?? paletteSource ?? DEFAULT_NAMESPACE);

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
  });
}
