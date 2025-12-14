package co.jasongardner.rainbow.agent.tools;

import co.jasongardner.rainbow.agent.AgentSession;
import co.jasongardner.rainbow.agent.AgentSession.BlockOperation;
import com.google.gson.JsonObject;
import net.minecraft.util.math.BlockPos;

/**
 * Tool for placing a single block at specified coordinates.
 */
public class PlaceBlockTool implements AgentTool {
    private final AgentSession session;

    public PlaceBlockTool(AgentSession session) {
        this.session = session;
    }

    @Override
    public String getName() {
        return "place_block";
    }

    @Override
    public ToolResult execute(JsonObject input) {
        try {
            int x = input.get("x").getAsInt();
            int y = input.get("y").getAsInt();
            int z = input.get("z").getAsInt();
            String blockId = input.get("block_id").getAsString();

            BlockPos pos = new BlockPos(x, y, z);
            session.queueBlockOperation(new BlockOperation(
                pos, blockId, BlockOperation.OperationType.PLACE
            ));

            JsonObject result = new JsonObject();
            result.addProperty("success", true);
            result.addProperty("message", String.format(
                "Queued block placement: %s at (%d, %d, %d)", blockId, x, y, z
            ));

            return ToolResult.success(result);
        } catch (Exception e) {
            return ToolResult.error("Failed to place block: " + e.getMessage());
        }
    }
}
