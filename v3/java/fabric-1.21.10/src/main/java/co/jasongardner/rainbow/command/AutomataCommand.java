package co.jasongardner.rainbow.command;

import co.jasongardner.rainbow.automata.AutomataManager;
import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.IntegerArgumentType;
import com.mojang.brigadier.arguments.StringArgumentType;
import com.mojang.brigadier.context.CommandContext;
import net.minecraft.server.command.CommandManager;
import net.minecraft.server.command.ServerCommandSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import net.minecraft.util.hit.BlockHitResult;
import net.minecraft.util.hit.HitResult;

/**
 * Command handler for /rainbow automata
 * Provides Conway's Game of Life simulation using rainbow blocks.
 */
public class AutomataCommand {

    public static void register(CommandDispatcher<ServerCommandSource> dispatcher) {
        dispatcher.register(
            CommandManager.literal("rainbow")
                .then(CommandManager.literal("automata")
                    .then(CommandManager.literal("start")
                        .executes(AutomataCommand::startSimulation))
                    .then(CommandManager.literal("stop")
                        .executes(AutomataCommand::stopSimulation))
                    .then(CommandManager.literal("reset")
                        .executes(AutomataCommand::resetSimulation))
                    .then(CommandManager.literal("settings")
                        .then(CommandManager.argument("size", IntegerArgumentType.integer(16, 64))
                            .then(CommandManager.argument("orientation", StringArgumentType.word())
                                .executes(AutomataCommand::setSettings))))
                    .executes(AutomataCommand::showHelp))
        );
    }

    private static int startSimulation(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        ServerPlayerEntity player = source.getPlayer();

        if (player == null) {
            source.sendError(Text.literal("This command must be run by a player."));
            return 0;
        }

        // Get the block the player is looking at
        HitResult hitResult = player.raycast(10.0, 0.0f, false);
        if (hitResult.getType() != HitResult.Type.BLOCK) {
            source.sendError(Text.literal("Please look at a block to set the origin."));
            return 0;
        }

        BlockHitResult blockHit = (BlockHitResult) hitResult;
        AutomataManager.getInstance().start(
            player.getServerWorld(),
            blockHit.getBlockPos().up(),
            player.getUuid()
        );

        source.sendFeedback(() -> Text.literal("Cellular Automata started!"), false);
        return 1;
    }

    private static int stopSimulation(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        ServerPlayerEntity player = source.getPlayer();

        if (player == null) {
            source.sendError(Text.literal("This command must be run by a player."));
            return 0;
        }

        AutomataManager.getInstance().stop(player.getUuid());
        source.sendFeedback(() -> Text.literal("Cellular Automata stopped."), false);
        return 1;
    }

    private static int resetSimulation(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        ServerPlayerEntity player = source.getPlayer();

        if (player == null) {
            source.sendError(Text.literal("This command must be run by a player."));
            return 0;
        }

        AutomataManager.getInstance().reset(player.getUuid());
        source.sendFeedback(() -> Text.literal("Grid reset."), false);
        return 1;
    }

    private static int setSettings(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        ServerPlayerEntity player = source.getPlayer();

        if (player == null) {
            source.sendError(Text.literal("This command must be run by a player."));
            return 0;
        }

        int size = IntegerArgumentType.getInteger(context, "size");
        String orientation = StringArgumentType.getString(context, "orientation");

        AutomataManager.getInstance().setSettings(player.getUuid(), size, orientation);
        source.sendFeedback(() -> Text.literal(
            String.format("Settings updated: %dx%d %s", size, size, orientation)
        ), false);
        return 1;
    }

    private static int showHelp(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        source.sendFeedback(() -> Text.literal(
            "Rainbow Cellular Automata Commands:\n" +
            "  /rainbow automata start - Start simulation at looked-at block\n" +
            "  /rainbow automata stop - Stop simulation\n" +
            "  /rainbow automata reset - Reset grid with new random state\n" +
            "  /rainbow automata settings <size> <orientation> - Configure (floor/wall/cube)"
        ), false);
        return 1;
    }
}
