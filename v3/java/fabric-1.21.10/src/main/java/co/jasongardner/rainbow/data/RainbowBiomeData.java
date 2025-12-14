package co.jasongardner.rainbow.data;

import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;

/**
 * Computed biome properties for a color/shade combination.
 * Adapts the Bedrock colorSchemes.ts logic to Java Edition.
 */
public record RainbowBiomeData(
    Color color,
    Shade shade,
    BiomeClimateZone zone,
    float temperature,
    float downfall,
    int skyColor,
    int fogColor,
    int waterColor,
    int waterFogColor,
    int grassColor,
    int foliageColor
) {
    /**
     * Creates biome data for a color/shade combination with computed properties.
     */
    public static RainbowBiomeData create(Color color, Shade shade) {
        BiomeClimateZone zone = getZoneForColor(color);

        float temperature = zone.getTemperatureForShade(shade);
        float downfall = zone.getDownfallForShade(shade);

        int skyColor = zone.getSkyColor();
        int fogColor = zone.getFogColor();
        int waterColor = zone.getWaterColor();
        int waterFogColor = zone.getWaterFogColor();

        // Grass and foliage colors derived from the color itself
        int grassColor = getGrassColorForColor(color, shade);
        int foliageColor = getFoliageColorForColor(color, shade);

        return new RainbowBiomeData(
            color, shade, zone,
            temperature, downfall,
            skyColor, fogColor, waterColor, waterFogColor,
            grassColor, foliageColor
        );
    }

    /**
     * Gets the biome identifier string (e.g., "blue_500").
     */
    public String getBiomeId() {
        return color.getId() + "_" + shade.getValue();
    }

    /**
     * Determines whether this biome should have precipitation.
     */
    public boolean hasPrecipitation() {
        return temperature < 1.0f && downfall > 0.0f;
    }

    /**
     * Determines whether this biome can have snow.
     */
    public boolean canSnow() {
        return temperature < 0.15f;
    }

    /**
     * Maps a color to its climate zone based on Bedrock colorSchemes.ts.
     */
    public static BiomeClimateZone getZoneForColor(Color color) {
        return switch (color) {
            case RED, ORANGE, YELLOW -> BiomeClimateZone.WARM;
            case CYAN, LIGHT_BLUE, BLUE, PURPLE -> BiomeClimateZone.COOL;
            case LIME, GREEN, PINK, MAGENTA -> BiomeClimateZone.ACCENT;
            case BROWN, GRAY, LIGHT_GRAY -> BiomeClimateZone.NEUTRAL;
        };
    }

    /**
     * Generates a grass color based on the rainbow color.
     * Uses shade to adjust brightness.
     */
    private static int getGrassColorForColor(Color color, Shade shade) {
        // Base grass colors per color family
        int baseColor = switch (color) {
            case BLUE -> 0x5B8FB9;
            case BROWN -> 0x8B7355;
            case CYAN -> 0x5FAFB8;
            case GRAY -> 0x808080;
            case GREEN -> 0x4CAF50;
            case LIGHT_BLUE -> 0x87CEEB;
            case LIGHT_GRAY -> 0xA0A0A0;
            case LIME -> 0x7CB342;
            case MAGENTA -> 0xBA68C8;
            case ORANGE -> 0xE08040;
            case PINK -> 0xF48FB1;
            case PURPLE -> 0x9575CD;
            case RED -> 0xC94040;
            case YELLOW -> 0xCDDC39;
        };

        // Adjust brightness based on shade (lighter shades = brighter)
        return adjustBrightness(baseColor, shade);
    }

    /**
     * Generates a foliage color based on the rainbow color.
     */
    private static int getFoliageColorForColor(Color color, Shade shade) {
        // Foliage is slightly darker than grass
        int grassColor = getGrassColorForColor(color, shade);
        return darken(grassColor, 0.1f);
    }

    /**
     * Adjusts the brightness of a color based on shade level.
     */
    private static int adjustBrightness(int color, Shade shade) {
        // Normalize shade: 50 = brightest (1.2x), 900 = darkest (0.6x)
        float factor = 1.2f - ((shade.getValue() - 50) / 850.0f) * 0.6f;

        int r = Math.min(255, (int) (((color >> 16) & 0xFF) * factor));
        int g = Math.min(255, (int) (((color >> 8) & 0xFF) * factor));
        int b = Math.min(255, (int) ((color & 0xFF) * factor));

        return (r << 16) | (g << 8) | b;
    }

    /**
     * Darkens a color by a given factor.
     */
    private static int darken(int color, float amount) {
        float factor = 1.0f - amount;
        int r = (int) (((color >> 16) & 0xFF) * factor);
        int g = (int) (((color >> 8) & 0xFF) * factor);
        int b = (int) ((color & 0xFF) * factor);

        return (r << 16) | (g << 8) | b;
    }
}
