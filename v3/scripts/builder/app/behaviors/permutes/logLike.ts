const directions = {
  north: [0, 0, 0],
  east: [0, 270, 0],
  south: [0, 180, 0],
  west: [0, 90, 0],
};

const yDirections = {
  up: [90, 0, 0],
  down: [-90, 0, 0],
};

const logPermutations: Array<
  Record<string, string | Record<string, Record<string, number[] | string[]>>>
> = [];

for (const [direction, rotation] of Object.entries(directions)) {
  for (const [yDirection, yRotation] of Object.entries(yDirections)) {
    logPermutations.push({
      condition: `q.block_state('minecraft:cardinal_direction') == '${direction}' && q.block_state('minecraft:vertical_half') == '${yDirection}'`,
      components: {
        "minecraft:transformation": {
          rotation: [
            rotation[0] + yRotation[0],
            rotation[1] + yRotation[1],
            rotation[2] + yRotation[2],
          ],
        },
      },
    });
  }
}

export default logPermutations;
