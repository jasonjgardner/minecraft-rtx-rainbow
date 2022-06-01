import Material from "../Material.ts";

export default class MattePlastic extends Material {
  _useHeightMap = false;

  _normalMap = "block_normal";
  constructor() {
    super("rough", {
      en_US: "Matte Plastic",
      en_GB: "Matte Plastic",
    });
  }

  get emissive() {
    return 0;
  }

  get metalness() {
    return 0;
  }

  get roughness() {
    return Math.floor(255 * 0.75);
  }

  get components() {
    return {
      "minecraft:creative_category": {
        category: "construction",
        group: "itemGroup.name.concrete",
      },
      //"minecraft:unit_cube": Object.freeze({}),
      "minecraft:material_instances": this.materialInstance,
      //"minecraft:block_light_filter":
      "minecraft:block_light_emission": 0,
    };
  }
}
