package co.jasongardner.rainbow.datagen;

import co.jasongardner.rainbow.block.ModBlocks;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagProvider;
import net.minecraft.block.Block;
import net.minecraft.registry.RegistryWrapper;
import net.minecraft.registry.tag.BlockTags;

import java.util.concurrent.CompletableFuture;

/**
 * Generates block tags for rainbow blocks.
 * All blocks are mineable with pickaxe.
 */
public class RainbowBlockTagProvider extends FabricTagProvider.BlockTagProvider {
    public RainbowBlockTagProvider(FabricDataOutput output, CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected void configure(RegistryWrapper.WrapperLookup registries) {
        // All blocks are mineable with pickaxe
        FabricTagProvider<Block>.FabricTagBuilder pickaxeBuilder = getOrCreateTagBuilder(BlockTags.PICKAXE_MINEABLE);

        for (Block block : ModBlocks.getAllBlocks().values()) {
            pickaxeBuilder.add(block);
        }
    }
}
