/// @deno-types="npm:@types/mojang-gametest"
/// @deno-types="@minecraft/server"
import { BlockPermutation, GameMode, world } from "npm:@minecraft/server";

// Replace every red wool block in the world with a "rainbow:red_500_glowing_25" block
const overworld = world.getDimension("overworld");
const players = overworld.getPlayers({
  excludeGameModes: [GameMode.spectator],
});

console.log(players);
