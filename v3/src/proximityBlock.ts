import {
  BlockPermutation,
  Entity,
  EntityComponentTypes,
  system,
  world,
} from "@minecraft/server";

const NAMESPACE = "rainbow";
const overworld = world.getDimension("overworld");

world.beforeEvents.worldInitialize.subscribe((eventData) => {
  eventData.blockComponentRegistry.registerCustomComponent(
    `${NAMESPACE}:proximity`,
    {
      onTick(e) {
        const { block } = e;
        const { x: bX, y: bY, z: bZ } = block.location;
        // const blockKey = `${bX},${bY},${bZ}`;
        const maxDistance = 10;
        let closest = maxDistance;

        // const players = world.getAllPlayers();
        const projectiles = [
          ...overworld.getEntities({
            tags: ["proxy"],
            location: block.location,
            maxDistance,
            closest: 10,
          }),
          // ...overworld.getEntities({
          //   type: "snowball",
          // }),
        ];
        const targets = [...projectiles];

        for (let i = 0; i < targets.length; i++) {
          const target = targets[i];

          if (!target) {
            continue;
          }

          try {
            const { x: pX, y: pY, z: pZ } = target.location;

            const distance = Math.sqrt(
              Math.pow(pX - bX, 2) +
                Math.pow(pY - bY, 2) +
                Math.pow(pZ - bZ, 2),
            );

            if (distance < closest && distance <= maxDistance) {
              closest = distance;
            }
          } catch {}
        }

        const newBlockPermutation = BlockPermutation.resolve(block.typeId, {
          ...block.permutation.getAllStates(),
          [`${NAMESPACE}:closest_proximity`]: closest,
        });

        block.setPermutation(newBlockPermutation);
      },
    },
  );
});
