/**
 * Standalone WorldPainter .terrain File Encoder
 * 
 * Creates MixedMaterial terrain files for Rainbow III blocks.
 * Uses custom serialization to write WorldPainter-compatible class names.
 * 
 * Compile: javac StandaloneTerrainEncoder.java
 * Run: java StandaloneTerrainEncoder [output-dir]
 */

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.zip.GZIPOutputStream;

public class StandaloneTerrainEncoder {

    private static final Path OUTPUT_DIR = Path.of("terrain-output");

    // Class name mappings: our classes → WorldPainter classes
    private static final Map<String, String> CLASS_MAP = new HashMap<>();
    static {
        CLASS_MAP.put("StandaloneTerrainEncoder$MixedMaterial", "org.pepsoft.worldpainter.MixedMaterial");
        CLASS_MAP.put("StandaloneTerrainEncoder$MixedMaterial$Mode", "org.pepsoft.worldpainter.MixedMaterial$Mode");
        CLASS_MAP.put("StandaloneTerrainEncoder$Row", "org.pepsoft.worldpainter.MixedMaterial$Row");
        CLASS_MAP.put("StandaloneTerrainEncoder$NoiseSettings", "org.pepsoft.worldpainter.NoiseSettings");
        CLASS_MAP.put("StandaloneTerrainEncoder$Material", "org.pepsoft.minecraft.Material");
        CLASS_MAP.put("StandaloneTerrainEncoder$Material$Identity", "org.pepsoft.minecraft.Material$Identity");
    }

    // Rainbow color palette
    private static final String[] COLORS = {
        "red", "orange", "yellow", "lime", "green", "cyan",
        "light_blue", "blue", "purple", "magenta", "pink",
        "brown", "gray", "light_gray"
    };

    // Shade levels (Material Design-like: 50=lightest, 900=darkest)
    private static final int[] SHADES = {50, 100, 200, 300, 400, 500, 600, 700, 800, 900};

