import { join } from "path/mod.ts";
import { DIR_RP } from "../store/_config.ts";
import type BlockEntry from "../components/BlockEntry.ts";

export async function writeDeferredLighting(palette: BlockEntry[]) {
  const deferredLighting = {
    format_version: [1, 0, 0],
    point_lights: {
      colors: Object.fromEntries(
        palette.filter((block) => {
          return block.material.lightEmission(1) > 0 ||
            block.material.emissive(1) > 0 ||
            block.material.label?.includes("lit") ||
            block.material.label?.includes("emissive");
        }).map((block) => {
          return [block.behaviorId, block.hexColor()];
        }),
      ),
    },
  };

  await Deno.writeTextFile(
    join(DIR_RP, "lighting", "global.json"),
    JSON.stringify(deferredLighting, null, 2),
  );
}
