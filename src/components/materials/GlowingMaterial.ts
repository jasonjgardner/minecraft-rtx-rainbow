import Material from "../Material.ts";

export default class Glowing extends Material {
  _useHeightMap = false;

  _normalMap = "block_normal";
  constructor() {
    super("emissive", {
      en_US: "Glowing",
      en_GB: "Glowing",
    });
  }

  get emissive() {
    return Math.floor(255 * 0.33);
  }

  get metalness() {
    return 0;
  }

  get roughness() {
    return Math.floor(255 * 0.52);
  }

  get components() {
    return {
      "minecraft:creative_category": {
        category: "construction",
        group: "itemGroup.name.stainedClay",
      },
      //"minecraft:unit_cube": Object.freeze({}),
      "minecraft:material_instances": this.materialInstance,
      //"minecraft:block_light_filter":
      "minecraft:block_light_emission": 1,
    };
  }
}
