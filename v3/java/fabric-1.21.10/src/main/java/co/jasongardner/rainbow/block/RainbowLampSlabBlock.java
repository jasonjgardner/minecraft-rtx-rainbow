package co.jasongardner.rainbow.block;

import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import net.minecraft.block.AbstractBlock;
import net.minecraft.block.Block;
import net.minecraft.block.SlabBlock;
import net.minecraft.registry.RegistryKey;
import net.minecraft.sound.BlockSoundGroup;

/**
 * Emissive lamp slab block - light emission (14), supports top/bottom placement.
 */
public class RainbowLampSlabBlock extends SlabBlock {
    private final Color color;
    private final Shade shade;

    public RainbowLampSlabBlock(Color color, Shade shade, RegistryKey<Block> key) {
        super(AbstractBlock.Settings.create()
                .registryKey(key)
                .mapColor(color.getMapColor())
                .strength(1.5f, 6.0f)
                .sounds(BlockSoundGroup.GLASS)
                .luminance(state -> 14)
                .requiresTool());
        this.color = color;
        this.shade = shade;
    }

    public Color getColor() {
        return color;
    }

    public Shade getShade() {
        return shade;
    }
}
