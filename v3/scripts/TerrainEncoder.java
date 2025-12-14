/**
 * WorldPainter .terrain File Encoder
 * 
 * Creates MixedMaterial terrain files for use in WorldPainter.
 * Output: GZIP-compressed Java ObjectOutputStream serialization of MixedMaterial objects.
 * 
 * Usage: java -cp "worldpainter-core.jar:." TerrainEncoder [output-dir]
 * 
 * @see https://www.worldpainter.net/javadoc/org/pepsoft/worldpainter/MixedMaterial.html
 */

import org.pepsoft.minecraft.Material;
import org.pepsoft.worldpainter.MixedMaterial;
import org.pepsoft.worldpainter.MixedMaterial.Mode;
import org.pepsoft.worldpainter.MixedMaterial.Row;
import org.pepsoft.worldpainter.NoiseSettings;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.zip.GZIPOutputStream;

public class TerrainEncoder {

    private static final int DEFAULT_BIOME = -1;
    private static final Path OUTPUT_DIR = Path.of("terrain-output");

    public static void main(String[] args) throws IOException {
        Path outputDir = args.length > 0 ? Path.of(args[0]) : OUTPUT_DIR;
        Files.createDirectories(outputDir);

        System.out.println("=== WorldPainter Terrain Encoder ===");
        System.out.println("Output directory: " + outputDir.toAbsolutePath());

        generateRainbowTerrains(outputDir);
        generateGradientTerrains(outputDir);
        generateLayeredTerrains(outputDir);
        generateNoisyTerrains(outputDir);
        generateCustomTerrains(outputDir);

        System.out.println("\n✓ All terrain files generated successfully!");
    }

    /**
     * Saves a MixedMaterial to a .terrain file (GZIP + ObjectOutputStream)
     */
    public static void saveTerrain(MixedMaterial material, Path outputPath) throws IOException {
        try (GZIPOutputStream gzip = new GZIPOutputStream(Files.newOutputStream(outputPath));
             ObjectOutputStream oos = new ObjectOutputStream(gzip)) {
            oos.writeObject(material);
        }
        System.out.println("  → " + outputPath.getFileName());
    }

    /**
     * Creates a simple single-material terrain
     */
    public static MixedMaterial createSimple(String name, Material material, Integer color) {
        Row row = new Row(material, 1, 1.0f);
        return new MixedMaterial(name, row, DEFAULT_BIOME, color);
    }

    /**
     * Creates a layered terrain with multiple materials stacked vertically
     */
    public static MixedMaterial createLayered(String name, List<LayerEntry> layers, Integer color) {
        Row[] rows = layers.stream()
            .map(e -> new Row(e.material, e.thickness, 1.0f))
            .toArray(Row[]::new);

        return new MixedMaterial(name, rows, DEFAULT_BIOME, color, null, 0.0, 0.0, true);
    }

    /**
     * Creates a noisy/blobby terrain with random material distribution
     */
    public static MixedMaterial createNoisy(String name, List<MaterialWeight> materials, 
                                            Integer color, float scale) {
        Row[] rows = materials.stream()
            .map(m -> new Row(m.material, m.weight, m.scale))
            .toArray(Row[]::new);

        return new MixedMaterial(name, rows, DEFAULT_BIOME, color, scale);
    }

