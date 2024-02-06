import { BLOCK_VERSION, NAMESPACE } from "../../_constants.ts";
import { join } from "../../deps.ts";

export default class Block {
  _id: string;
  _name: string;
  _sound: string;
  _isotropic: boolean;
  _title: string;
  _hexColor: string;
  _geometry?: string | {
    identifier: string;
    bone_visibility: Record<string, boolean>;
  };
  _textureId: string;

  constructor({
    id,
    name,
    isotropic,
    title,
    hexColor,
    textureId,
    geometry,
    sound = "glass",
  }: {
    id: string;
    name: string;
    sound: string;
    isotropic: boolean;
    title: string;
    textId: string;
    hexColor: string;
    geometry?: string | {
      identifier: string;
      bone_visibility: Record<string, boolean>;
    };
    textureId: string;
  }) {
    this._id = id;
    this._name = name;
    this._sound = sound;
    this._isotropic = isotropic;
    this._title = title;
    this._hexColor = hexColor;
    this._textureId = textureId;
    this._geometry = geometry;
  }

  get id() {
    return this._id.toLowerCase();
  }

  get behaviorId() {
    return `${NAMESPACE}:${this.id}`;
  }

  get resourceId() {
    return `${NAMESPACE}_${this.id}`;
  }

  /**
   * Color name of the block
   */
  get name() {
    return this._name;
  }

  get isIsotropic() {
    return this._isotropic;
  }

  get sound() {
    return this._sound;
  }

  get title() {
    return this._title;
  }

  get textId() {
    return `tile.${this.behaviorId}.name`;
  }

  get hexColor() {
    return this._hexColor;
  }

  get geometry() {
    if (this._geometry !== undefined) {
      return {
        "minecraft:geometry": this._geometry,
      };
    }

    return {
      "minecraft:unit_cube": {},
    };
  }

  get components() {
    return {
      "minecraft:creative_category": {
        category: "construction",
        group: "itemGroup.name.concrete",
      },
      "minecraft:map_color": this.hexColor,
      "minecraft:material_instances": this.materialInstances,
      ...this.geometry,
    };
  }

  get materialInstances() {
    return {
      "*": {
        texture: this.resourceId,
        render_method: "opaque",
        ambient_occlusion: true,
        face_dimming: true,
      },
    };
  }

  get events() {
    return {};
  }

  get permutations() {
    return [];
  }

  get traits() {
    return {};
  }

  get states() {
    return {};
  }

  toJsonObject(): Record<string, unknown> {
    return {
      format_version: BLOCK_VERSION,
      "minecraft:block": {
        description: {
          identifier: this.behaviorId,
          traits: this.traits,
          states: this.states,
        },
        components: this.components,
        permutations: this.permutations,
        events: this.events,
      },
    };
  }

  async save(bp: string) {
    await Deno.writeTextFile(
      join(bp, "blocks", `${this.behaviorId}.json`),
      JSON.stringify(this.toJsonObject(), null, 2),
    );

    return this;
  }
}
