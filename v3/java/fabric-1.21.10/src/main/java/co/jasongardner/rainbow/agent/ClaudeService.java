package co.jasongardner.rainbow.agent;

import co.jasongardner.rainbow.RainbowMod;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Async HTTP client for Claude API with tool definitions.
 */
public class ClaudeService {
    private static final Gson GSON = new Gson();

    private final HttpClient httpClient;

    public ClaudeService() {
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
    }

    /**
     * Sends a message to Claude API asynchronously.
     * @param apiKey The user's Claude API key
     * @param messages Conversation history
     * @return CompletableFuture with the response
     */
    public CompletableFuture<JsonObject> sendMessage(
        String apiKey,
        List<JsonObject> messages
    ) {
        JsonObject requestBody = buildRequestBody(messages);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(AgentConstants.CLAUDE_API_URL))
            .header("Content-Type", "application/json")
            .header("x-api-key", apiKey)
            .header("anthropic-version", AgentConstants.ANTHROPIC_VERSION)
            .POST(HttpRequest.BodyPublishers.ofString(GSON.toJson(requestBody)))
            .timeout(Duration.ofSeconds(120))
            .build();

        RainbowMod.LOGGER.debug("Sending request to Claude API...");

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenApply(this::parseResponse);
    }

    /**
     * Builds the request body with system prompt and tools.
     */
    private JsonObject buildRequestBody(List<JsonObject> messages) {
        JsonObject body = new JsonObject();
        body.addProperty("model", AgentConstants.CLAUDE_MODEL);
        body.addProperty("max_tokens", AgentConstants.MAX_TOKENS_PER_REQUEST);
        body.addProperty("system", AgentConstants.SYSTEM_PROMPT);

        // Add messages
        JsonArray messagesArray = new JsonArray();
        for (JsonObject msg : messages) {
            messagesArray.add(msg);
        }
        body.add("messages", messagesArray);

        // Add tool definitions
        body.add("tools", getToolDefinitions());

        return body;
    }

    /**
     * Parses API response, handling errors.
     */
    private JsonObject parseResponse(HttpResponse<String> response) {
        RainbowMod.LOGGER.debug("Received response: status={}", response.statusCode());

        if (response.statusCode() != 200) {
            JsonObject error = new JsonObject();
            error.addProperty("error", true);
            error.addProperty("status", response.statusCode());
            error.addProperty("body", response.body());

            // Parse error details if available
            try {
                JsonObject errorBody = GSON.fromJson(response.body(), JsonObject.class);
                if (errorBody.has("error")) {
                    error.add("error_details", errorBody.get("error"));
                }
            } catch (Exception e) {
                // Ignore parsing errors
            }

            return error;
        }

        return GSON.fromJson(response.body(), JsonObject.class);
    }

    /**
     * Returns tool definitions for Claude API.
     */
    private JsonArray getToolDefinitions() {
        JsonArray tools = new JsonArray();

        // place_block tool
        tools.add(createTool(
            "place_block",
            "Places a single block at the specified coordinates. Use fill_region for larger areas.",
            createInputSchema(
                prop("x", "integer", "X coordinate (world position)"),
                prop("y", "integer", "Y coordinate (world position)"),
                prop("z", "integer", "Z coordinate (world position)"),
                prop("block_id", "string",
                    "Block ID (e.g., 'rainbow:blue_500_lamp' or 'minecraft:stone')")
            ),
            new String[]{"x", "y", "z", "block_id"}
        ));

        // fill_region tool
        tools.add(createTool(
            "fill_region",
            "Fills a cuboid region with blocks. More efficient than placing blocks individually. Use hollow=true for shells.",
            createInputSchema(
                prop("x1", "integer", "First corner X coordinate"),
                prop("y1", "integer", "First corner Y coordinate"),
                prop("z1", "integer", "First corner Z coordinate"),
                prop("x2", "integer", "Second corner X coordinate"),
                prop("y2", "integer", "Second corner Y coordinate"),
                prop("z2", "integer", "Second corner Z coordinate"),
                prop("block_id", "string", "Block ID to fill with"),
                prop("hollow", "boolean", "If true, only fills the outer shell (default: false)")
            ),
            new String[]{"x1", "y1", "z1", "x2", "y2", "z2", "block_id"}
        ));

        // get_blocks tool
        tools.add(createTool(
            "get_blocks",
            "Reads blocks in a region. Returns a 3D array of block IDs. Limited to 16x16x16 for performance.",
            createInputSchema(
                prop("x1", "integer", "First corner X coordinate"),
                prop("y1", "integer", "First corner Y coordinate"),
                prop("z1", "integer", "First corner Z coordinate"),
                prop("x2", "integer", "Second corner X coordinate"),
                prop("y2", "integer", "Second corner Y coordinate"),
                prop("z2", "integer", "Second corner Z coordinate")
            ),
            new String[]{"x1", "y1", "z1", "x2", "y2", "z2"}
        ));

        // get_player_info tool
        tools.add(createTool(
            "get_player_info",
            "Gets the player's current position, facing direction, and dimension. Call this first to know where to build!",
            createInputSchema(),
            new String[]{}
        ));

        // list_rainbow_blocks tool
        tools.add(createTool(
            "list_rainbow_blocks",
            "Lists available rainbow block types with their IDs and properties. Use filters to narrow results.",
            createInputSchema(
                prop("color", "string", "Optional: filter by color (e.g., 'blue', 'red')"),
                prop("type", "string", "Optional: filter by type (e.g., 'lamp', 'glass', 'block')")
            ),
            new String[]{}
        ));

        return tools;
    }

    /**
     * Creates a tool definition object.
     */
    private JsonObject createTool(String name, String description, JsonObject inputSchema, String[] required) {
        JsonObject tool = new JsonObject();
        tool.addProperty("name", name);
        tool.addProperty("description", description);

        // Add required array to schema
        JsonArray requiredArray = new JsonArray();
        for (String req : required) {
            requiredArray.add(req);
        }
        inputSchema.add("required", requiredArray);

        tool.add("input_schema", inputSchema);
        return tool;
    }

    /**
     * Creates an input schema with the given properties.
     */
    private JsonObject createInputSchema(JsonObject... properties) {
        JsonObject schema = new JsonObject();
        schema.addProperty("type", "object");

        JsonObject props = new JsonObject();
        for (JsonObject prop : properties) {
            String name = prop.get("name").getAsString();
            JsonObject propDef = new JsonObject();
            propDef.addProperty("type", prop.get("type").getAsString());
            propDef.addProperty("description", prop.get("description").getAsString());
            props.add(name, propDef);
        }
        schema.add("properties", props);

        return schema;
    }

    /**
     * Creates a property definition.
     */
    private JsonObject prop(String name, String type, String description) {
        JsonObject prop = new JsonObject();
        prop.addProperty("name", name);
        prop.addProperty("type", type);
        prop.addProperty("description", description);
        return prop;
    }
}