    public static void main(String[] args) throws Exception {
        Path outputDir = args.length > 0 ? Path.of(args[0]) : OUTPUT_DIR;
        Files.createDirectories(outputDir);

        System.out.println("=== Rainbow III Terrain Encoder ===");
        System.out.println("Output directory: " + outputDir.toAbsolutePath());

        generateSolidTerrains(outputDir);
        generateGradientTerrains(outputDir);
        generateLayeredTerrains(outputDir);
        generateNoisyTerrains(outputDir);
        generateSpecialTerrains(outputDir);

        System.out.println("\n✓ All terrain files generated successfully!");
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Custom ObjectOutputStream that remaps class names
    // ═══════════════════════════════════════════════════════════════════════════

    static class RemappingObjectOutputStream extends ObjectOutputStream {
        public RemappingObjectOutputStream(OutputStream out) throws IOException {
            super(out);
        }

        @Override
        protected void writeClassDescriptor(ObjectStreamClass desc) throws IOException {
            String className = desc.getName();
            String mappedName = CLASS_MAP.getOrDefault(className, className);
            
            if (!mappedName.equals(className)) {
                // Create a new descriptor with the remapped name
                ObjectStreamClass remapped = ObjectStreamClass.lookup(desc.forClass());
                // Write custom descriptor
                writeUTF(mappedName);
                writeLong(desc.getSerialVersionUID());
            } else {
                super.writeClassDescriptor(desc);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Serialization Classes (matching WorldPainter's structure exactly)
    // ═══════════════════════════════════════════════════════════════════════════

    public static class MixedMaterial implements Serializable {
        private static final long serialVersionUID = 1L;
        
        private int biome = -1;
        private double layerXSlope = 0.0;
        private double layerYSlope = 0.0;
        private boolean noise = false;
        private boolean repeat = true;
        private float scale = 1.0f;
        private Integer colour;
        private UUID id;
        private Mode mode;
        private String name;
        private Row[] rows;
        private NoiseSettings variation;

        public MixedMaterial(String name, Row[] rows, int biome, Integer colour, Mode mode) {
            this.name = name;
            this.rows = rows;
            this.biome = biome;
            this.colour = colour;
            this.mode = mode;
            this.id = UUID.randomUUID();
        }

        public static MixedMaterial simple(String name, Material material, Integer colour) {
            Row[] rows = { new Row(material, 1, 1.0f) };
            return new MixedMaterial(name, rows, -1, colour, Mode.SIMPLE);
        }

        public static MixedMaterial layered(String name, Row[] rows, Integer colour) {
            MixedMaterial mm = new MixedMaterial(name, rows, -1, colour, Mode.LAYERED);
            mm.repeat = true;
            return mm;
        }

        public static MixedMaterial layeredWithNoise(String name, Row[] rows, Integer colour,
                NoiseSettings noise, double xSlope, double ySlope, boolean repeat) {
            MixedMaterial mm = new MixedMaterial(name, rows, -1, colour, Mode.LAYERED);
            mm.variation = noise;
            mm.layerXSlope = xSlope;
            mm.layerYSlope = ySlope;
            mm.repeat = repeat;
            return mm;
        }

        public static MixedMaterial noisy(String name, Row[] rows, Integer colour, float scale) {
            MixedMaterial mm = new MixedMaterial(name, rows, -1, colour, Mode.NOISE);
            mm.scale = scale;
            mm.noise = true;
            return mm;
        }

        public static MixedMaterial blobby(String name, Row[] rows, Integer colour, float scale) {
            MixedMaterial mm = new MixedMaterial(name, rows, -1, colour, Mode.BLOBS);
            mm.scale = scale;
            return mm;
        }

        public enum Mode { SIMPLE, LAYERED, NOISE, BLOBS }
    }

    public static class Row implements Serializable {
        private static final long serialVersionUID = 1L;
        public int count;
        public float occurrence;
        public float scale;
        public Material material;

        public Row(Material material, int count, float scale) {
            this.material = material;
            this.count = count;
            this.scale = scale;
            this.occurrence = 1.0f;
        }
    }

    public static class NoiseSettings implements Serializable {
        private static final long serialVersionUID = 1L;
        private int range = 10;
        private int roughness = 3;
        private float scale = 100.0f;
        private long seed = 0L;

        public NoiseSettings() {}

        public NoiseSettings(int range, float scale, int roughness, long seed) {
            this.range = range;
            this.scale = scale;
            this.roughness = roughness;
            this.seed = seed;
        }
    }

    public static class Material implements Serializable {
        private static final long serialVersionUID = 1L;
        private Identity identity;

        public Material(String name) {
            this.identity = new Identity(name, Collections.emptyMap());
        }

        public static Material of(String name) {
            return new Material(name);
        }

        public static class Identity implements Serializable {
            private static final long serialVersionUID = 1L;
            public String name;
            public Map<String, String> properties;

            public Identity(String name, Map<String, String> properties) {
                this.name = name;
                this.properties = properties;
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Rainbow Block Helpers
    // ═══════════════════════════════════════════════════════════════════════════

    private static Material rb(String color, int shade, String type) {
        return Material.of("rainbow:" + color + "_" + shade + "_" + type);
    }

    private static Material block(String color, int shade) { return rb(color, shade, "block"); }
    private static Material plate(String color, int shade) { return rb(color, shade, "plate"); }
    private static Material lit(String color, int shade)   { return rb(color, shade, "lit"); }
    private static Material lamp(String color, int shade)  { return rb(color, shade, "lamp"); }
    private static Material glass(String color, int shade) { return rb(color, shade, "glass"); }

    private static Integer shadeColor(String color, int shade) {
        int baseColor = switch (color) {
            case "red" -> 0xF44336;
            case "orange" -> 0xFF9800;
            case "yellow" -> 0xFFEB3B;
            case "lime" -> 0xCDDC39;
            case "green" -> 0x4CAF50;
            case "cyan" -> 0x00BCD4;
            case "light_blue" -> 0x03A9F4;
            case "blue" -> 0x2196F3;
            case "purple" -> 0x9C27B0;
            case "magenta" -> 0xE91E63;
            case "pink" -> 0xF48FB1;
            case "brown" -> 0x795548;
            case "gray" -> 0x9E9E9E;
            case "light_gray" -> 0xBDBDBD;
            default -> 0x808080;
        };

        float factor = shade <= 500 
            ? (500 - shade) / 500.0f * 0.5f + 1.0f
            : 1.0f - (shade - 500) / 500.0f * 0.7f;

        int r = Math.min(255, Math.max(0, (int)(((baseColor >> 16) & 0xFF) * factor)));
        int g = Math.min(255, Math.max(0, (int)(((baseColor >> 8) & 0xFF) * factor)));
        int b = Math.min(255, Math.max(0, (int)((baseColor & 0xFF) * factor)));

        return (r << 16) | (g << 8) | b;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // File Output with Class Name Remapping
    // ═══════════════════════════════════════════════════════════════════════════

    public static void saveTerrain(MixedMaterial material, Path outputPath) throws IOException {
        // Serialize to byte array first
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            oos.writeObject(material);
        }
        byte[] data = baos.toByteArray();

        // Replace class names in the serialized data
        data = remapClassNames(data);

        // Write to GZIP file
        try (GZIPOutputStream gzip = new GZIPOutputStream(Files.newOutputStream(outputPath))) {
            gzip.write(data);
        }
        System.out.println("  → " + outputPath.getFileName());
    }

    private static byte[] remapClassNames(byte[] data) {
        String dataStr = new String(data, java.nio.charset.StandardCharsets.ISO_8859_1);
        
        for (Map.Entry<String, String> entry : CLASS_MAP.entrySet()) {
            String from = entry.getKey();
            String to = entry.getValue();
            
            // Replace class name occurrences (stored with length prefix)
            dataStr = replaceSerializedClassName(dataStr, from, to);
            
            // Replace type descriptors (L<classname>;)
            dataStr = replaceTypeDescriptor(dataStr, from, to);
            
            // Replace array type descriptors ([L<classname>;)
            dataStr = replaceArrayTypeDescriptor(dataStr, from, to);
        }
        
        return dataStr.getBytes(java.nio.charset.StandardCharsets.ISO_8859_1);
    }

    private static String replaceSerializedClassName(String data, String from, String to) {
        // In Java serialization, class names are preceded by a 2-byte length
        char lenHigh = (char)(from.length() >> 8);
        char lenLow = (char)(from.length() & 0xFF);
        String searchPattern = "" + lenHigh + lenLow + from;
        
        char newLenHigh = (char)(to.length() >> 8);
        char newLenLow = (char)(to.length() & 0xFF);
        String replacement = "" + newLenHigh + newLenLow + to;
        
        return data.replace(searchPattern, replacement);
    }

    private static String replaceTypeDescriptor(String data, String from, String to) {
        // Type descriptors use format: L<classname>; with $ for inner classes
        String fromDescriptor = "L" + from + ";";
        String toDescriptor = "L" + to + ";";
        
        char fromLenHigh = (char)(fromDescriptor.length() >> 8);
        char fromLenLow = (char)(fromDescriptor.length() & 0xFF);
        String searchPattern = "" + fromLenHigh + fromLenLow + fromDescriptor;
        
        char toLenHigh = (char)(toDescriptor.length() >> 8);
        char toLenLow = (char)(toDescriptor.length() & 0xFF);
        String replacement = "" + toLenHigh + toLenLow + toDescriptor;
        
        return data.replace(searchPattern, replacement);
    }

    private static String replaceArrayTypeDescriptor(String data, String from, String to) {
        // Array type descriptors use format: [L<classname>;
        String fromDescriptor = "[L" + from + ";";
        String toDescriptor = "[L" + to + ";";
        
        char fromLenHigh = (char)(fromDescriptor.length() >> 8);
        char fromLenLow = (char)(fromDescriptor.length() & 0xFF);
        String searchPattern = "" + fromLenHigh + fromLenLow + fromDescriptor;
        
        char toLenHigh = (char)(toDescriptor.length() >> 8);
        char toLenLow = (char)(toDescriptor.length() & 0xFF);
        String replacement = "" + toLenHigh + toLenLow + toDescriptor;
        
        return data.replace(searchPattern, replacement);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Solid Color Terrains (one block per color/shade/type)
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateSolidTerrains(Path dir) throws IOException {
        System.out.println("\n[Solid Terrains]");
        Path solidDir = dir.resolve("solid");
        Files.createDirectories(solidDir);

        for (String color : COLORS) {
            Path colorDir = solidDir.resolve(color);
            Files.createDirectories(colorDir);

            for (int shade : SHADES) {
                saveTerrain(MixedMaterial.simple(color + "_" + shade + "_block", 
                    block(color, shade), shadeColor(color, shade)),
                    colorDir.resolve(color + "_" + shade + "_block.terrain"));

                saveTerrain(MixedMaterial.simple(color + "_" + shade + "_lit",
                    lit(color, shade), shadeColor(color, shade)),
                    colorDir.resolve(color + "_" + shade + "_lit.terrain"));

                saveTerrain(MixedMaterial.simple(color + "_" + shade + "_glass",
                    glass(color, shade), shadeColor(color, shade)),
                    colorDir.resolve(color + "_" + shade + "_glass.terrain"));
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Gradient Terrains (shade transitions within one color)
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateGradientTerrains(Path dir) throws IOException {
        System.out.println("\n[Gradient Terrains]");
        Path gradientDir = dir.resolve("gradients");
        Files.createDirectories(gradientDir);

        for (String color : COLORS) {
            Row[] lightToDark = new Row[SHADES.length];
            for (int i = 0; i < SHADES.length; i++) {
                lightToDark[i] = new Row(block(color, SHADES[i]), 2, 1.0f);
            }
            saveTerrain(MixedMaterial.layered(color + "_gradient", lightToDark, shadeColor(color, 500)),
                gradientDir.resolve(color + "_gradient.terrain"));

            Row[] darkToLight = new Row[SHADES.length];
            for (int i = 0; i < SHADES.length; i++) {
                darkToLight[i] = new Row(block(color, SHADES[SHADES.length - 1 - i]), 2, 1.0f);
            }
            saveTerrain(MixedMaterial.layered(color + "_gradient_inv", darkToLight, shadeColor(color, 500)),
                gradientDir.resolve(color + "_gradient_inv.terrain"));

            Row[] smooth = new Row[SHADES.length];
            for (int i = 0; i < SHADES.length; i++) {
                smooth[i] = new Row(block(color, SHADES[i]), 4, 1.0f);
            }
            saveTerrain(MixedMaterial.layered(color + "_smooth", smooth, shadeColor(color, 500)),
                gradientDir.resolve(color + "_smooth.terrain"));
        }

        String[] spectrum = {"red", "orange", "yellow", "lime", "green", "cyan", "light_blue", "blue", "purple", "magenta", "pink"};
        Row[] rainbowGradient = new Row[spectrum.length];
        for (int i = 0; i < spectrum.length; i++) {
            rainbowGradient[i] = new Row(block(spectrum[i], 500), 3, 1.0f);
        }
        saveTerrain(MixedMaterial.layered("rainbow_spectrum", rainbowGradient, 0xFF0000),
            gradientDir.resolve("rainbow_spectrum.terrain"));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Layered Terrains (multi-color stacks)
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateLayeredTerrains(Path dir) throws IOException {
        System.out.println("\n[Layered Terrains]");
        Path layeredDir = dir.resolve("layered");
        Files.createDirectories(layeredDir);

        saveTerrain(MixedMaterial.layered("sunset", new Row[]{
            new Row(block("yellow", 200), 3, 1.0f),
            new Row(block("yellow", 400), 3, 1.0f),
            new Row(block("orange", 400), 3, 1.0f),
            new Row(block("orange", 600), 3, 1.0f),
            new Row(block("red", 500), 3, 1.0f),
            new Row(block("red", 700), 3, 1.0f),
            new Row(block("magenta", 600), 3, 1.0f),
            new Row(block("purple", 700), 4, 1.0f),
            new Row(block("blue", 800), 6, 1.0f)
        }, 0xFF6600), layeredDir.resolve("sunset.terrain"));

        saveTerrain(MixedMaterial.layered("ocean_depth", new Row[]{
            new Row(block("light_blue", 200), 4, 1.0f),
            new Row(block("light_blue", 400), 4, 1.0f),
            new Row(block("cyan", 500), 4, 1.0f),
            new Row(block("blue", 500), 5, 1.0f),
            new Row(block("blue", 700), 6, 1.0f),
            new Row(block("blue", 900), 8, 1.0f)
        }, 0x0066CC), layeredDir.resolve("ocean_depth.terrain"));

        saveTerrain(MixedMaterial.layered("forest", new Row[]{
            new Row(block("lime", 400), 2, 1.0f),
            new Row(block("green", 500), 4, 1.0f),
            new Row(block("green", 700), 6, 1.0f),
            new Row(block("brown", 600), 4, 1.0f),
            new Row(block("brown", 800), 6, 1.0f),
            new Row(block("gray", 700), 10, 1.0f)
        }, 0x228B22), layeredDir.resolve("forest.terrain"));

        saveTerrain(MixedMaterial.layered("volcanic", new Row[]{
            new Row(block("gray", 800), 4, 1.0f),
            new Row(block("red", 700), 2, 1.0f),
            new Row(block("orange", 600), 2, 1.0f),
            new Row(block("red", 900), 6, 1.0f),
            new Row(block("gray", 900), 10, 1.0f)
        }, 0x8B0000), layeredDir.resolve("volcanic.terrain"));

        saveTerrain(MixedMaterial.layered("ice", new Row[]{
            new Row(block("light_gray", 50), 2, 1.0f),
            new Row(block("light_blue", 100), 4, 1.0f),
            new Row(block("light_blue", 300), 4, 1.0f),
            new Row(block("cyan", 400), 4, 1.0f),
            new Row(block("blue", 500), 6, 1.0f)
        }, 0xADD8E6), layeredDir.resolve("ice.terrain"));

        saveTerrain(MixedMaterial.layered("candy", new Row[]{
            new Row(block("pink", 200), 2, 1.0f),
            new Row(block("light_gray", 50), 2, 1.0f),
            new Row(block("pink", 300), 2, 1.0f),
            new Row(block("light_gray", 50), 2, 1.0f),
            new Row(block("pink", 400), 2, 1.0f),
            new Row(block("light_gray", 50), 2, 1.0f)
        }, 0xFFC0CB), layeredDir.resolve("candy.terrain"));

        saveTerrain(MixedMaterial.layered("neon_stack", new Row[]{
            new Row(lit("magenta", 400), 2, 1.0f),
            new Row(block("gray", 900), 3, 1.0f),
            new Row(lit("cyan", 400), 2, 1.0f),
            new Row(block("gray", 900), 3, 1.0f),
            new Row(lit("pink", 300), 2, 1.0f),
            new Row(block("gray", 900), 3, 1.0f)
        }, 0xFF00FF), layeredDir.resolve("neon_stack.terrain"));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Noisy Terrains (random distribution)
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateNoisyTerrains(Path dir) throws IOException {
        System.out.println("\n[Noisy Terrains]");
        Path noisyDir = dir.resolve("noisy");
        Files.createDirectories(noisyDir);

        Row[] confetti = new Row[COLORS.length];
        for (int i = 0; i < COLORS.length; i++) {
            confetti[i] = new Row(block(COLORS[i], 500), 100, 1.0f);
        }
        saveTerrain(MixedMaterial.noisy("rainbow_confetti", confetti, 0xFFFFFF, 10.0f),
            noisyDir.resolve("rainbow_confetti.terrain"));

        for (String color : COLORS) {
            Row[] shadeMix = new Row[SHADES.length];
            for (int i = 0; i < SHADES.length; i++) {
                shadeMix[i] = new Row(block(color, SHADES[i]), 100, 1.0f);
            }
            saveTerrain(MixedMaterial.noisy(color + "_noise", shadeMix, shadeColor(color, 500), 40.0f),
                noisyDir.resolve(color + "_noise.terrain"));
        }

        saveTerrain(MixedMaterial.noisy("warm_mix", new Row[]{
            new Row(block("red", 500), 150, 1.0f),
            new Row(block("orange", 500), 150, 1.0f),
            new Row(block("yellow", 500), 150, 1.0f),
            new Row(block("pink", 400), 100, 1.0f),
            new Row(block("magenta", 500), 100, 1.0f)
        }, 0xFF6347, 30.0f), noisyDir.resolve("warm_mix.terrain"));

        saveTerrain(MixedMaterial.noisy("cool_mix", new Row[]{
            new Row(block("blue", 500), 150, 1.0f),
            new Row(block("light_blue", 500), 150, 1.0f),
            new Row(block("cyan", 500), 150, 1.0f),
            new Row(block("purple", 500), 100, 1.0f),
            new Row(block("green", 600), 100, 1.0f)
        }, 0x4169E1, 30.0f), noisyDir.resolve("cool_mix.terrain"));

        saveTerrain(MixedMaterial.noisy("grayscale_noise", new Row[]{
            new Row(block("gray", 200), 100, 1.0f),
            new Row(block("gray", 400), 150, 1.0f),
            new Row(block("gray", 600), 150, 1.0f),
            new Row(block("gray", 800), 100, 1.0f),
            new Row(block("light_gray", 300), 100, 1.0f)
        }, 0x808080, 50.0f), noisyDir.resolve("grayscale_noise.terrain"));

        saveTerrain(MixedMaterial.noisy("earth_tones", new Row[]{
            new Row(block("brown", 400), 150, 1.0f),
            new Row(block("brown", 600), 150, 1.0f),
            new Row(block("orange", 700), 100, 1.0f),
            new Row(block("yellow", 700), 80, 1.0f),
            new Row(block("green", 700), 80, 1.0f),
            new Row(block("gray", 600), 100, 1.0f)
        }, 0x8B4513, 40.0f), noisyDir.resolve("earth_tones.terrain"));

        saveTerrain(MixedMaterial.noisy("neon_scatter", new Row[]{
            new Row(block("gray", 900), 400, 1.0f),
            new Row(lit("magenta", 400), 80, 1.0f),
            new Row(lit("cyan", 400), 80, 1.0f),
            new Row(lit("pink", 300), 60, 1.0f),
            new Row(lit("yellow", 300), 40, 1.0f),
            new Row(lit("green", 400), 40, 1.0f)
        }, 0x000000, 20.0f), noisyDir.resolve("neon_scatter.terrain"));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Special/Themed Terrains
    // ═══════════════════════════════════════════════════════════════════════════

    private static void generateSpecialTerrains(Path dir) throws IOException {
        System.out.println("\n[Special Terrains]");
        Path specialDir = dir.resolve("special");
        Files.createDirectories(specialDir);

        saveTerrain(MixedMaterial.layered("vaporwave", new Row[]{
            new Row(block("magenta", 300), 3, 1.0f),
            new Row(block("pink", 200), 3, 1.0f),
            new Row(block("purple", 400), 3, 1.0f),
            new Row(block("blue", 500), 3, 1.0f),
            new Row(block("cyan", 400), 3, 1.0f),
            new Row(block("light_blue", 300), 3, 1.0f)
        }, 0xFF69B4), specialDir.resolve("vaporwave.terrain"));

        saveTerrain(MixedMaterial.noisy("cyberpunk", new Row[]{
            new Row(block("gray", 900), 400, 1.0f),
            new Row(lit("yellow", 400), 80, 1.0f),
            new Row(lit("cyan", 400), 80, 1.0f),
            new Row(lit("magenta", 400), 60, 1.0f),
            new Row(block("purple", 800), 80, 1.0f)
        }, 0xFFD700, 15.0f), specialDir.resolve("cyberpunk.terrain"));

        saveTerrain(MixedMaterial.noisy("pastel_dream", new Row[]{
            new Row(block("pink", 100), 100, 1.0f),
            new Row(block("light_blue", 100), 100, 1.0f),
            new Row(block("lime", 100), 100, 1.0f),
            new Row(block("yellow", 100), 100, 1.0f),
            new Row(block("purple", 200), 100, 1.0f),
            new Row(block("cyan", 100), 100, 1.0f)
        }, 0xFFB6C1, 25.0f), specialDir.resolve("pastel_dream.terrain"));

        NoiseSettings fireNoise = new NoiseSettings(8, 30.0f, 2, 42L);
        saveTerrain(MixedMaterial.layeredWithNoise("fire_wave", new Row[]{
            new Row(lit("yellow", 200), 2, 1.0f),
            new Row(lit("yellow", 400), 2, 1.0f),
            new Row(lit("orange", 500), 3, 1.0f),
            new Row(lit("red", 500), 3, 1.0f),
            new Row(lit("red", 700), 4, 1.0f),
            new Row(block("brown", 900), 4, 1.0f)
        }, 0xFF4500, fireNoise, 0.3, 0.0, true), specialDir.resolve("fire_wave.terrain"));

        saveTerrain(MixedMaterial.layeredWithNoise("aurora", new Row[]{
            new Row(lit("green", 300), 2, 1.0f),
            new Row(lit("cyan", 400), 2, 1.0f),
            new Row(lit("blue", 500), 2, 1.0f),
            new Row(lit("purple", 500), 2, 1.0f),
            new Row(lit("magenta", 400), 2, 1.0f),
            new Row(block("blue", 900), 6, 1.0f)
        }, 0x00FF7F, new NoiseSettings(12, 60.0f, 3, 123L), 0.2, 0.1, true),
            specialDir.resolve("aurora.terrain"));

        saveTerrain(MixedMaterial.noisy("glowing_crystal", new Row[]{
            new Row(glass("purple", 300), 150, 1.0f),
            new Row(glass("purple", 500), 150, 1.0f),
            new Row(lit("purple", 400), 80, 1.0f),
            new Row(glass("magenta", 400), 100, 1.0f),
            new Row(lit("magenta", 300), 60, 1.0f)
        }, 0x9370DB, 35.0f), specialDir.resolve("glowing_crystal.terrain"));

        saveTerrain(MixedMaterial.noisy("deep_space", new Row[]{
            new Row(block("gray", 900), 500, 1.0f),
            new Row(block("blue", 900), 200, 1.0f),
            new Row(block("purple", 900), 150, 1.0f),
            new Row(lit("light_blue", 200), 30, 1.0f),
            new Row(lit("yellow", 200), 20, 1.0f),
            new Row(lit("pink", 200), 15, 1.0f)
        }, 0x0D0D1A, 80.0f), specialDir.resolve("deep_space.terrain"));

        saveTerrain(MixedMaterial.noisy("coral_reef", new Row[]{
            new Row(block("cyan", 500), 150, 1.0f),
            new Row(block("orange", 400), 100, 1.0f),
            new Row(block("pink", 400), 100, 1.0f),
            new Row(block("purple", 500), 80, 1.0f),
            new Row(block("yellow", 400), 60, 1.0f),
            new Row(block("lime", 500), 60, 1.0f)
        }, 0xFF7F50, 25.0f), specialDir.resolve("coral_reef.terrain"));

        for (String color : new String[]{"red", "blue", "green", "purple", "cyan", "orange"}) {
            saveTerrain(MixedMaterial.layered(color + "_stripes", new Row[]{
                new Row(block(color, 200), 2, 1.0f),
                new Row(block(color, 600), 2, 1.0f),
                new Row(block(color, 200), 2, 1.0f),
                new Row(block(color, 600), 2, 1.0f),
                new Row(block(color, 200), 2, 1.0f),
                new Row(block(color, 600), 2, 1.0f)
            }, shadeColor(color, 400)), specialDir.resolve(color + "_stripes.terrain"));
        }
    }
}
