package co.jasongardner.rainbow.datagen;

import co.jasongardner.rainbow.RainbowMod;
import co.jasongardner.rainbow.worldgen.ModBiomes;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricDynamicRegistryProvider;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.RegistryWrapper;
import net.minecraft.world.biome.Biome;

import java.util.concurrent.CompletableFuture;

/**
 * Generates worldgen JSON files for Rainbow biomes.
 * Output: data/rainbow/worldgen/biome/*.json
 */
public class RainbowWorldgenProvider extends FabricDynamicRegistryProvider {

    public RainbowWorldgenProvider(FabricDataOutput output,
            CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected void configure(RegistryWrapper.WrapperLookup registries, Entries entries) {
        // Add all biomes from the dynamic registry
        // The buildRegistry method only adds our custom biomes, so addAll is safe
        entries.addAll(registries.getOrThrow(RegistryKeys.BIOME));
    }

    @Override
    public String getName() {
        return "Rainbow III Worldgen";
    }
}
