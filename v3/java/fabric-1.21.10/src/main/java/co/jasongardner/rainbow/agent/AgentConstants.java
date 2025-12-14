package co.jasongardner.rainbow.agent;

/**
 * Constants for the AI voxel-building agent.
 */
public final class AgentConstants {
    private AgentConstants() {}

    // API Configuration
    public static final String CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
    public static final String CLAUDE_MODEL = "claude-sonnet-4-20250514";
    public static final String ANTHROPIC_VERSION = "2023-06-01";

    // Rate Limiting
    public static final int MAX_REQUESTS_PER_MINUTE = 20;
    public static final int MAX_TOKENS_PER_REQUEST = 4096;
    public static final int MAX_CONVERSATION_HISTORY = 20; // message pairs

    // Block Placement Limits (safety)
    public static final int MAX_BLOCKS_PER_OPERATION = 10000;
    public static final int MAX_REGION_SIZE = 64;  // blocks per axis
    public static final int MAX_DISTANCE_FROM_PLAYER = 128;

    // Tick Configuration
    public static final int TICK_INTERVAL = 1;  // Check every tick for pending operations
    public static final int BLOCKS_PER_TICK = 100;  // Batch placement to avoid lag

    // System Prompt
    public static final String SYSTEM_PROMPT = """
        You are a Minecraft building assistant for the Rainbow III mod. You help players
        build structures using colorful blocks. You have access to 980 rainbow blocks:
        - 14 colors: blue, brown, cyan, gray, green, light_blue, light_gray, lime,
          magenta, orange, pink, purple, red, yellow
        - 10 shades per color: 50 (lightest) to 900 (darkest)
        - 7 block types: block, lamp (emits light level 15), lamp_slab (light 14),
          lamp_stairs (light 15), glass (transparent), glass_slab, plate (metallic)

        Block IDs follow the pattern: rainbow:<color>_<shade>_<type>
        Examples: rainbow:blue_500_lamp, rainbow:red_300_glass, rainbow:lime_700_block

        When building, consider:
        - Color gradients using shade progression (50 lightest to 900 darkest)
        - Complementary colors for contrast (blue/orange, red/cyan, purple/yellow)
        - Lamps for lighting (lamp, lamp_slab, lamp_stairs emit light)
        - Glass for windows and transparent elements
        - Plates for metallic accents

        IMPORTANT: Always call get_player_info first to know where to build relative to the player.
        Use fill_region for large areas - it's more efficient than individual block placements.
        Coordinates are absolute world coordinates. Build near the player (within 128 blocks).

        Be creative with colors and shapes! Use gradients and patterns to make builds interesting.
        """;
}
