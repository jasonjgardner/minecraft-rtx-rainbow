package co.jasongardner.rainbow.worldgen;

import co.jasongardner.rainbow.RainbowMod;
import co.jasongardner.rainbow.data.RainbowBiomeData;
import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import net.minecraft.entity.SpawnGroup;
import net.minecraft.registry.Registerable;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.entry.RegistryEntry;
import net.minecraft.sound.BiomeMoodSound;
import net.minecraft.util.Identifier;
import net.minecraft.world.biome.Biome;
import net.minecraft.world.biome.BiomeEffects;
import net.minecraft.world.biome.GenerationSettings;
import net.minecraft.world.biome.SpawnSettings;
import net.minecraft.world.gen.carver.ConfiguredCarvers;
import net.minecraft.world.gen.feature.DefaultBiomeFeatures;
import net.minecraft.world.gen.feature.PlacedFeature;

import java.util.HashMap;
import java.util.Map;

/**
 * Registry keys and bootstrap method for all 140 Rainbow biomes.
 * One biome per color/shade combination (14 colors x 10 shades).
 */
public class ModBiomes {
    // Store all biome keys for lookup
    private static final Map<String, RegistryKey<Biome>> BIOME_KEYS = new HashMap<>();

    // Static initialization of all 140 biome keys
    static {
        for (Color color : Color.values()) {
            for (Shade shade : Shade.values()) {
                String id = color.getId() + "_" + shade.getValue();
                RegistryKey<Biome> key = RegistryKey.of(
                    RegistryKeys.BIOME,
                    Identifier.of(RainbowMod.MOD_ID, id)
                );
                BIOME_KEYS.put(id, key);
            }
        }
    }

    /**
     * Gets the biome registry key for a specific color/shade combination.
     */
    public static RegistryKey<Biome> getBiomeKey(Color color, Shade shade) {
        return BIOME_KEYS.get(color.getId() + "_" + shade.getValue());
    }

    /**
     * Gets the biome registry key by ID string.
     */
    public static RegistryKey<Biome> getBiomeKey(String id) {
        return BIOME_KEYS.get(id);
    }

    /**
     * Gets all biome registry keys.
     */
    public static Map<String, RegistryKey<Biome>> getAllBiomeKeys() {
        return BIOME_KEYS;
    }

    /**
     * Gets the total number of biomes.
     */
    public static int getBiomeCount() {
        return BIOME_KEYS.size();
    }

    /**
     * Bootstrap method called by datagen to register all biomes.
     */
    public static void bootstrap(Registerable<Biome> biomeRegisterable) {
        var placedFeatures = biomeRegisterable.getRegistryLookup(RegistryKeys.PLACED_FEATURE);
        var configuredCarvers = biomeRegisterable.getRegistryLookup(RegistryKeys.CONFIGURED_CARVER);

        for (Color color : Color.values()) {
            for (Shade shade : Shade.values()) {
                RainbowBiomeData data = RainbowBiomeData.create(color, shade);
                RegistryKey<Biome> key = getBiomeKey(color, shade);
                biomeRegisterable.register(key, createBiome(data, placedFeatures, configuredCarvers));
            }
        }
    }

    /**
     * Creates a biome with the specified properties.
     */
    private static Biome createBiome(
            RainbowBiomeData data,
            net.minecraft.registry.RegistryEntryLookup<PlacedFeature> placedFeatures,
            net.minecraft.registry.RegistryEntryLookup<net.minecraft.world.gen.carver.ConfiguredCarver<?>> configuredCarvers
    ) {
        // Spawn settings - minimal spawning for decorative biomes
        SpawnSettings.Builder spawnBuilder = new SpawnSettings.Builder();
        // Add basic passive mobs at low rates
        DefaultBiomeFeatures.addFarmAnimals(spawnBuilder);

        // Generation settings - standard overworld features
        GenerationSettings.LookupBackedBuilder generationBuilder =
            new GenerationSettings.LookupBackedBuilder(placedFeatures, configuredCarvers);

        // Add standard overworld carvers (caves)
        DefaultBiomeFeatures.addLandCarvers(generationBuilder);

        // Add default underground ores and structures
        DefaultBiomeFeatures.addAmethystGeodes(generationBuilder);
        DefaultBiomeFeatures.addDungeons(generationBuilder);
        DefaultBiomeFeatures.addMineables(generationBuilder);
        DefaultBiomeFeatures.addDefaultOres(generationBuilder);
        DefaultBiomeFeatures.addDefaultDisks(generationBuilder);

        // Add springs
        DefaultBiomeFeatures.addSprings(generationBuilder);

        // Biome effects (colors, sounds)
        BiomeEffects.Builder effectsBuilder = new BiomeEffects.Builder()
            .skyColor(data.skyColor())
            .fogColor(data.fogColor())
            .waterColor(data.waterColor())
            .waterFogColor(data.waterFogColor())
            .grassColor(data.grassColor())
            .foliageColor(data.foliageColor())
            .moodSound(BiomeMoodSound.CAVE);

        // Build the biome
        return new Biome.Builder()
            .precipitation(data.hasPrecipitation())
            .temperature(data.temperature())
            .downfall(data.downfall())
            .effects(effectsBuilder.build())
            .spawnSettings(spawnBuilder.build())
            .generationSettings(generationBuilder.build())
            .build();
    }
}
