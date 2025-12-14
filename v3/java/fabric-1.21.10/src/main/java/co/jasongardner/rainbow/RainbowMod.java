package co.jasongardner.rainbow;

import co.jasongardner.rainbow.agent.AgentManager;
import co.jasongardner.rainbow.block.ModBlocks;
import co.jasongardner.rainbow.blockentity.ModBlockEntities;
import co.jasongardner.rainbow.command.ModCommands;
import co.jasongardner.rainbow.itemgroup.ModItemGroups;
import co.jasongardner.rainbow.worldgen.ModBiomeModifications;
import co.jasongardner.rainbow.worldgen.ModBiomes;
import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RainbowMod implements ModInitializer {
    public static final String MOD_ID = "rainbow";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        LOGGER.info("Initializing Rainbow III...");

        // Register all blocks (980 blocks: 7 types x 14 colors x 10 shades)
        ModBlocks.registerBlocks();

        // Register block entities for interactive features
        ModBlockEntities.registerBlockEntities();

        // Register creative mode item groups
        ModItemGroups.registerItemGroups();

        // Register commands (/rainbow automata)
        ModCommands.registerCommands();

        // Register biome modifications for world generation
        ModBiomeModifications.register();

        // Initialize AI agent manager
        AgentManager.getInstance().initialize();

        LOGGER.info("Rainbow III initialized with {} blocks, {} biomes, and AI agent!",
            ModBlocks.getBlockCount(), ModBiomes.getBiomeCount());
    }
}
