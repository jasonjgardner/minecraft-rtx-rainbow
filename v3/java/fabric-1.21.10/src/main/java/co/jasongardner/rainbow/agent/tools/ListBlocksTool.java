package co.jasongardner.rainbow.agent.tools;

import co.jasongardner.rainbow.data.RainbowColors;
import co.jasongardner.rainbow.data.RainbowColors.BlockType;
import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

/**
 * Tool for listing available rainbow blocks with optional filtering.
 */
public class ListBlocksTool implements AgentTool {

    @Override
    public String getName() {
        return "list_rainbow_blocks";
    }

    @Override
    public ToolResult execute(JsonObject input) {
        try {
            String filterColor = input.has("color") ?
                input.get("color").getAsString().toLowerCase() : null;
            String filterType = input.has("type") ?
                input.get("type").getAsString().toLowerCase() : null;

            JsonArray blocks = new JsonArray();

            for (Color color : Color.values()) {
                if (filterColor != null && !color.getId().contains(filterColor)) {
                    continue;
                }

                for (Shade shade : Shade.values()) {
                    for (BlockType type : BlockType.values()) {
                        if (filterType != null && !type.getId().contains(filterType)) {
                            continue;
                        }

                        JsonObject block = new JsonObject();
                        block.addProperty("id", "rainbow:" +
                            RainbowColors.getBlockId(color, shade, type));
                        block.addProperty("color", color.getId());
                        block.addProperty("shade", shade.getValue());
                        block.addProperty("type", type.getId());
                        block.addProperty("emits_light", type.isEmissive());
                        block.addProperty("light_level", type.getLightLevel());
                        block.addProperty("transparent", type.isTransparent());

                        blocks.add(block);
                    }
                }
            }

            JsonObject result = new JsonObject();
            result.add("blocks", blocks);
            result.addProperty("count", blocks.size());
            result.addProperty("total_available", RainbowColors.getTotalBlockCount());

            // Provide summary for easier use
            JsonObject summary = new JsonObject();

            JsonArray colors = new JsonArray();
            for (Color c : Color.values()) {
                colors.add(c.getId());
            }
            summary.add("colors", colors);

            JsonArray shades = new JsonArray();
            for (Shade s : Shade.values()) {
                shades.add(s.getValue());
            }
            summary.add("shades", shades);

            JsonArray types = new JsonArray();
            for (BlockType t : BlockType.values()) {
                JsonObject typeInfo = new JsonObject();
                typeInfo.addProperty("id", t.getId());
                typeInfo.addProperty("light_level", t.getLightLevel());
                typeInfo.addProperty("transparent", t.isTransparent());
                types.add(typeInfo);
            }
            summary.add("types", types);

            result.add("summary", summary);

            // Usage hint
            result.addProperty("usage", "Block IDs follow pattern: rainbow:<color>_<shade>_<type>");
            result.addProperty("example", "rainbow:blue_500_lamp, rainbow:red_300_glass");

            return ToolResult.success(result);
        } catch (Exception e) {
            return ToolResult.error("Failed to list blocks: " + e.getMessage());
        }
    }
}
