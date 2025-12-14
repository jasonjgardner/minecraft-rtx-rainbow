import {
  BlockPermutation,
  Entity,
  EntityComponentTypes,
  system,
  world,
} from "@minecraft/server";

const NAMESPACE = "rainbow";

world.beforeEvents.worldInitialize.subscribe((eventData) => {
  eventData.blockComponentRegistry.registerCustomComponent(
    `${NAMESPACE}:precise_rotation`,
    {
      onTick(e) {
        const { block } = e;
        const players = world.getAllPlayers();

        for (let idx = 0; idx < players.length; idx++) {
          const player = players[idx];

          const newBlockPermutation = BlockPermutation.resolve(block.typeId, {
            ...block.permutation.getAllStates(),
            [`${NAMESPACE}:precise_rotation`]: Math.min(
              12,
              Math.max(1, player.getHeadLocation().y % 36),
            ),
          });

          block.setPermutation(newBlockPermutation);
        }
      },
    },
  );
});
