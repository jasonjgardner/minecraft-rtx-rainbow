const directions = {
  north: [0, 0, 0],
  east: [0, 270, 0],
  south: [0, 180, 0],
  west: [0, 90, 0],
};

const stairPermutations: Array<
  Record<string, string | Record<string, Record<string, number[] | string[]>>>
> = [];

for (const [direction, rotation] of Object.entries(directions)) {
  stairPermutations.push(
    {
      condition: `q.block_state('minecraft:cardinal_direction') == '${direction}' && q.block_state('minecraft:vertical_half') == 'bottom'`,
      components: {
        "minecraft:transformation": {
          rotation,
        },
      },
    },
    {
      condition: `q.block_state('minecraft:cardinal_direction') == '${direction}' && q.block_state('minecraft:vertical_half') == 'top'`,
      components: {
        "minecraft:transformation": {
          rotation: [rotation[0] - 180, rotation[1], rotation[2]],
        },
      },
    },
  );
}

export const placementTrait = {
  "minecraft:placement_direction": {
    enabled_states: [
      "minecraft:cardinal_direction",
      "minecraft:facing_direction",
    ],
    y_rotation_offset: 90.0,
  },
  "minecraft:placement_position": {
    enabled_states: ["minecraft:vertical_half"],
  },
};

export default stairPermutations;
