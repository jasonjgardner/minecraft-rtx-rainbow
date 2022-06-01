import Material from "../Material.ts";

export default class Metal extends Material {
  _useHeightMap = false;

  _normalMap = "metal_normal";
  constructor() {
    super("shiny_metal", {
      en_US: "Shiny Metallic",
      en_GB: "Shiny Metallic",
    });
  }

  get emissive() {
    return 0;
  }

  get metalness() {
    return Math.round(255 * 0.99);
  }

  get roughness() {
    return Math.round(255 * 0.125);
  }

  get components() {
    return {
      "minecraft:creative_category": {
        category: "construction",
        group: "itemGroup.name.copper",
      },
      //"minecraft:unit_cube": Object.freeze({}),
      "minecraft:material_instances": this.materialInstance,
      //"minecraft:block_light_filter":
      "minecraft:block_light_emission": 0,
    };
  }
}
