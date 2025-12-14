package co.jasongardner.rainbow.datagen;

import co.jasongardner.rainbow.block.ModBlocks;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockLootTableProvider;
import net.minecraft.block.Block;
import net.minecraft.registry.RegistryWrapper;

import java.util.concurrent.CompletableFuture;

/**
 * Generates loot tables for all rainbow blocks.
 * All blocks drop themselves when broken.
 */
public class RainbowBlockLootTableProvider extends FabricBlockLootTableProvider {
    public RainbowBlockLootTableProvider(FabricDataOutput output, CompletableFuture<RegistryWrapper.WrapperLookup> registryLookup) {
        super(output, registryLookup);
    }

    @Override
    public void generate() {
        // All rainbow blocks drop themselves
        for (Block block : ModBlocks.getAllBlocks().values()) {
            addDrop(block);
        }
    }
}
