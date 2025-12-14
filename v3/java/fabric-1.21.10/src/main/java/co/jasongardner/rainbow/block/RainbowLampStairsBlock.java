package co.jasongardner.rainbow.block;

import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import net.minecraft.block.AbstractBlock;
import net.minecraft.block.Block;
import net.minecraft.block.BlockState;
import net.minecraft.block.Blocks;
import net.minecraft.block.StairsBlock;
import net.minecraft.registry.RegistryKey;
import net.minecraft.sound.BlockSoundGroup;

/**
 * Emissive lamp stairs block - full light emission (15), supports all stair orientations.
 */
public class RainbowLampStairsBlock extends StairsBlock {
    private final Color color;
    private final Shade shade;

    public RainbowLampStairsBlock(Color color, Shade shade, BlockState baseBlockState, RegistryKey<Block> key) {
        super(baseBlockState, AbstractBlock.Settings.create()
                .registryKey(key)
                .mapColor(color.getMapColor())
                .strength(1.5f, 6.0f)
                .sounds(BlockSoundGroup.GLASS)
                .luminance(state -> 15)
                .requiresTool());
        this.color = color;
        this.shade = shade;
    }

    /**
     * Factory method using default base block state.
     */
    public static RainbowLampStairsBlock create(Color color, Shade shade, RegistryKey<Block> key) {
        return new RainbowLampStairsBlock(color, shade, Blocks.GLOWSTONE.getDefaultState(), key);
    }

    public Color getColor() {
        return color;
    }

    public Shade getShade() {
        return shade;
    }
}
