package co.jasongardner.rainbow.worldgen;

import co.jasongardner.rainbow.block.ModBlocks;
import co.jasongardner.rainbow.data.RainbowColors.BlockType;
import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import net.minecraft.block.Block;
import net.minecraft.block.Blocks;
import net.minecraft.registry.RegistryKey;
import net.minecraft.world.biome.Biome;
import net.minecraft.world.gen.surfacebuilder.MaterialRules;
import net.minecraft.world.gen.surfacebuilder.MaterialRules.MaterialCondition;
import net.minecraft.world.gen.surfacebuilder.MaterialRules.MaterialRule;

import java.util.ArrayList;
import java.util.List;

/**
 * Custom surface rules for Rainbow biomes that place Rainbow blocks as terrain.
 * Each biome uses its color/shade for the surface and adjacent shades for depth.
 */
public class ModSurfaceRules {

    /**
     * Creates surface rules for all Rainbow biomes.
     * Returns a sequence rule that checks each biome and applies appropriate surface blocks.
     */
    public static MaterialRule createOverworldSurfaceRules() {
        List<MaterialRule> biomeRules = new ArrayList<>();

        for (Color color : Color.values()) {
            for (Shade shade : Shade.values()) {
                MaterialRule biomeRule = createBiomeSurfaceRule(color, shade);
                biomeRules.add(biomeRule);
            }
        }

        // Return sequence of all biome rules
        return MaterialRules.sequence(biomeRules.toArray(new MaterialRule[0]));
    }

    /**
     * Creates surface rules for a specific color/shade biome.
     */
    private static MaterialRule createBiomeSurfaceRule(Color color, Shade shade) {
        RegistryKey<Biome> biomeKey = ModBiomes.getBiomeKey(color, shade);

        // Get the blocks for this color/shade
        Block topBlock = ModBlocks.getBlock(color, shade, BlockType.BLOCK);
        Block underBlock = getUnderBlock(color, shade);

        // Condition: only apply in this biome
        MaterialCondition inBiome = MaterialRules.biome(biomeKey);

        // Surface rule: top layer is the main block
        MaterialRule topRule = MaterialRules.condition(
            MaterialRules.STONE_DEPTH_FLOOR,
            MaterialRules.block(topBlock.getDefaultState())
        );

        // Under rule: slightly below surface uses adjacent shade
        MaterialRule underRule = MaterialRules.condition(
            MaterialRules.STONE_DEPTH_FLOOR_WITH_SURFACE_DEPTH,
            MaterialRules.block(underBlock.getDefaultState())
        );

        // Combine rules in sequence (order matters - most specific first)
        // Top and under rules handle the surface layers
        MaterialRule surfaceSequence = MaterialRules.sequence(
            topRule,
            underRule
        );

        // Apply only in this biome
        return MaterialRules.condition(inBiome, surfaceSequence);
    }

    /**
     * Gets the block for the under layer (one shade darker, or same if darkest).
     */
    private static Block getUnderBlock(Color color, Shade shade) {
        Shade underShade = shade.getDarker();
        Block block = ModBlocks.getBlock(color, underShade, BlockType.BLOCK);
        return block != null ? block : Blocks.STONE;
    }

    /**
     * Gets the block for the deep layer (two shades darker, or darkest).
     */
    private static Block getDeepBlock(Color color, Shade shade) {
        Shade deepShade = shade.getDarker().getDarker();
        Block block = ModBlocks.getBlock(color, deepShade, BlockType.BLOCK);
        return block != null ? block : Blocks.DEEPSLATE;
    }

    /**
     * Creates a simple surface rule that replaces grass_block with a Rainbow block.
     * Useful for BiomeModifications feature approach.
     */
    public static MaterialRule createSimpleSurfaceRule(Color color, Shade shade) {
        Block topBlock = ModBlocks.getBlock(color, shade, BlockType.BLOCK);

        return MaterialRules.condition(
            MaterialRules.STONE_DEPTH_FLOOR,
            MaterialRules.block(topBlock.getDefaultState())
        );
    }
}
