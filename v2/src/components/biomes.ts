import { join } from "path/mod.ts";
import {
  DIR_BP,
  DIR_DOCS,
  DIR_RP,
  MIP_LEVELS,
  NAMESPACE,
} from "../store/_config.ts";
import type BlockEntry from "../components/BlockEntry.ts";

function groupPalette(palette: BlockEntry[], groupBy: keyof BlockEntry) {
  const groups: BlockEntry[][] = [];

  palette.forEach((block) => {
    const group = groups.find((g) => g[0][groupBy] === block[groupBy]);
    if (group) {
      group.push(block);
      return;
    }

    groups.push([block]);
  });

  return groups;
}

export async function createBiomes(palette: BlockEntry[]) {
  // Calculate color temperature
  const colorTemperature = (color: BlockEntry) => {
    const rgb = color.hexColor().match(/\w\w/g)?.map((b) => parseInt(b, 16));
    if (!rgb) return 0;
    const [r, g, b] = rgb;
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const groupedByColor = groupPalette(palette, "color");
  const groupedByMaterial = groupPalette(palette, "material");

  if (groupedByColor.length > 155) {
    console.warn(
      `There are ${groupedByColor.length} colors, but only 155 biomes are supported by Minecraft.`,
    );
    groupedByColor.length = 155;
  }

  await Promise.all(groupedByColor.map(async (group) => {
    const color = group[0].color;
    // Convert color temperature to celsius
    const temperature = Math.round(colorTemperature(group[0]) / 2.55) - 100;

    const biomeData = {
      "format_version": "1.20.20",
      "minecraft:biome": {
        description: {
          identifier: `biome_${color.toLowerCase().replace(/\s+/g, "_")}`,
        },
        "components": {
          overworld: {},
          beach: {},
          "minecraft:climate": {
            temperature,
          },
          "minecraft:overworld_height": {
            noise_type: "river",
          },
          "minecraft:surface_parameters": {
            "top_material": group.filter((block) => {
              return block.material.label === "rough" && block.level === 100 &&
                block.tint === 400;
            })[0],
            "sea_floor_material": group.filter((block) => {
              return block.material.label === "emissive" && block.level === 50;
            })[0],
            "mid_material": group.filter((block) => {
              return block.material.label === "glass" && block.level === 50 &&
                block.tint === 400;
            })[0],
            "floor_material": group.filter((block) => {
              return block.material.label === "dot" && block.level === 50 &&
                block.tint === 400;
            })[0],
            "foundation_material": group.filter((block) => {
              return block.material.label === "stud" && block.level === 50 &&
                block.tint === 400;
            })[0],
          },
        },
      },
    };

    await Deno.writeTextFile(
      `${DIR_BP}/biomes/biome_${color}.json`,
      JSON.stringify(biomeData),
    );
  }));
}
