package co.jasongardner.rainbow.agent.tools;

import co.jasongardner.rainbow.agent.AgentSession;
import com.google.gson.JsonObject;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.util.math.Direction;
import net.minecraft.util.math.Vec3d;

/**
 * Tool for getting player position, facing direction, and dimension.
 */
public class GetPlayerInfoTool implements AgentTool {
    private final AgentSession session;

    public GetPlayerInfoTool(AgentSession session) {
        this.session = session;
    }

    @Override
    public String getName() {
        return "get_player_info";
    }

    @Override
    public ToolResult execute(JsonObject input) {
        try {
            ServerPlayerEntity player = session.getPlayer();

            if (player == null) {
                return ToolResult.error("Player not found");
            }

            JsonObject result = new JsonObject();

            // Position (exact)
            JsonObject position = new JsonObject();
            position.addProperty("x", Math.round(player.getX() * 100) / 100.0);
            position.addProperty("y", Math.round(player.getY() * 100) / 100.0);
            position.addProperty("z", Math.round(player.getZ() * 100) / 100.0);
            result.add("position", position);

            // Block position (feet)
            JsonObject blockPos = new JsonObject();
            blockPos.addProperty("x", player.getBlockPos().getX());
            blockPos.addProperty("y", player.getBlockPos().getY());
            blockPos.addProperty("z", player.getBlockPos().getZ());
            result.add("block_position", blockPos);

            // Facing direction (cardinal)
            Direction facing = player.getHorizontalFacing();
            result.addProperty("facing", facing.getName());

            // Look direction (unit vector)
            Vec3d lookVec = player.getRotationVec(1.0f);
            JsonObject look = new JsonObject();
            look.addProperty("x", Math.round(lookVec.x * 100) / 100.0);
            look.addProperty("y", Math.round(lookVec.y * 100) / 100.0);
            look.addProperty("z", Math.round(lookVec.z * 100) / 100.0);
            result.add("look_direction", look);

            // Dimension
            result.addProperty("dimension",
                player.getWorld().getRegistryKey().getValue().toString());

            // Helpful hint for building
            result.addProperty("hint", String.format(
                "Build relative to player at (%d, %d, %d). Player is facing %s.",
                player.getBlockPos().getX(),
                player.getBlockPos().getY(),
                player.getBlockPos().getZ(),
                facing.getName()
            ));

            return ToolResult.success(result);
        } catch (Exception e) {
            return ToolResult.error("Failed to get player info: " + e.getMessage());
        }
    }
}
