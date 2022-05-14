import { EOL } from "fs/mod.ts";

export default function fishTree(): [string, string] {
  return [
    "fish_tree",
    [
      {
        // Spawn cod at salmon locations
        target: "@e[type=salmon,c=1]",
        entity: "minecraft:cod",
      },
      {
        // Spawn pufferfish at cod locations
        target: "@e[type=cod,c=1]",
        entity: "minecraft:pufferfish",
      }, // Spawn salmon at pufferfish locations
      {
        target: "@e[type=pufferfish,c=1]",
        entity: "minecraft:salmon",
      }, // Spawn bat when fish
    ].map(({ target, entity }) =>
      `execute ${target} ~-1 ~-1 ~ summon ${entity} ~ ~1 ~ minecraft:entity_spawned`
    ).join(EOL.CRLF),
  ];
}
