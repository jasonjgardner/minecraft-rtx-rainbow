import type Material from "../Material.ts";
import PlasticMaterial from "./PlasticMaterial.ts";
export { PlasticMaterial };

export function getMaterials(): Material[] {
  return [
    new PlasticMaterial(1),
  ];
}
