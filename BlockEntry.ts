import titleCase from "https://deno.land/x/case@v2.1.0/titleCase.ts";
import blocks from "./_blocks.ts";
import type { IMaterial, LanguageId, MinecraftEvent, RGB } from "./types.ts";
import { hex2rgb } from "./_utils.ts";
import { NAMESPACE } from "./_config.ts";

export default class BlockEntry {
  _id!: string;

  _hue!: string;

  _tint!: string | number;

  _material: IMaterial;
  _level: number;
  _value!: string;
  constructor(key: string, material: IMaterial, level: number) {
    const lastDash = key.lastIndexOf("_");
    this._tint = key.substring(lastDash + 1);
    this._hue = key.substring(0, lastDash);
    this._level = Math.abs(level);
    this._material = material;
    this._id = key;
  }

  getTitle(lang: LanguageId) {
    return `${this._level}% ${
      this._material.name[lang]
    } ${this.color} ${this.tint}`;
  }

  get level() {
    return Math.max(0, Math.min(100, this._level));
  }

  get color() {
    return titleCase(this._hue);
  }

  get tint(): string | number {
    return isNaN(+this._tint)
      ? `${this._tint}`.toUpperCase()
      : parseInt(`${this._tint}`, 10);
  }

  get id() {
    return `${this._id}_${this._material.name.en_US}_${this._level}`
      .toLowerCase();
  }

  get behaviorId() {
    return `${NAMESPACE}:${this.id}`;
  }

  get resourceId() {
    return `${NAMESPACE}_${this.id}`;
  }

  get name() {
    return {
      en_US: this.getTitle("en_US"),
    };
  }

  get textureSet() {
    return {
      color: "#ff" + blocks[this._id].color.substring(1),
      metalness_emissive_roughness: <RGB> [
        this._material.metalness(this._level),
        this._material.emissive(this._level),
        this._material.roughness(this._level),
      ],
      normal: this._material.normal || "block_normal",
    } as const;
  }

  get sound() {
    return this._material.sound || "dirt";
  }

  hexColor() {
    return blocks[this._id].color;
  }

  valueOf() {
    return hex2rgb(this.hexColor());
  }

  setPosition(offset: number) {
    return [
      `~`,
      `~${this.level + offset}`,
      `~`,
    ].join(" ");
  }

  properties() {
    return {
      "rainbow:is_ignited": [true, false],
      "rainbow:drip_level": [1, 2, 3, 4, 5],
    };
  }

  behaviors() {
    return {
      "minecraft:creative_category": {
        "category": "construction",
        "group": "itemGroup.name.concrete",
        },
        "minecraft:unit_cube": {},
      "minecraft:breakonpush": false,
      "minecraft:flammable": this._material.flammable,
      "minecraft:friction": this._material.friction,
      "minecraft:explosion_resistance": this._material.explosionResistance || 0,
      "minecraft:map_color": this.hexColor(),
      "minecraft:block_light_absorption": this._material.lightAbsorption(
        this._level,
      ),
      "minecraft:block_light_emission": this._material.lightEmission(
        this._level,
      ),
      // "minecraft:ticking": {
      //   "range": [1, 1],
      //   "looping": true,
      //   "on_tick": {
      //     "event": "rainbow:set_fire",
      //     "target": "self",
      //     "condition": "query.block_property('rainbow:is_ignited') == false",
      //   },
      // },
      "minecraft:on_interact": {
        "event": "rainbow:recolor1",
      },
      "minecraft:on_step_on": {
        "event": "rainbow:recolor2",
      },
      "minecraft:on_fall_on": {
        "event": "rainbow:start_drip",
      },
    } as const;
  }

  events(prevBlock?: BlockEntry, nextBlock?: BlockEntry) {
    const eventData: Array<
      [
        string,
        MinecraftEvent,
      ]
    > = [
      // ["rainbow:set_fire", {
      //   "sequence": [
      //     {
      //       "set_block_property": {
      //         "rainbow:is_ignited": true,
      //       },
      //     },
      //     {
      //       "run_command": {
      //         "command": ["effect @e[r=1] minecraft:is_ignited 2 2 false"],
      //       },
      //     },
      //     {
      //       "set_block_property": {
      //         "rainbow:is_ignited": false,
      //       },
      //     },
      //   ],
      // }],
    // ["rainbow:start_drip", {
    //         "set_block_property": {
    //           "rainbow:drip_level": 1,
    //         },
    //       }
    // ],
    //         ["rainbow:drip", {
    //             "sequence": [
    //                 {
    //                     "set_block_property": {
    //                   "rainbow:drip_level": ""
    //               }
    //           }
    //       ]
    //   }],
    ];

    if (prevBlock !== undefined) {
      eventData.push(["rainbow:recolor1", {
        "set_block": {
          "block_type": prevBlock.behaviorId,
        },
      }], ["rainbow:grow_x", {
        "set_block_at_pos": {
          "block_offset": [1, 0, 0],
          "block_type": prevBlock.behaviorId,
        },
      }], ["rainbow:grow_y", {
        "set_block_at_pos": {
          "block_offset": [0, 1, 0],
          "block_type": prevBlock.behaviorId,
        },
      }], ["rainbow:grow_z", {
        "set_block_at_pos": {
          "block_offset": [0, 0, 1],
          "block_type": prevBlock.behaviorId,
        },
      }]);
    }

    if (nextBlock !== undefined) {
      eventData.push(["rainbow:recolor2", {
        "set_block": {
          "block_type": nextBlock.behaviorId,
        },
      }]);
    }

    return Object.fromEntries(eventData);
  }
}