    /**
     * Creates a layered terrain with noise variation
     */
    public static MixedMaterial createLayeredWithNoise(String name, List<LayerEntry> layers,
                                                        Integer color, NoiseSettings noise,
                                                        double xSlope, double ySlope, boolean repeat) {
        Row[] rows = layers.stream()
            .map(e -> new Row(e.material, e.thickness, 1.0f))
            .toArray(Row[]::new);

        return new MixedMaterial(name, rows, DEFAULT_BIOME, color, noise, xSlope, ySlope, repeat);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Rainbow Block Terrains
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateRainbowTerrains(Path dir) throws IOException {
        System.out.println("\n[Rainbow Terrains]");
        Path rainbowDir = dir.resolve("rainbow");
        Files.createDirectories(rainbowDir);

        String[] colors = {"red", "orange", "yellow", "lime", "green", "cyan", 
                          "light_blue", "blue", "purple", "magenta", "pink", "white",
                          "light_gray", "gray", "black", "brown"};

        // Individual color terrains
        for (String color : colors) {
            Material concrete = Material.get("minecraft:" + color + "_concrete");
            Material wool = Material.get("minecraft:" + color + "_wool");
            Material glass = Material.get("minecraft:" + color + "_stained_glass");
            Material terracotta = Material.get("minecraft:" + color + "_terracotta");
            Material glazedTerracotta = Material.get("minecraft:" + color + "_glazed_terracotta");

            if (concrete != null) {
                saveTerrain(createSimple(color + "_concrete", concrete, getColorValue(color)),
                    rainbowDir.resolve(color + "_concrete.terrain"));
            }
            if (wool != null) {
                saveTerrain(createSimple(color + "_wool", wool, getColorValue(color)),
                    rainbowDir.resolve(color + "_wool.terrain"));
            }
            if (terracotta != null) {
                saveTerrain(createSimple(color + "_terracotta", terracotta, getColorValue(color)),
                    rainbowDir.resolve(color + "_terracotta.terrain"));
            }
        }

        // Rainbow stripe layered terrain
        List<LayerEntry> rainbowLayers = new ArrayList<>();
        String[] stripeColors = {"red", "orange", "yellow", "lime", "cyan", "blue", "purple"};
        for (String c : stripeColors) {
            Material mat = Material.get("minecraft:" + c + "_concrete");
            if (mat != null) {
                rainbowLayers.add(new LayerEntry(mat, 2));
            }
        }
        if (!rainbowLayers.isEmpty()) {
            saveTerrain(createLayered("rainbow_stripes", rainbowLayers, 0xFF0000),
                rainbowDir.resolve("rainbow_stripes.terrain"));
        }

        // Rainbow noisy blend
        List<MaterialWeight> rainbowBlend = new ArrayList<>();
        for (String c : stripeColors) {
            Material mat = Material.get("minecraft:" + c + "_concrete");
            if (mat != null) {
                rainbowBlend.add(new MaterialWeight(mat, 100, 1.0f));
            }
        }
        if (!rainbowBlend.isEmpty()) {
            saveTerrain(createNoisy("rainbow_blend", rainbowBlend, 0xFF00FF, 50.0f),
                rainbowDir.resolve("rainbow_blend.terrain"));
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Gradient Terrains (depth-based color transitions)
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateGradientTerrains(Path dir) throws IOException {
        System.out.println("\n[Gradient Terrains]");
        Path gradientDir = dir.resolve("gradients");
        Files.createDirectories(gradientDir);

        // Ocean depth gradient (light blue → blue → dark blue)
        saveTerrain(createLayered("ocean_depth", List.of(
            new LayerEntry(Material.get("minecraft:light_blue_concrete"), 8),
            new LayerEntry(Material.get("minecraft:blue_concrete"), 8),
            new LayerEntry(Material.get("minecraft:blue_terracotta"), 8),
            new LayerEntry(Material.get("minecraft:black_concrete"), 4)
        ), 0x0066CC), gradientDir.resolve("ocean_depth.terrain"));

        // Sunset gradient
        saveTerrain(createLayered("sunset", List.of(
            new LayerEntry(Material.get("minecraft:yellow_concrete"), 4),
            new LayerEntry(Material.get("minecraft:orange_concrete"), 4),
            new LayerEntry(Material.get("minecraft:red_concrete"), 4),
            new LayerEntry(Material.get("minecraft:magenta_concrete"), 4),
            new LayerEntry(Material.get("minecraft:purple_concrete"), 4),
            new LayerEntry(Material.get("minecraft:blue_concrete"), 8)
        ), 0xFF6600), gradientDir.resolve("sunset.terrain"));

        // Forest floor gradient
        saveTerrain(createLayered("forest_floor", List.of(
            new LayerEntry(Material.GRASS_BLOCK, 1),
            new LayerEntry(Material.DIRT, 3),
            new LayerEntry(Material.COARSE_DIRT, 2),
            new LayerEntry(Material.GRAVEL, 2),
            new LayerEntry(Material.STONE, 20)
        ), 0x228B22), gradientDir.resolve("forest_floor.terrain"));

        // Volcanic gradient
        saveTerrain(createLayered("volcanic", List.of(
            new LayerEntry(Material.BASALT, 4),
            new LayerEntry(Material.BLACKSTONE, 6),
            new LayerEntry(Material.MAGMA, 2),
            new LayerEntry(Material.NETHERRACK, 8),
            new LayerEntry(Material.OBSIDIAN, 4)
        ), 0x8B0000), gradientDir.resolve("volcanic.terrain"));

        // Ice gradient
        saveTerrain(createLayered("ice_depth", List.of(
            new LayerEntry(Material.SNOW_BLOCK, 2),
            new LayerEntry(Material.PACKED_ICE, 6),
            new LayerEntry(Material.BLUE_ICE, 8),
            new LayerEntry(Material.get("minecraft:light_blue_concrete"), 4)
        ), 0xADD8E6), gradientDir.resolve("ice_depth.terrain"));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Layered Natural Terrains
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateLayeredTerrains(Path dir) throws IOException {
        System.out.println("\n[Layered Terrains]");
        Path layeredDir = dir.resolve("layered");
        Files.createDirectories(layeredDir);

        // Standard earth layers
        saveTerrain(createLayered("earth_standard", List.of(
            new LayerEntry(Material.GRASS_BLOCK, 1),
            new LayerEntry(Material.DIRT, 4),
            new LayerEntry(Material.STONE, 50),
            new LayerEntry(Material.DEEPSLATE, 30),
            new LayerEntry(Material.BEDROCK, 1)
        ), 0x7CFC00), layeredDir.resolve("earth_standard.terrain"));

        // Desert layers
        saveTerrain(createLayered("desert_layers", List.of(
            new LayerEntry(Material.SAND, 4),
            new LayerEntry(Material.SANDSTONE, 8),
            new LayerEntry(Material.RED_SANDSTONE, 4),
            new LayerEntry(Material.STONE, 40),
            new LayerEntry(Material.DEEPSLATE, 20)
        ), 0xC2B280), layeredDir.resolve("desert_layers.terrain"));

        // Mesa/badlands layers
        saveTerrain(createLayered("mesa_layers", List.of(
            new LayerEntry(Material.RED_SAND, 2),
            new LayerEntry(Material.TERRACOTTA, 3),
            new LayerEntry(Material.get("minecraft:orange_terracotta"), 3),
            new LayerEntry(Material.get("minecraft:yellow_terracotta"), 2),
            new LayerEntry(Material.get("minecraft:brown_terracotta"), 3),
            new LayerEntry(Material.get("minecraft:red_terracotta"), 4),
            new LayerEntry(Material.TERRACOTTA, 6),
            new LayerEntry(Material.STONE, 30)
        ), 0xCD853F), layeredDir.resolve("mesa_layers.terrain"));

        // Mushroom island
        saveTerrain(createLayered("mushroom_island", List.of(
            new LayerEntry(Material.MYCELIUM, 1),
            new LayerEntry(Material.DIRT, 4),
            new LayerEntry(Material.STONE, 40)
        ), 0x8B4513), layeredDir.resolve("mushroom_island.terrain"));

        // Nether terrain
        saveTerrain(createLayered("nether_waste", List.of(
            new LayerEntry(Material.NETHERRACK, 30),
            new LayerEntry(Material.SOUL_SAND, 4),
            new LayerEntry(Material.BLACKSTONE, 10),
            new LayerEntry(Material.BASALT, 6)
        ), 0x800000), layeredDir.resolve("nether_waste.terrain"));

        // End terrain
        saveTerrain(createLayered("end_stone", List.of(
            new LayerEntry(Material.END_STONE, 40),
            new LayerEntry(Material.PURPUR_BLOCK, 4)
        ), 0xFFFDD0), layeredDir.resolve("end_stone.terrain"));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Noisy/Blobby Terrains
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateNoisyTerrains(Path dir) throws IOException {
        System.out.println("\n[Noisy Terrains]");
        Path noisyDir = dir.resolve("noisy");
        Files.createDirectories(noisyDir);

        // Mixed stone types
        saveTerrain(createNoisy("mixed_stone", List.of(
            new MaterialWeight(Material.STONE, 500, 1.0f),
            new MaterialWeight(Material.GRANITE, 150, 1.0f),
            new MaterialWeight(Material.DIORITE, 150, 1.0f),
            new MaterialWeight(Material.ANDESITE, 150, 1.0f),
            new MaterialWeight(Material.TUFF, 50, 1.0f)
        ), 0x808080, 100.0f), noisyDir.resolve("mixed_stone.terrain"));

        // Ore-rich stone
        saveTerrain(createNoisy("ore_rich", List.of(
            new MaterialWeight(Material.STONE, 700, 1.0f),
            new MaterialWeight(Material.COAL_ORE, 80, 1.0f),
            new MaterialWeight(Material.IRON_ORE, 80, 1.0f),
            new MaterialWeight(Material.COPPER_ORE, 60, 1.0f),
            new MaterialWeight(Material.GOLD_ORE, 30, 1.0f),
            new MaterialWeight(Material.REDSTONE_ORE, 25, 1.0f),
            new MaterialWeight(Material.LAPIS_ORE, 15, 1.0f),
            new MaterialWeight(Material.DIAMOND_ORE, 10, 1.0f)
        ), 0x696969, 50.0f), noisyDir.resolve("ore_rich.terrain"));

        // Gravel beach mix
        saveTerrain(createNoisy("gravel_beach", List.of(
            new MaterialWeight(Material.GRAVEL, 400, 1.0f),
            new MaterialWeight(Material.SAND, 300, 1.0f),
            new MaterialWeight(Material.CLAY, 150, 1.0f),
            new MaterialWeight(Material.DIRT, 100, 1.0f),
            new MaterialWeight(Material.COBBLESTONE, 50, 1.0f)
        ), 0xA9A9A9, 30.0f), noisyDir.resolve("gravel_beach.terrain"));

        // Autumn leaves mix
        saveTerrain(createNoisy("autumn_leaves", List.of(
            new MaterialWeight(Material.get("minecraft:orange_wool"), 300, 1.0f),
            new MaterialWeight(Material.get("minecraft:yellow_wool"), 250, 1.0f),
            new MaterialWeight(Material.get("minecraft:red_wool"), 250, 1.0f),
            new MaterialWeight(Material.get("minecraft:brown_wool"), 150, 1.0f),
            new MaterialWeight(Material.get("minecraft:green_wool"), 50, 1.0f)
        ), 0xD2691E, 20.0f), noisyDir.resolve("autumn_leaves.terrain"));

        // Crystal cave mix
        saveTerrain(createNoisy("crystal_cave", List.of(
            new MaterialWeight(Material.AMETHYST_BLOCK, 200, 1.0f),
            new MaterialWeight(Material.CALCITE, 200, 1.0f),
            new MaterialWeight(Material.SMOOTH_BASALT, 200, 1.0f),
            new MaterialWeight(Material.TUFF, 200, 1.0f),
            new MaterialWeight(Material.DRIPSTONE_BLOCK, 100, 1.0f),
            new MaterialWeight(Material.get("minecraft:purple_stained_glass"), 100, 1.0f)
        ), 0x9370DB, 40.0f), noisyDir.resolve("crystal_cave.terrain"));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Custom/Special Terrains
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateCustomTerrains(Path dir) throws IOException {
        System.out.println("\n[Custom Terrains]");
        Path customDir = dir.resolve("custom");
        Files.createDirectories(customDir);

        // Sloped rainbow terrain with noise
        NoiseSettings rainbowNoise = new NoiseSettings();
        rainbowNoise.setRange(10);
        rainbowNoise.setScale(50.0f);
        rainbowNoise.setRoughness(3);
        rainbowNoise.setSeed(12345L);

        List<LayerEntry> slopedRainbow = List.of(
            new LayerEntry(Material.get("minecraft:red_concrete"), 3),
            new LayerEntry(Material.get("minecraft:orange_concrete"), 3),
            new LayerEntry(Material.get("minecraft:yellow_concrete"), 3),
            new LayerEntry(Material.get("minecraft:lime_concrete"), 3),
            new LayerEntry(Material.get("minecraft:cyan_concrete"), 3),
            new LayerEntry(Material.get("minecraft:blue_concrete"), 3),
            new LayerEntry(Material.get("minecraft:purple_concrete"), 3)
        );
        saveTerrain(createLayeredWithNoise("rainbow_sloped", slopedRainbow, 0xFF0000, 
            rainbowNoise, 0.5, 0.0, true), customDir.resolve("rainbow_sloped.terrain"));

        // Prismarine ocean floor
        saveTerrain(createLayered("prismarine_floor", List.of(
            new LayerEntry(Material.PRISMARINE, 2),
            new LayerEntry(Material.PRISMARINE_BRICKS, 3),
            new LayerEntry(Material.DARK_PRISMARINE, 4),
            new LayerEntry(Material.SEA_LANTERN, 1),
            new LayerEntry(Material.DARK_PRISMARINE, 10)
        ), 0x4682B4), customDir.resolve("prismarine_floor.terrain"));

        // Copper oxidation layers
        saveTerrain(createLayered("copper_oxidation", List.of(
            new LayerEntry(Material.OXIDIZED_COPPER, 4),
            new LayerEntry(Material.WEATHERED_COPPER, 4),
            new LayerEntry(Material.EXPOSED_COPPER, 4),
            new LayerEntry(Material.COPPER_BLOCK, 4)
        ), 0x54C4A3), customDir.resolve("copper_oxidation.terrain"));

        // Deepslate ore gradient
        saveTerrain(createNoisy("deepslate_ore", List.of(
            new MaterialWeight(Material.DEEPSLATE, 600, 1.0f),
            new MaterialWeight(Material.DEEPSLATE_COAL_ORE, 80, 1.0f),
            new MaterialWeight(Material.DEEPSLATE_IRON_ORE, 80, 1.0f),
            new MaterialWeight(Material.DEEPSLATE_COPPER_ORE, 60, 1.0f),
            new MaterialWeight(Material.DEEPSLATE_GOLD_ORE, 40, 1.0f),
            new MaterialWeight(Material.DEEPSLATE_REDSTONE_ORE, 40, 1.0f),
            new MaterialWeight(Material.DEEPSLATE_LAPIS_ORE, 30, 1.0f),
            new MaterialWeight(Material.DEEPSLATE_EMERALD_ORE, 20, 1.0f),
            new MaterialWeight(Material.DEEPSLATE_DIAMOND_ORE, 15, 1.0f),
            new MaterialWeight(Material.ANCIENT_DEBRIS, 5, 1.0f)
        ), 0x4A4A4A, 40.0f), customDir.resolve("deepslate_ore.terrain"));

        // Sculk terrain
        saveTerrain(createNoisy("sculk_depths", List.of(
            new MaterialWeight(Material.SCULK, 400, 1.0f),
            new MaterialWeight(Material.DEEPSLATE, 300, 1.0f),
            new MaterialWeight(Material.SCULK_CATALYST, 50, 1.0f),
            new MaterialWeight(Material.SCULK_VEIN, 100, 1.0f),
            new MaterialWeight(Material.get("minecraft:cyan_terracotta"), 100, 1.0f),
            new MaterialWeight(Material.SOUL_SAND, 50, 1.0f)
        ), 0x0F4C5C, 60.0f), customDir.resolve("sculk_depths.terrain"));

        // Neon city blocks
        saveTerrain(createNoisy("neon_city", List.of(
            new MaterialWeight(Material.get("minecraft:black_concrete"), 300, 1.0f),
            new MaterialWeight(Material.get("minecraft:magenta_concrete"), 100, 1.0f),
            new MaterialWeight(Material.get("minecraft:cyan_concrete"), 100, 1.0f),
            new MaterialWeight(Material.get("minecraft:pink_concrete"), 80, 1.0f),
            new MaterialWeight(Material.SEA_LANTERN, 40, 1.0f),
            new MaterialWeight(Material.GLOWSTONE, 40, 1.0f),
            new MaterialWeight(Material.get("minecraft:purple_stained_glass"), 60, 1.0f)
        ), 0xFF00FF, 25.0f), customDir.resolve("neon_city.terrain"));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Helper Classes
    // ═══════════════════════════════════════════════════════════════════════════

    public static class LayerEntry {
        public final Material material;
        public final int thickness;

        public LayerEntry(Material material, int thickness) {
            this.material = material;
            this.thickness = thickness;
        }
    }

    public static class MaterialWeight {
        public final Material material;
        public final int weight;
        public final float scale;

        public MaterialWeight(Material material, int weight, float scale) {
            this.material = material;
            this.weight = weight;
            this.scale = scale;
        }
    }

    private static Integer getColorValue(String colorName) {
        return switch (colorName) {
            case "red" -> 0xFF0000;
            case "orange" -> 0xFF8000;
            case "yellow" -> 0xFFFF00;
            case "lime" -> 0x00FF00;
            case "green" -> 0x008000;
            case "cyan" -> 0x00FFFF;
            case "light_blue" -> 0x87CEEB;
            case "blue" -> 0x0000FF;
            case "purple" -> 0x800080;
            case "magenta" -> 0xFF00FF;
            case "pink" -> 0xFFC0CB;
            case "white" -> 0xFFFFFF;
            case "light_gray" -> 0xC0C0C0;
            case "gray" -> 0x808080;
            case "black" -> 0x000000;
            case "brown" -> 0x8B4513;
            default -> null;
        };
    }
}