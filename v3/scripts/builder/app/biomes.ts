import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

interface IClimate {
  downfall: number;
  snow_accumulation: number[];
  temperature: number;
  ash?: number;
  blue_spores?: number;
  red_spores?: number;
  white_ash?: number;
}

interface IHeight {
  noise_type: string;
  noise_params?: number[];
}

interface ISurface {
  sea_floor_depth: number;
  sea_floor_material: string;
  foundation_material: string;
  mid_material: string;
  top_material: string;
  sea_material: string;
  floor_depth?: number;
  floor_material?: string;
  // Added type field for surface builder
  type?: string;
}

interface IReplaceTransformation {
  replacements: Array<{
    amount: number;
    dimension: string;
    noise_frequency_scale: number;
    targets: string[];
  }>;
}

interface IOverworldGenerationRules {
  generate_for_climates?: Array<[string, number]>;
  hills_transformation?: string;
  mutate_transformation?: string;
  river_transformation?: string;
  shore_transformation?: string;
}

interface IMountainParameters {
  peaks_factor: number;
  steep_material_adjustment: {
    east_slopes: boolean;
    material: string;
    north_slopes: boolean;
    south_slopes: boolean;
    west_slopes: boolean;
  };
}

interface ICappedSurface {
  beach_material: string;
  ceiling_materials: string[];
  floor_materials: string[];
  foundation_material: string;
  sea_material: string;
}

interface IMesaSurface {
  top_material: string;
  floor_depth: number;
  floor_material: string;
  foundation_material: string;
  mid_material: string;
  sea_floor_depth: number;
  sea_floor_material: string;
  sea_material: string;
}

export interface IBiome {
  biomeId: string;
  climate: IClimate;
  height: IHeight;
  surface: ISurface;
  tags: string[];
  replace_biomes?: IReplaceTransformation;
  overworld_generation_rules?: IOverworldGenerationRules;
  mountain_parameters?: IMountainParameters;
  capped_surface?: ICappedSurface;
  mesa_surface?: IMesaSurface;
  colors: Record<
    "sky_color" | "water_surface_color" | "water_fog_color" | "fog_color",
    string
  >;
}

