import { NAMESPACE } from "/src/store/_config.ts";
import {
  addToBehaviorPack,
  addToResourcePack,
} from "/src/components/_state.ts";

/**
 * Create item data
 * @returns TRUE if function generation is required
 */
export function createItems() {
  addToResourcePack(
    "textures/item_texture.json",
    JSON.stringify(
      {
        resource_pack_name: NAMESPACE,
        texture_name: "atlas.items",
        texture_data: {
          [`${NAMESPACE}.rainbow_trail_key`]: {
            textures: "textures/items/rainbow_trail_key",
          },
        },
      },
    ),
  );
  addToBehaviorPack(
    "items/rainbow_trail.json",
    JSON.stringify(
      {
        format_version: "1.16.100",
        "minecraft:item": {
          description: {
            identifier: `${NAMESPACE}:rainbow_trail_key`,
            category: "items",
          },
          components: {
            "tag:rainbow:trail_key": {},
            "minecraft:icon": {
              frame: 0,
              texture: `${NAMESPACE}.rainbow_trail_key`,
            },
            "minecraft:creative_category": {
              parent: "itemGroup.name.dye",
            },
            "minecraft:wearable": {
              dispensable: true,
              slot: "slot.weapon.mainhand",
            },
            "minecraft:allow_off_hand": false,
            "minecraft:on_use": {
              on_use: `${NAMESPACE}:activate_trail`,
            },
          },
          events: {
            [`${NAMESPACE}:activate_trail`]: {
              run_command: {
                command: ["function rainbowtrail"],
                target: "self",
              },
            },
          },
        },
      },
    ),
  );
  addToBehaviorPack(
    "entities/player.json",
    JSON.stringify(
      {
        format_version: "1.16.0",
        "minecraft:entity": {
          identifier: "minecraft:player",
          is_spawnable: false,
          is_summonable: false,
          is_experimental: false,
          animations: {
            rainbow_trail: "animation.player.rainbow_trail",
          },
          scripts: {
            animate: [
              {
                rainbow_trail:
                  `query.get_equipped_item_name('slot.weapon.mainhand') == '${NAMESPACE}:rainbow_trail_key'`,
              },
            ],
          },
        },
      },
    ),
  );
  addToBehaviorPack(
    "items/rainbow_trail.json",
    JSON.stringify(
      {
        format_version: "1.16.100",
        "minecraft:item": {
          description: {
            identifier: `${NAMESPACE}:rainbow_trail_key`,
            category: "items",
          },
          components: {
            "tag:rainbow:trail_key": {},
            "minecraft:icon": {
              frame: 0,
              texture: `${NAMESPACE}.rainbow_trail_key`,
            },
            "minecraft:creative_category": {
              parent: "itemGroup.name.dye",
            },
            "minecraft:wearable": {
              dispensable: true,
              slot: "slot.weapon.mainhand",
            },
            "minecraft:allow_off_hand": false,
            "minecraft:on_use": {
              on_use: `${NAMESPACE}:activate_trail`,
            },
          },
          events: {
            [`${NAMESPACE}:activate_trail`]: {
              run_command: {
                command: ["function rainbowtrail"],
                target: "self",
              },
            },
          },
        },
      },
    ),
  );
  addToBehaviorPack(
    "animations/player.json",
    JSON.stringify(
      {
        format_version: "1.10.0",
        animations: {
          "animation.player.rainbow_trail": {
            timeline: {
              "0.0": ["/function rainbowtrail", "/function entitytrail"],
            },
            animation_length: 0.01,
            loop: true,
          },
        },
      },
    ),
  );

  return true;
}
