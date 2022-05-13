import type Material from '/src/components/Material.ts'
import PlasticMaterial from '/src/components/materials/PlasticMaterial.ts';
export { PlasticMaterial }

export function getMaterials(): Material[] {
    return [
        new PlasticMaterial(1)
    ]
}