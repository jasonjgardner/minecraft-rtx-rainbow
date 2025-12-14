package co.jasongardner.rainbow.agent.tools;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * Result of a tool execution.
 */
public record ToolResult(
    boolean success,
    JsonElement content,
    boolean requiresContinuation
) {
    /**
     * Creates a successful result that requires Claude to continue processing.
     */
    public static ToolResult success(JsonElement content) {
        return new ToolResult(true, content, true);
    }

    /**
     * Creates a successful result with a simple message.
     */
    public static ToolResult success(String message) {
        JsonObject obj = new JsonObject();
        obj.addProperty("success", true);
        obj.addProperty("message", message);
        return new ToolResult(true, obj, true);
    }

    /**
     * Creates an error result.
     */
    public static ToolResult error(String message) {
        JsonObject obj = new JsonObject();
        obj.addProperty("error", message);
        return new ToolResult(false, obj, true);
    }

    /**
     * Creates a successful result that does not require continuation.
     */
    public static ToolResult successNoFollow(JsonElement content) {
        return new ToolResult(true, content, false);
    }

    /**
     * Gets the content as a JSON string for the Claude API.
     */
    public String toJsonString() {
        return content.toString();
    }
}
