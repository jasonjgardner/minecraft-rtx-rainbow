import type { IBlock, IMaterial } from "/typings/types.ts";
import { filteredBlocks } from "../store/_blocks.ts";
import BlockEntry from "./BlockEntry.ts";
import { materials } from "../store/_materials.ts";
export default function assemble(): BlockEntry[] {
  const res: BlockEntry[] = [];
  materials.forEach((material: IMaterial) => {
    filteredBlocks.forEach((block: IBlock) => {
      let itr = material.endStep;
      while (itr >= 0) {
        if (
          itr >= material.minimumLevel && itr <= material.maximumLevel
        ) {
          res.push(new BlockEntry(block, material, itr));
        }

        itr -= material.step;
      }
    });
  });

  return res;
}
