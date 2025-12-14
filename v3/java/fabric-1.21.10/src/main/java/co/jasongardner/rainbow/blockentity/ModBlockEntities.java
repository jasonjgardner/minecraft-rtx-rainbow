package co.jasongardner.rainbow.blockentity;

import co.jasongardner.rainbow.RainbowMod;
import co.jasongardner.rainbow.automata.AutomataManager;

/**
 * Registers block entities for interactive features.
 * Note: In Minecraft 1.21.2+, block entity registration requires associated blocks.
 * The proximity and morph block entity types will be implemented when those
 * special block types are added.
 */
public class ModBlockEntities {
    // Block entity types will be registered when proximity/morph blocks are added
    // public static BlockEntityType<ProximityBlockEntity> PROXIMITY_BLOCK_ENTITY;
    // public static BlockEntityType<MorphBlockEntity> MORPH_BLOCK_ENTITY;

    public static void registerBlockEntities() {
        RainbowMod.LOGGER.info("Registering block entities...");

        // Initialize automata manager tick handler
        AutomataManager.getInstance().initialize();

        RainbowMod.LOGGER.info("Block entity registration complete.");
    }
}
