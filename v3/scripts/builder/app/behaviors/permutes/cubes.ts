import { NAMESPACE } from "../../../_constants.ts";
const directions = {
  north: [0, 0, 0],
  east: [0, 270, 0],
  south: [0, 180, 0],
  west: [0, 90, 0],
};

export const states = {
  [`${NAMESPACE}:permute`]: [0, 1, 2, 3, 4, 5, 6, 7],
};

const permutes: Array<
  Record<string, string | Record<string, Record<string, number[] | string[]>>>
> = [];

for (const [direction, rotation] of Object.entries(directions)) {
  permutes.push(
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
    }
  );
}

export default permutes;
