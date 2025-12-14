package co.jasongardner.rainbow.agent.tools;

import co.jasongardner.rainbow.agent.AgentConstants;
import co.jasongardner.rainbow.agent.AgentSession;
import co.jasongardner.rainbow.agent.AgentSession.BlockOperation;
import com.google.gson.JsonObject;
import net.minecraft.util.math.BlockPos;

/**
 * Tool for filling a cuboid region with blocks.
 */
public class FillRegionTool implements AgentTool {
    private final AgentSession session;

    public FillRegionTool(AgentSession session) {
        this.session = session;
    }

    @Override
    public String getName() {
        return "fill_region";
    }

    @Override
    public ToolResult execute(JsonObject input) {
        try {
            int x1 = input.get("x1").getAsInt();
            int y1 = input.get("y1").getAsInt();
            int z1 = input.get("z1").getAsInt();
            int x2 = input.get("x2").getAsInt();
            int y2 = input.get("y2").getAsInt();
            int z2 = input.get("z2").getAsInt();
            String blockId = input.get("block_id").getAsString();
            boolean hollow = input.has("hollow") && input.get("hollow").getAsBoolean();

            // Normalize coordinates
            int minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
            int minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
            int minZ = Math.min(z1, z2), maxZ = Math.max(z1, z2);

            // Check region size limits
            int sizeX = maxX - minX + 1;
            int sizeY = maxY - minY + 1;
            int sizeZ = maxZ - minZ + 1;

            if (sizeX > AgentConstants.MAX_REGION_SIZE ||
                sizeY > AgentConstants.MAX_REGION_SIZE ||
                sizeZ > AgentConstants.MAX_REGION_SIZE) {
                return ToolResult.error(String.format(
                    "Region too large. Maximum %d blocks per axis. Requested: %dx%dx%d",
                    AgentConstants.MAX_REGION_SIZE, sizeX, sizeY, sizeZ
                ));
            }

            int totalBlocks = sizeX * sizeY * sizeZ;
            if (totalBlocks > AgentConstants.MAX_BLOCKS_PER_OPERATION) {
                return ToolResult.error(String.format(
                    "Too many blocks (%d). Maximum %d per operation.",
                    totalBlocks, AgentConstants.MAX_BLOCKS_PER_OPERATION
                ));
            }

            // Queue all block placements
            int queued = 0;
            for (int x = minX; x <= maxX; x++) {
                for (int y = minY; y <= maxY; y++) {
                    for (int z = minZ; z <= maxZ; z++) {
                        // Skip interior for hollow
                        if (hollow &&
                            x > minX && x < maxX &&
                            y > minY && y < maxY &&
                            z > minZ && z < maxZ) {
                            continue;
                        }

                        session.queueBlockOperation(new BlockOperation(
                            new BlockPos(x, y, z),
                            blockId,
                            BlockOperation.OperationType.PLACE
                        ));
                        queued++;
                    }
                }
            }

            JsonObject result = new JsonObject();
            result.addProperty("success", true);
            result.addProperty("blocks_queued", queued);
            result.addProperty("message", String.format(
                "Queued %d blocks in region (%d,%d,%d) to (%d,%d,%d)%s",
                queued, minX, minY, minZ, maxX, maxY, maxZ,
                hollow ? " (hollow)" : ""
            ));

            return ToolResult.success(result);
        } catch (Exception e) {
            return ToolResult.error("Failed to fill region: " + e.getMessage());
        }
    }
}
