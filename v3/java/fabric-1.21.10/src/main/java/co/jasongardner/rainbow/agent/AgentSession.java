package co.jasongardner.rainbow.agent;

import co.jasongardner.rainbow.RainbowMod;
import co.jasongardner.rainbow.agent.tools.ToolResult;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import net.minecraft.block.Block;
import net.minecraft.block.Blocks;
import net.minecraft.registry.Registries;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.server.world.ServerWorld;
import net.minecraft.text.Text;
import net.minecraft.util.Identifier;
import net.minecraft.util.math.BlockPos;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Per-player agent session maintaining conversation history
 * and pending block operations.
 */
public class AgentSession {
    private static final Gson GSON = new Gson();

    private ServerWorld world;
    private ServerPlayerEntity player;

    // Conversation history for context
    private final List<JsonObject> conversationHistory = new ArrayList<>();

    // Pending block placement operations (queued for tick processing)
    private final Queue<BlockOperation> pendingOperations = new ArrayDeque<>();

    // State tracking
    private final AtomicBoolean isProcessing = new AtomicBoolean(false);
    private int totalBlocksPlaced = 0;
    private String lastError = null;
    private CompletableFuture<Void> currentTask = null;
    private String currentApiKey = null;

    // Services
    private final ClaudeService claudeService;
    private final ToolExecutor toolExecutor;

    public AgentSession(ServerWorld world, ServerPlayerEntity player) {
        this.world = world;
        this.player = player;
        this.claudeService = new ClaudeService();
        this.toolExecutor = new ToolExecutor(this);
    }

    /**
     * Submits a new prompt to Claude API asynchronously.
     */
    public void submitPrompt(String apiKey, String prompt) {
        if (isProcessing.get()) {
            player.sendMessage(Text.literal("[Agent] Already processing a request. Please wait."));
            return;
        }

        isProcessing.set(true);
        currentApiKey = apiKey;
        lastError = null;
        player.sendMessage(Text.literal("[Agent] Processing: " + prompt));

        // Add user message to history
        addUserMessage(prompt);

        // Start async API call
        currentTask = claudeService.sendMessage(apiKey, conversationHistory)
            .thenAccept(this::handleResponse)
            .exceptionally(this::handleError);
    }

    /**
     * Handles Claude API response, executing tools as needed.
     */
    private void handleResponse(JsonObject response) {
        // Check for error response
        if (response.has("error") && response.get("error").getAsBoolean()) {
            int status = response.has("status") ? response.get("status").getAsInt() : 0;
            String body = response.has("body") ? response.get("body").getAsString() : "Unknown error";

            String errorMsg;
            if (status == 401) {
                errorMsg = "Invalid API key. Use /rainbow agent setkey <key> to set a valid key.";
            } else if (status == 429) {
                errorMsg = "Rate limited by Claude API. Please wait and try again.";
            } else if (status == 400) {
                errorMsg = "Bad request: " + body;
            } else {
                errorMsg = "API error (status " + status + "): " + body;
            }

            lastError = errorMsg;
            isProcessing.set(false);
            sendPlayerMessage("[Agent Error] " + errorMsg);
            return;
        }

        // Add assistant response to history
        addAssistantMessage(response);

        // Check for content array
        if (!response.has("content")) {
            lastError = "Invalid response from API";
            isProcessing.set(false);
            sendPlayerMessage("[Agent Error] Invalid response from API");
            return;
        }

        JsonArray content = response.getAsJsonArray("content");
        List<JsonObject> toolResults = new ArrayList<>();

        for (var element : content) {
            JsonObject block = element.getAsJsonObject();
            String type = block.get("type").getAsString();

            if ("tool_use".equals(type)) {
                String toolId = block.get("id").getAsString();
                String toolName = block.get("name").getAsString();
                JsonObject input = block.getAsJsonObject("input");

                RainbowMod.LOGGER.debug("Executing tool: {} with input: {}", toolName, input);

                // Execute tool and get result
                ToolResult result = toolExecutor.execute(toolName, input);

                // Collect tool result for response
                JsonObject toolResult = new JsonObject();
                toolResult.addProperty("type", "tool_result");
                toolResult.addProperty("tool_use_id", toolId);
                toolResult.addProperty("content", result.toJsonString());
                if (!result.success()) {
                    toolResult.addProperty("is_error", true);
                }
                toolResults.add(toolResult);

            } else if ("text".equals(type)) {
                // Send text response to player
                String text = block.get("text").getAsString();
                sendPlayerMessage("[Agent] " + text);
            }
        }

        // Check stop_reason
        String stopReason = response.has("stop_reason") ?
            response.get("stop_reason").getAsString() : "end_turn";

        if ("tool_use".equals(stopReason) && !toolResults.isEmpty()) {
            // Add tool results and continue conversation
            addToolResults(toolResults);
            continueConversation();
        } else {
            // Conversation complete
            isProcessing.set(false);
            if (pendingOperations.isEmpty()) {
                sendPlayerMessage("[Agent] Build task completed.");
            } else {
                sendPlayerMessage("[Agent] Build queued. " + pendingOperations.size() + " blocks pending.");
            }
        }
    }

