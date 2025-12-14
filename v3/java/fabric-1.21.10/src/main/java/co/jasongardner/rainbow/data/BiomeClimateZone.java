package co.jasongardner.rainbow.data;

/**
 * Climate zones for Rainbow biomes, ported from Bedrock colorSchemes.ts.
 * Each zone defines temperature and humidity ranges that affect biome properties.
 */
public enum BiomeClimateZone {
    /**
     * Warm zone: desert-like, dry, hot.
     * Colors: red, orange, yellow
     */
    WARM(0.8f, 1.2f, 0.0f, 0.3f, 0xFFE4B5, 0xFFDAB9, 0x40E0D0, 0x20B2AA),

    /**
     * Cool zone: oceanic, wet, cold.
     * Colors: cyan, light_blue, blue, purple
     */
    COOL(0.2f, 0.6f, 0.5f, 0.9f, 0xB0E0E6, 0xADD8E6, 0x4169E1, 0x191970),

    /**
     * Accent zone: lush, moderate.
     * Colors: lime, green, pink, magenta
     */
    ACCENT(0.6f, 1.0f, 0.4f, 0.7f, 0xE6E6FA, 0xDDA0DD, 0x00CED1, 0x008B8B),

    /**
     * Neutral zone: transitions, plains-like.
     * Colors: brown, gray, light_gray
     */
    NEUTRAL(0.4f, 0.8f, 0.3f, 0.6f, 0xD3D3D3, 0xC0C0C0, 0x708090, 0x2F4F4F);

    private final float minTemperature;
    private final float maxTemperature;
    private final float minDownfall;
    private final float maxDownfall;
    private final int skyColor;
    private final int fogColor;
    private final int waterColor;
    private final int waterFogColor;

    BiomeClimateZone(float minTemperature, float maxTemperature,
                     float minDownfall, float maxDownfall,
                     int skyColor, int fogColor,
                     int waterColor, int waterFogColor) {
        this.minTemperature = minTemperature;
        this.maxTemperature = maxTemperature;
        this.minDownfall = minDownfall;
        this.maxDownfall = maxDownfall;
        this.skyColor = skyColor;
        this.fogColor = fogColor;
        this.waterColor = waterColor;
        this.waterFogColor = waterFogColor;
    }

    public float getMinTemperature() {
        return minTemperature;
    }

    public float getMaxTemperature() {
        return maxTemperature;
    }

    public float getTemperatureRange() {
        return maxTemperature - minTemperature;
    }

    public float getMinDownfall() {
        return minDownfall;
    }

    public float getMaxDownfall() {
        return maxDownfall;
    }

    public float getDownfallRange() {
        return maxDownfall - minDownfall;
    }

    public int getSkyColor() {
        return skyColor;
    }

    public int getFogColor() {
        return fogColor;
    }

    public int getWaterColor() {
        return waterColor;
    }

    public int getWaterFogColor() {
        return waterFogColor;
    }

    /**
     * Calculate temperature for a given shade within this zone.
     * Lighter shades (50) = cooler end of range.
     * Darker shades (900) = warmer end of range.
     */
    public float getTemperatureForShade(RainbowColors.Shade shade) {
        float normalized = (shade.getValue() - 50) / 850.0f;
        return minTemperature + normalized * getTemperatureRange();
    }

    /**
     * Calculate downfall for a given shade within this zone.
     * Lighter shades (50) = drier end of range.
     * Darker shades (900) = wetter end of range.
     */
    public float getDownfallForShade(RainbowColors.Shade shade) {
        float normalized = (shade.getValue() - 50) / 850.0f;
        return minDownfall + normalized * getDownfallRange();
    }
}
