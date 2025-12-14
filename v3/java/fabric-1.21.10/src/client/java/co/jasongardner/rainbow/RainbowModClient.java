package co.jasongardner.rainbow;

import net.fabricmc.api.ClientModInitializer;

public class RainbowModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // In Minecraft 1.21.2+, render layers are determined by block properties
        // (.nonOpaque()) and model definitions rather than BlockRenderLayerMap.
        // Glass blocks already have nonOpaque() set, so they render correctly.

        RainbowMod.LOGGER.info("Rainbow III client initialized!");
    }
}
