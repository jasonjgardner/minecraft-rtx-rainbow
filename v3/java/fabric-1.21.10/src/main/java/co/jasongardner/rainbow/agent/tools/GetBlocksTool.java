package co.jasongardner.rainbow.agent.tools;

import co.jasongardner.rainbow.agent.AgentSession;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import net.minecraft.block.BlockState;
import net.minecraft.registry.Registries;
import net.minecraft.util.math.BlockPos;

/**
 * Tool for reading blocks in a region.
 */
public class GetBlocksTool implements AgentTool {
    private static final int MAX_SCAN_SIZE = 16; // Limit scan to 16x16x16 for performance
    private final AgentSession session;

    public GetBlocksTool(AgentSession session) {
        this.session = session;
    }

    @Override
    public String getName() {
        return "get_blocks";
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

            // Normalize and limit
            int minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
            int minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
            int minZ = Math.min(z1, z2), maxZ = Math.max(z1, z2);

            // Limit to MAX_SCAN_SIZE for performance
            int limitedMaxX = Math.min(maxX, minX + MAX_SCAN_SIZE - 1);
            int limitedMaxY = Math.min(maxY, minY + MAX_SCAN_SIZE - 1);
            int limitedMaxZ = Math.min(maxZ, minZ + MAX_SCAN_SIZE - 1);

            boolean wasTruncated = (limitedMaxX < maxX || limitedMaxY < maxY || limitedMaxZ < maxZ);

            JsonArray blocks = new JsonArray();
            for (int x = minX; x <= limitedMaxX; x++) {
                JsonArray xLayer = new JsonArray();
                for (int y = minY; y <= limitedMaxY; y++) {
                    JsonArray yLayer = new JsonArray();
                    for (int z = minZ; z <= limitedMaxZ; z++) {
                        BlockPos pos = new BlockPos(x, y, z);
                        BlockState state = session.getWorld().getBlockState(pos);
                        String blockId = Registries.BLOCK.getId(state.getBlock()).toString();
                        yLayer.add(blockId);
                    }
                    xLayer.add(yLayer);
                }
                blocks.add(xLayer);
            }

            JsonObject result = new JsonObject();
            result.add("blocks", blocks);
            result.addProperty("min_x", minX);
            result.addProperty("min_y", minY);
            result.addProperty("min_z", minZ);
            result.addProperty("max_x", limitedMaxX);
            result.addProperty("max_y", limitedMaxY);
            result.addProperty("max_z", limitedMaxZ);

            if (wasTruncated) {
                result.addProperty("truncated", true);
                result.addProperty("note", String.format(
                    "Region was truncated to %dx%dx%d maximum",
                    MAX_SCAN_SIZE, MAX_SCAN_SIZE, MAX_SCAN_SIZE
                ));
            }

            return ToolResult.success(result);
        } catch (Exception e) {
            return ToolResult.error("Failed to get blocks: " + e.getMessage());
        }
    }
}
