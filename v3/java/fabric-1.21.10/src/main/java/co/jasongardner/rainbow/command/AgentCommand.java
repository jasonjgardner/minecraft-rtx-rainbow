package co.jasongardner.rainbow.command;

import co.jasongardner.rainbow.agent.AgentManager;
import co.jasongardner.rainbow.config.AgentConfig;
import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.StringArgumentType;
import com.mojang.brigadier.context.CommandContext;
import net.minecraft.server.command.CommandManager;
import net.minecraft.server.command.ServerCommandSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;

/**
 * Command handler for /rainbow agent
 */
public class AgentCommand {

    public static void register(CommandDispatcher<ServerCommandSource> dispatcher) {
        dispatcher.register(
            CommandManager.literal("rainbow")
                .then(CommandManager.literal("agent")
                    // /rainbow agent setkey <api_key>
                    .then(CommandManager.literal("setkey")
                        .then(CommandManager.argument("api_key", StringArgumentType.string())
                            .executes(AgentCommand::setApiKey)))

                    // /rainbow agent removekey
                    .then(CommandManager.literal("removekey")
                        .executes(AgentCommand::removeApiKey))

                    // /rainbow agent build <description>
                    .then(CommandManager.literal("build")
                        .then(CommandManager.argument("description", StringArgumentType.greedyString())
                            .executes(AgentCommand::startBuild)))

                    // /rainbow agent stop
                    .then(CommandManager.literal("stop")
                        .executes(AgentCommand::stopAgent))

                    // /rainbow agent status
                    .then(CommandManager.literal("status")
                        .executes(AgentCommand::showStatus))

                    // /rainbow agent help (default)
                    .executes(AgentCommand::showHelp))
        );
    }

    private static int setApiKey(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        ServerPlayerEntity player = source.getPlayer();

        if (player == null) {
            source.sendError(Text.literal("This command must be run by a player."));
            return 0;
        }

        String apiKey = StringArgumentType.getString(context, "api_key");

        // Basic validation
        if (!apiKey.startsWith("sk-ant-")) {
            source.sendError(Text.literal(
                "Invalid API key format. Claude API keys should start with 'sk-ant-'"));
            return 0;
        }

        if (apiKey.length() < 20) {
            source.sendError(Text.literal("API key seems too short. Please check your key."));
            return 0;
        }

        AgentConfig.getInstance().setApiKey(player.getUuid(), apiKey);

        // Don't echo the key for security
        source.sendFeedback(() -> Text.literal(
            "[Agent] API key saved. Use /rainbow agent build <description> to start building."),
            false);

        return 1;
    }

    private static int removeApiKey(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        ServerPlayerEntity player = source.getPlayer();

        if (player == null) {
            source.sendError(Text.literal("This command must be run by a player."));
            return 0;
        }

        if (!AgentConfig.getInstance().hasApiKey(player.getUuid())) {
            source.sendFeedback(() -> Text.literal("[Agent] No API key was set."), false);
            return 1;
        }

        AgentConfig.getInstance().removeApiKey(player.getUuid());
        source.sendFeedback(() -> Text.literal("[Agent] API key removed."), false);

        return 1;
    }

    private static int startBuild(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        ServerPlayerEntity player = source.getPlayer();

        if (player == null) {
            source.sendError(Text.literal("This command must be run by a player."));
            return 0;
        }

        String description = StringArgumentType.getString(context, "description");

        if (description.isBlank()) {
            source.sendError(Text.literal("Please provide a description of what to build."));
            return 0;
        }

        boolean started = AgentManager.getInstance().startBuildTask(player, description);

        return started ? 1 : 0;
    }

    private static int stopAgent(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        ServerPlayerEntity player = source.getPlayer();

        if (player == null) {
            source.sendError(Text.literal("This command must be run by a player."));
            return 0;
        }

        AgentManager.getInstance().stopTask(player.getUuid());
        source.sendFeedback(() -> Text.literal("[Agent] Agent stopped and cleared."), false);

        return 1;
    }

    private static int showStatus(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        ServerPlayerEntity player = source.getPlayer();

        if (player == null) {
            source.sendError(Text.literal("This command must be run by a player."));
            return 0;
        }

        var status = AgentManager.getInstance().getStatus(player.getUuid());

        if (!status.hasSession()) {
            source.sendFeedback(() -> Text.literal("[Agent] No active agent session."), false);
            return 1;
        }

        StringBuilder sb = new StringBuilder("[Agent] Status:\n");
        sb.append("  Processing: ").append(status.isProcessing() ? "yes" : "no").append("\n");
        sb.append("  Pending blocks: ").append(status.pendingOperations()).append("\n");
        sb.append("  Total placed: ").append(status.blocksPlaced());

        if (status.lastError() != null) {
            sb.append("\n  Last error: ").append(status.lastError());
        }

        String statusText = sb.toString();
        source.sendFeedback(() -> Text.literal(statusText), false);

        return 1;
    }

    private static int showHelp(CommandContext<ServerCommandSource> context) {
        ServerCommandSource source = context.getSource();
        source.sendFeedback(() -> Text.literal(
            "[Agent] Rainbow AI Building Agent Commands:\n" +
            "  /rainbow agent setkey <key> - Set your Claude API key (BYOK)\n" +
            "  /rainbow agent removekey - Remove your API key\n" +
            "  /rainbow agent build <desc> - Start building with AI\n" +
            "  /rainbow agent stop - Stop current build task\n" +
            "  /rainbow agent status - Show agent status\n" +
            "\n" +
            "Get your API key at: console.anthropic.com"
        ), false);
        return 1;
    }
}
