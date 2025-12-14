package co.jasongardner.rainbow.datagen;

import co.jasongardner.rainbow.worldgen.ModBiomes;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagProvider;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.RegistryWrapper;
import net.minecraft.registry.tag.BiomeTags;
import net.minecraft.world.biome.Biome;

import java.util.concurrent.CompletableFuture;

/**
 * Generates biome tags for Rainbow biomes.
 * Tags all Rainbow biomes as overworld biomes.
 */
public class RainbowBiomeTagProvider extends FabricTagProvider<Biome> {

    public RainbowBiomeTagProvider(FabricDataOutput output,
            CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, RegistryKeys.BIOME, registriesFuture);
    }

    @Override
    protected void configure(RegistryWrapper.WrapperLookup registries) {
        // Tag all Rainbow biomes as overworld biomes
        var overworldBuilder = getOrCreateTagBuilder(BiomeTags.IS_OVERWORLD);

        for (var key : ModBiomes.getAllBiomeKeys().values()) {
            overworldBuilder.add(key);
        }

        // Also allow spawning with structure pieces
        var spawnableBuilder = getOrCreateTagBuilder(BiomeTags.STRONGHOLD_HAS_STRUCTURE);
        for (var key : ModBiomes.getAllBiomeKeys().values()) {
            spawnableBuilder.add(key);
        }

        // Allow mineshafts
        var mineshaftBuilder = getOrCreateTagBuilder(BiomeTags.MINESHAFT_HAS_STRUCTURE);
        for (var key : ModBiomes.getAllBiomeKeys().values()) {
            mineshaftBuilder.add(key);
        }

        // Allow buried treasure
        var buriedTreasureBuilder = getOrCreateTagBuilder(BiomeTags.BURIED_TREASURE_HAS_STRUCTURE);
        for (var key : ModBiomes.getAllBiomeKeys().values()) {
            buriedTreasureBuilder.add(key);
        }
    }
}
