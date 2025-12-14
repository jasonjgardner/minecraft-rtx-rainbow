package co.jasongardner.rainbow.data;

import net.minecraft.block.MapColor;

/**
 * Defines the 14 color families and 10 shade levels used throughout Rainbow III.
 * Each combination creates a unique block variant (14 colors x 10 shades = 140 base variants).
 */
public class RainbowColors {

    /**
     * The 14 color families available in Rainbow III.
     */
    public enum Color {
        BLUE("blue", MapColor.BLUE),
        BROWN("brown", MapColor.BROWN),
        CYAN("cyan", MapColor.CYAN),
        GRAY("gray", MapColor.GRAY),
        GREEN("green", MapColor.GREEN),
        LIGHT_BLUE("light_blue", MapColor.LIGHT_BLUE),
        LIGHT_GRAY("light_gray", MapColor.LIGHT_GRAY),
        LIME("lime", MapColor.LIME),
        MAGENTA("magenta", MapColor.MAGENTA),
        ORANGE("orange", MapColor.ORANGE),
        PINK("pink", MapColor.PINK),
        PURPLE("purple", MapColor.PURPLE),
        RED("red", MapColor.RED),
        YELLOW("yellow", MapColor.YELLOW);

        private final String id;
        private final MapColor mapColor;

        Color(String id, MapColor mapColor) {
            this.id = id;
            this.mapColor = mapColor;
        }

        public String getId() {
            return id;
        }

        public MapColor getMapColor() {
            return mapColor;
        }

        /**
         * Gets a human-readable display name for this color.
         */
        public String getDisplayName() {
            return id.replace("_", " ");
        }

        /**
         * Gets the complementary color for palette generation.
         */
        public Color getComplementary() {
            return switch (this) {
                case BLUE -> ORANGE;
                case BROWN -> LIGHT_BLUE;
                case CYAN -> RED;
                case GRAY -> LIGHT_GRAY;
                case GREEN -> PINK;
                case LIGHT_BLUE -> BROWN;
                case LIGHT_GRAY -> GRAY;
                case LIME -> MAGENTA;
                case MAGENTA -> LIME;
                case ORANGE -> BLUE;
                case PINK -> GREEN;
                case PURPLE -> YELLOW;
                case RED -> CYAN;
                case YELLOW -> PURPLE;
            };
        }

        /**
         * Gets the climate zone for this color.
         * Based on Bedrock colorSchemes.ts COLOR_ZONES mapping.
         */
        public BiomeClimateZone getClimateZone() {
            return switch (this) {
                case RED, ORANGE, YELLOW -> BiomeClimateZone.WARM;
                case CYAN, LIGHT_BLUE, BLUE, PURPLE -> BiomeClimateZone.COOL;
                case LIME, GREEN, PINK, MAGENTA -> BiomeClimateZone.ACCENT;
                case BROWN, GRAY, LIGHT_GRAY -> BiomeClimateZone.NEUTRAL;
            };
        }

        /**
         * Gets adjacent colors on the hue wheel for biome transitions.
         */
        public Color[] getAdjacentColors() {
            return switch (this) {
                case RED -> new Color[]{PINK, ORANGE};
                case ORANGE -> new Color[]{RED, YELLOW};
                case YELLOW -> new Color[]{ORANGE, LIME};
                case LIME -> new Color[]{YELLOW, GREEN};
                case GREEN -> new Color[]{LIME, CYAN};
                case CYAN -> new Color[]{GREEN, LIGHT_BLUE};
                case LIGHT_BLUE -> new Color[]{CYAN, BLUE};
                case BLUE -> new Color[]{LIGHT_BLUE, PURPLE};
                case PURPLE -> new Color[]{BLUE, MAGENTA};
                case MAGENTA -> new Color[]{PURPLE, PINK};
                case PINK -> new Color[]{MAGENTA, RED};
                case BROWN -> new Color[]{GRAY, LIGHT_GRAY};
                case GRAY -> new Color[]{BROWN, LIGHT_GRAY};
                case LIGHT_GRAY -> new Color[]{GRAY, BROWN};
            };
        }
    }

    /**
     * The 10 shade levels from lightest (50) to darkest (900).
     */
    public enum Shade {
        S50(50),
        S100(100),
        S200(200),
        S300(300),
        S400(400),
        S500(500),
        S600(600),
        S700(700),
        S800(800),
        S900(900);

        private final int value;

        Shade(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }

        public String getId() {
            return String.valueOf(value);
        }

        /**
         * Gets the next lighter shade, wrapping to darkest if at lightest.
         */
        public Shade getLighter() {
            int ordinal = this.ordinal();
            if (ordinal == 0) {
                return S900;
            }
            return values()[ordinal - 1];
        }

        /**
         * Gets the next darker shade, wrapping to lightest if at darkest.
         */
        public Shade getDarker() {
            int ordinal = this.ordinal();
            if (ordinal == values().length - 1) {
                return S50;
            }
            return values()[ordinal + 1];
        }
    }

    /**
     * The 7 core block types in Rainbow III.
     */
    public enum BlockType {
        BLOCK("block", "Block", false, 0),
        LAMP("lamp", "Lamp", true, 15),
        LAMP_SLAB("lamp_slab", "Lamp Slab", true, 14),
        LAMP_STAIRS("lamp_stairs", "Lamp Stairs", true, 15),
        GLASS("glass", "Glass", false, 0),
        GLASS_SLAB("glass_slab", "Glass Slab", false, 0),
        PLATE("plate", "Plate", false, 0);

        private final String id;
        private final String displayName;
        private final boolean emissive;
        private final int lightLevel;

        BlockType(String id, String displayName, boolean emissive, int lightLevel) {
            this.id = id;
            this.displayName = displayName;
            this.emissive = emissive;
            this.lightLevel = lightLevel;
        }

        public String getId() {
            return id;
        }

        public String getDisplayName() {
            return displayName;
        }

        public boolean isEmissive() {
            return emissive;
        }

        public int getLightLevel() {
            return lightLevel;
        }

        public boolean isTransparent() {
            return this == GLASS || this == GLASS_SLAB;
        }

        public boolean isSlab() {
            return this == LAMP_SLAB || this == GLASS_SLAB;
        }

        public boolean isStairs() {
            return this == LAMP_STAIRS;
        }

        public boolean isMetallic() {
            return this == PLATE;
        }
    }

    /**
     * Generates a block ID from color, shade, and type.
     * Example: "blue_500_lamp"
     */
    public static String getBlockId(Color color, Shade shade, BlockType type) {
        return color.getId() + "_" + shade.getValue() + "_" + type.getId();
    }

    /**
     * Generates a translation key for a block.
     * Example: "block.rainbow.blue_500_lamp"
     */
    public static String getTranslationKey(Color color, Shade shade, BlockType type) {
        return "block.rainbow." + getBlockId(color, shade, type);
    }

    /**
     * Generates a human-readable display name for a block.
     * Example: "Blue 500 Lamp"
     */
    public static String getDisplayName(Color color, Shade shade, BlockType type) {
        String colorName = color.getDisplayName();
        // Capitalize first letter of each word
        String[] words = colorName.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!sb.isEmpty()) {
                sb.append(" ");
            }
            sb.append(Character.toUpperCase(word.charAt(0)));
            sb.append(word.substring(1));
        }
        return sb + " " + shade.getValue() + " " + type.getDisplayName();
    }

    /**
     * Gets the total number of block variants.
     */
    public static int getTotalBlockCount() {
        return Color.values().length * Shade.values().length * BlockType.values().length;
    }
}
