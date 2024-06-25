// src/main.ts
import {
BlockPermutation,
system,
world
} from "@minecraft/server";
var placeColorBlock = function(entity, color) {
  const { x, y, z } = entity.location;
  const block = overworld.getBlock({ x, y: y - 1, z });
  block?.north(1)?.setPermutation(BlockPermutation.resolve(`rainbow:${color}_400_lamp`));
};
var createBlockTrail = function(entity, color) {
  const entQuery = {
    tags: ["trail"]
  };
  for (const color2 of colors) {
    const q = entQuery;
    q.tags.push(color2);
    for (const ent of overworld.getEntities(q)) {
      placeColorBlock(ent, color2);
    }
  }
};
var overworld = world.getDimension("overworld");
var colors = [
  "blue",
  "brown",
  "cyan",
  "gray",
  "green",
  "light_blue",
  "light_gray",
  "lime",
  "magenta",
  "orange",
  "pink",
  "purple",
  "red",
  "yellow"
];
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const {
    id,
    initiator,
    message,
    sourceBlock,
    sourceEntity,
    sourceType
  } = event;
  if (!initiator) {
    return;
  }
  if (id.includes("rainbow")) {
    for (const color of colors) {
      if (message.includes(color)) {
        createBlockTrail(initiator, color);
      }
    }
  }
});

//# debugId=F0C8C94565ED06A864756E2164756E21
