import type Material from "../Material.ts";
import PlasticMaterial from "./PlasticMaterial.ts";
import GlowingMaterial from "./GlowingMaterial.ts";
import MetalMaterial from "./MetalMaterial.ts";
export { PlasticMaterial };

export function getMaterials(): Material[] {
  return [new PlasticMaterial(), new GlowingMaterial(), new MetalMaterial()];
}
