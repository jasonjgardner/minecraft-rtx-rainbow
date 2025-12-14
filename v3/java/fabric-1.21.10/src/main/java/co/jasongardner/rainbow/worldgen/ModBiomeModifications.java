package co.jasongardner.rainbow.worldgen;

import co.jasongardner.rainbow.RainbowMod;
import co.jasongardner.rainbow.data.RainbowBiomeData;
import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import net.fabricmc.fabric.api.biome.v1.BiomeModifications;
import net.fabricmc.fabric.api.biome.v1.BiomeSelectors;
import net.fabricmc.fabric.api.biome.v1.ModificationPhase;
import net.minecraft.registry.RegistryKey;
import net.minecraft.util.Identifier;
import net.minecraft.world.biome.Biome;
import net.minecraft.world.gen.GenerationStep;

/**
 * Handles runtime biome modifications using Fabric Biome API.
 * Adds features to Rainbow biomes for surface block placement.
 */
public class ModBiomeModifications {
    private static final Identifier RAINBOW_BIOME_MODIFICATIONS =
        Identifier.of(RainbowMod.MOD_ID, "biome_modifications");

    /**
     * Registers all biome modifications.
     * Called from RainbowMod.onInitialize().
     */
    public static void register() {
        RainbowMod.LOGGER.info("Registering Rainbow biome modifications...");

        // Register surface modifications for each Rainbow biome
        // This uses BiomeModifications to add features that will place Rainbow blocks

        // For now, we'll add basic modifications to ensure biomes work correctly
        // The actual surface block replacement is handled via surface rules in datapacks

        BiomeModifications.create(RAINBOW_BIOME_MODIFICATIONS)
            .add(
                ModificationPhase.ADDITIONS,
                // Select all Rainbow biomes
                context -> {
                    Identifier biomeId = context.getBiomeKey().getValue();
                    return biomeId.getNamespace().equals(RainbowMod.MOD_ID);
                },
                // Modify the biome
                (selectionContext, modificationContext) -> {
                    // Biomes are already configured with proper effects via datagen
                    // This hook is available for additional runtime modifications if needed

                    // Example: Could add custom ambient particles here
                    // modificationContext.getEffects().setParticleConfig(...)

                    // Example: Could add custom features here
                    // modificationContext.getGenerationSettings().addFeature(...)
                }
            );

        RainbowMod.LOGGER.info("Registered biome modifications for {} biomes.", ModBiomes.getBiomeCount());
    }

    /**
     * Checks if a biome is a Rainbow biome.
     */
    public static boolean isRainbowBiome(RegistryKey<Biome> biomeKey) {
        return biomeKey.getValue().getNamespace().equals(RainbowMod.MOD_ID);
    }

    /**
     * Gets the color from a Rainbow biome key.
     * Returns null if not a Rainbow biome.
     */
    public static Color getColorFromBiome(RegistryKey<Biome> biomeKey) {
        if (!isRainbowBiome(biomeKey)) {
            return null;
        }

        String path = biomeKey.getValue().getPath();
        // Parse color from path (e.g., "blue_500" -> "blue")
        int lastUnderscore = path.lastIndexOf('_');
        if (lastUnderscore > 0) {
            String colorId = path.substring(0, lastUnderscore);
            for (Color color : Color.values()) {
                if (color.getId().equals(colorId)) {
                    return color;
                }
            }
        }
        return null;
    }

    /**
     * Gets the shade from a Rainbow biome key.
     * Returns null if not a Rainbow biome.
     */
    public static Shade getShadeFromBiome(RegistryKey<Biome> biomeKey) {
        if (!isRainbowBiome(biomeKey)) {
            return null;
        }

        String path = biomeKey.getValue().getPath();
        // Parse shade from path (e.g., "blue_500" -> "500")
        int lastUnderscore = path.lastIndexOf('_');
        if (lastUnderscore > 0 && lastUnderscore < path.length() - 1) {
            String shadeStr = path.substring(lastUnderscore + 1);
            try {
                int shadeValue = Integer.parseInt(shadeStr);
                for (Shade shade : Shade.values()) {
                    if (shade.getValue() == shadeValue) {
                        return shade;
                    }
                }
            } catch (NumberFormatException e) {
                // Not a valid shade
            }
        }
        return null;
    }
}
