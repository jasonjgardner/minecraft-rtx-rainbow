package co.jasongardner.rainbow.datagen;

import co.jasongardner.rainbow.worldgen.ModBiomes;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.minecraft.registry.RegistryBuilder;
import net.minecraft.registry.RegistryKeys;

/**
 * Entry point for Fabric Data Generation.
 * Generates loot tables, tags, recipes, and worldgen data for all rainbow blocks and biomes.
 */
public class RainbowDataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator generator) {
        FabricDataGenerator.Pack pack = generator.createPack();

        // Generate block loot tables (blocks drop themselves)
        pack.addProvider(RainbowBlockLootTableProvider::new);

        // Generate block tags (mineable with pickaxe)
        pack.addProvider(RainbowBlockTagProvider::new);

        // Generate worldgen data (biomes)
        pack.addProvider(RainbowWorldgenProvider::new);

        // Generate biome tags (overworld biomes)
        pack.addProvider(RainbowBiomeTagProvider::new);

        // Generate recipes (stonecutter variants)
        // pack.addProvider(RainbowRecipeProvider::new);
    }

    @Override
    public void buildRegistry(RegistryBuilder registryBuilder) {
        // Register biomes for datagen
        registryBuilder.addRegistry(RegistryKeys.BIOME, ModBiomes::bootstrap);
    }
}