    /**
     * Continues multi-turn conversation after tool execution.
     */
    private void continueConversation() {
        if (currentApiKey == null) {
            lastError = "No API key available";
            isProcessing.set(false);
            return;
        }

        currentTask = claudeService.sendMessage(currentApiKey, conversationHistory)
            .thenAccept(this::handleResponse)
            .exceptionally(this::handleError);
    }

    /**
     * Handles API errors.
     */
    private Void handleError(Throwable error) {
        isProcessing.set(false);

        String message;
        Throwable cause = error.getCause() != null ? error.getCause() : error;

        if (cause instanceof java.net.http.HttpTimeoutException) {
            message = "Request timed out. Please try again.";
        } else if (cause instanceof java.net.ConnectException) {
            message = "Could not connect to Claude API. Check your internet connection.";
        } else {
            message = "Error: " + cause.getMessage();
        }

        lastError = message;
        sendPlayerMessage("[Agent Error] " + message);
        RainbowMod.LOGGER.error("Agent API error", error);

        return null;
    }

    /**
     * Called every tick to process pending block operations.
     */
    public void tick() {
        if (pendingOperations.isEmpty()) return;

        int processed = 0;
        while (!pendingOperations.isEmpty() &&
               processed < AgentConstants.BLOCKS_PER_TICK) {
            BlockOperation op = pendingOperations.poll();
            if (op != null) {
                executeBlockOperation(op);
                processed++;
            }
        }

        totalBlocksPlaced += processed;
    }

    /**
     * Queues a block placement operation.
     */
    public void queueBlockOperation(BlockOperation operation) {
        // Validate distance from player
        if (player != null) {
            BlockPos playerPos = player.getBlockPos();
            if (operation.pos().getManhattanDistance(playerPos) >
                AgentConstants.MAX_DISTANCE_FROM_PLAYER) {
                return; // Silently skip out-of-range blocks
            }
        }

        pendingOperations.add(operation);
    }

    /**
     * Executes a single block operation.
     */
    private void executeBlockOperation(BlockOperation op) {
        if (world == null) return;

        try {
            Block block;
            if (op.type() == BlockOperation.OperationType.REMOVE) {
                block = Blocks.AIR;
            } else {
                block = getBlockFromId(op.blockId());
            }

            world.setBlockState(op.pos(), block.getDefaultState());
        } catch (Exception e) {
            // Silently ignore errors (unloaded chunks, etc.)
            RainbowMod.LOGGER.debug("Failed to place block at {}: {}", op.pos(), e.getMessage());
        }
    }

    /**
     * Gets a block from its ID string.
     */
    private Block getBlockFromId(String blockId) {
        Identifier id = Identifier.tryParse(blockId);
        if (id != null) {
            Block block = Registries.BLOCK.get(id);
            if (block != Blocks.AIR || blockId.equals("minecraft:air")) {
                return block;
            }
        }
        RainbowMod.LOGGER.warn("Unknown block ID: {}", blockId);
        return Blocks.STONE; // Fallback
    }

    /**
     * Sends a message to the player safely.
     */
    private void sendPlayerMessage(String message) {
        if (player != null) {
            player.sendMessage(Text.literal(message));
        }
    }

    // Message history helpers
    private void addUserMessage(String content) {
        JsonObject msg = new JsonObject();
        msg.addProperty("role", "user");
        msg.addProperty("content", content);
        conversationHistory.add(msg);
        trimHistory();
    }

    private void addAssistantMessage(JsonObject response) {
        if (!response.has("content")) return;

        JsonObject msg = new JsonObject();
        msg.addProperty("role", "assistant");
        msg.add("content", response.get("content"));
        conversationHistory.add(msg);
        trimHistory();
    }

    private void addToolResults(List<JsonObject> results) {
        JsonObject msg = new JsonObject();
        msg.addProperty("role", "user");
        JsonArray content = new JsonArray();
        for (JsonObject result : results) {
            content.add(result);
        }
        msg.add("content", content);
        conversationHistory.add(msg);
        trimHistory();
    }

    private void trimHistory() {
        // Keep conversation under max size (messages come in pairs roughly)
        while (conversationHistory.size() > AgentConstants.MAX_CONVERSATION_HISTORY * 2) {
            conversationHistory.remove(0);
        }
    }

    /**
     * Stops the current task and clears pending operations.
     */
    public void stop() {
        if (currentTask != null) {
            currentTask.cancel(true);
        }
        isProcessing.set(false);
        pendingOperations.clear();
        conversationHistory.clear();
        currentApiKey = null;
    }

    // Getters/setters
    public ServerWorld getWorld() { return world; }
    public void setWorld(ServerWorld world) { this.world = world; }
    public ServerPlayerEntity getPlayer() { return player; }
    public void setPlayer(ServerPlayerEntity player) { this.player = player; }
    public int getPendingOperationCount() { return pendingOperations.size(); }
    public int getTotalBlocksPlaced() { return totalBlocksPlaced; }
    public boolean isProcessing() { return isProcessing.get(); }
    public String getLastError() { return lastError; }

    /**
     * Block operation to be executed on main thread.
     */
    public record BlockOperation(
        BlockPos pos,
        String blockId,
        OperationType type
    ) {
        public enum OperationType {
            PLACE,
            REMOVE
        }
    }
}
