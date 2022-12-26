import type { IBlock, IMaterial } from "../../typings/types.ts";
import { filteredBlocks } from "../store/_blocks.ts";
import BlockEntry from "./BlockEntry.ts";
import { materials } from "../store/_materials.ts";
export default function assemble(exclude?: string[]): BlockEntry[] {
  const res: BlockEntry[] = [];
  materials.forEach((material: IMaterial) => {
    if (
      exclude &&
      exclude.includes(material.label ?? material.name.en_US.toLowerCase())
    ) {
      return;
    }
    filteredBlocks.forEach((block: IBlock) => {
      material.steps.forEach((step: number) => {
        res.push(new BlockEntry(block, material, step));
      });
    });
  });

  return res;
}
