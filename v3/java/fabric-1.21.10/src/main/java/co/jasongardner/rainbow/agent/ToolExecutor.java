package co.jasongardner.rainbow.agent;

import co.jasongardner.rainbow.agent.tools.*;
import com.google.gson.JsonObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Routes tool calls to their implementations.
 */
public class ToolExecutor {
    private final Map<String, AgentTool> tools = new HashMap<>();
    private final AgentSession session;

    public ToolExecutor(AgentSession session) {
        this.session = session;

        // Register all tools
        registerTool(new PlaceBlockTool(session));
        registerTool(new FillRegionTool(session));
        registerTool(new GetBlocksTool(session));
        registerTool(new GetPlayerInfoTool(session));
        registerTool(new ListBlocksTool());
    }

    private void registerTool(AgentTool tool) {
        tools.put(tool.getName(), tool);
    }

    /**
     * Executes a tool by name with given input.
     */
    public ToolResult execute(String toolName, JsonObject input) {
        AgentTool tool = tools.get(toolName);
        if (tool == null) {
            return ToolResult.error("Unknown tool: " + toolName);
        }

        try {
            return tool.execute(input);
        } catch (Exception e) {
            return ToolResult.error("Tool execution failed: " + e.getMessage());
        }
    }

    /**
     * Checks if a tool exists.
     */
    public boolean hasTool(String toolName) {
        return tools.containsKey(toolName);
    }
}
