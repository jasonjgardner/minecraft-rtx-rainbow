package co.jasongardner.rainbow.agent.tools;

import com.google.gson.JsonObject;

/**
 * Interface for AI agent tools that can be called by Claude.
 */
public interface AgentTool {
    /**
     * Gets the tool name as used in Claude API.
     */
    String getName();

    /**
     * Executes the tool with the given input.
     * @param input JSON object containing tool parameters
     * @return Result of the tool execution
     */
    ToolResult execute(JsonObject input);
}