async function makeBiome(
  biomeId: string,
  climate: IClimate,
  height: IHeight,
  surface: ISurface,
  tags: string[],
  biome: IBiome,
) {
  const components: Record<string, any> = {
    "minecraft:climate": {
      downfall: climate.downfall,
      snow_accumulation: climate.snow_accumulation,
      temperature: climate.temperature,
    },
    "minecraft:overworld_height": {
      noise_type: height.noise_type,
    },
    "minecraft:surface_builder": {
      builder: {
        type: "minecraft:overworld",
        top_material: surface.top_material,
        mid_material: surface.mid_material,
        foundation_material: surface.foundation_material,
        sea_floor_depth: Math.max(1, surface.sea_floor_depth),
        sea_floor_material: surface.sea_floor_material,
        sea_material: surface.sea_material,
      },
    },
    "minecraft:replace_biomes": {
      replacements: [
        {
          amount: 1,
          dimension: "minecraft:overworld",
          noise_frequency_scale: 50,
          targets: [
            "grove",
            "meadow",
            "forest",
            "savanna",
            "swampland",
            "mesa",
            "jungle",
            "river",
            "plains",
            "beach",
            "desert",
          ].map((biome) => `minecraft:${biome}`),
        },
      ],
    },
    // Note: minecraft:overworld_generation_rules is deprecated (pre-Caves and Cliffs)
    "minecraft:tags": {
      tags: ["overworld", "plains"],
    },
    "minecraft:creature_spawn_probability": {
      probability: 0,
    },
  };

  // Add replace biomes component
  if (biome.replace_biomes) {
    components["minecraft:replace_biomes"] = {
      replacements: [
        {
          amount: 1,
          dimension: "minecraft:overworld",
          noise_frequency_scale: 25,
          targets: ["river", "plains", "beach", "desert"],
        },
      ],
    };
  }

  // Add overworld generation rules if provided
  // if (biome.overworld_generation_rules) {
  //     components['minecraft:overworld_generation_rules'] = {
  //         generate_for_climates: [
  //             ["cold", 0.5],
  //             ["frozen", 0.25],
  //             ["warm", 1]
  //         ],
  //         hills_transformation: "plains",
  //         mutate_transformation: "desert_hills",
  //         river_transformation: "frozen_river",
  //         shore_transformation: "mesa"
  //     };
  // }

  // Add mountain parameters
  // components['minecraft:mountain_parameters'] = {
  //     peaks_factor: 0,
  //     steep_material_adjustment: {
  //         east_slopes: false,
  //         material: surface.top_material, // Use top_material instead of empty string
  //         north_slopes: false,
  //         south_slopes: false,
  //         west_slopes: false
  //     },
  //     top_slide: {
  //         enabled: true
  //     }
  // };

  // Add capped surface
  // components['minecraft:capped_surface'] = {
  //     beach_material: surface.top_material,
  //     ceiling_materials: [surface.top_material],
  //     floor_materials: [surface.foundation_material],
  //     foundation_material: surface.foundation_material,
  //     sea_material: surface.sea_material
  // };

  // // Add mesa surface
  // components['minecraft:mesa_surface'] = {
  //     top_material: surface.top_material,
  //     floor_depth: surface.floor_depth || 0,
  //     floor_material: surface.floor_material || surface.foundation_material,
  //     foundation_material: surface.foundation_material,
  //     mid_material: surface.mid_material,
  //     sea_floor_depth: surface.sea_floor_depth,
  //     sea_floor_material: surface.sea_floor_material,
  //     sea_material: surface.sea_material
  // };

  const biomeJson = {
    format_version: "1.21.110",
    "minecraft:biome": {
      description: {
        identifier: `rainbow:${biomeId}`,
      },
      components: components,
    },
  };

  // Ensure the biomes directory exists
  const biomesDir = join(process.cwd(), "bedrock/BP/rainbow Biomes/biomes");
  if (!existsSync(biomesDir)) {
    await mkdir(biomesDir, { recursive: true });
  }

  // Write to v3\bedrock\BP\rainbow Biomes\biomes
  await writeFile(
    join(biomesDir, `${biomeId}.json`),
    JSON.stringify(biomeJson, null, 2),
  );
}

async function makeClientBiomes(
  biomes: Record<
    string,
    {
      sky_color: string;
      water_surface_color: string;
      water_fog_color: string;
      fog_color: string;
    }
  >,
) {
  const clientBiomeJson = {
    biomes: {
      ...biomes,
    },
  };

  // Ensure the RP directory exists
  const rpDir = join(process.cwd(), "bedrock/RP");
  if (!existsSync(rpDir)) {
    await mkdir(rpDir, { recursive: true });
  }

  // Write to v3\bedrock\RP\biomes
  await writeFile(
    join(rpDir, "biomes_client.json"),
    JSON.stringify(clientBiomeJson, null, 2),
  );
}

export default async function main(biomes: IBiome[]) {
  await Promise.all(
    biomes.map(async (biome) => {
      await makeBiome(
        biome.biomeId,
        biome.climate,
        biome.height,
        biome.surface,
        biome.tags,
        biome, // Pass the entire biome object
      );
    }),
  );
  await makeClientBiomes(
    biomes.reduce(
      (acc, biome) => {
        acc[`rainbow:${biome.biomeId}`] = {
          sky_color: biome.colors.sky_color,
          water_surface_color: biome.colors.water_surface_color,
          water_fog_color: biome.colors.water_fog_color,
          fog_color: biome.colors.fog_color,
        };
        return acc;
      },
      {} as Record<
        string,
        {
          sky_color: string;
          water_surface_color: string;
          water_fog_color: string;
          fog_color: string;
        }
      >,
    ),
  );
}
