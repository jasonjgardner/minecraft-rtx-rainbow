import Material from '/src/components/Material.ts'

export default class Plastic extends Material {
    constructor(intensity: number) {
        super(intensity, 'plastic', {
            en_US: 'Plastic'
        })

        this.intensityRange = [10, 99]
    }

    get emissive() {
        return 0
    }

    get metalness() {
        return 0
    }

    
}