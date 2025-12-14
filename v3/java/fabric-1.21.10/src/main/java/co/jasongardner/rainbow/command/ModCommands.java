package co.jasongardner.rainbow.command;

import co.jasongardner.rainbow.RainbowMod;
import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback;

/**
 * Registers commands for Rainbow III.
 */
public class ModCommands {
    public static void registerCommands() {
        RainbowMod.LOGGER.info("Registering commands...");

        CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
            AutomataCommand.register(dispatcher);
            AgentCommand.register(dispatcher);
        });
    }
}
