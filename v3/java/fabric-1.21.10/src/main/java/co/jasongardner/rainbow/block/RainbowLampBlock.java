package co.jasongardner.rainbow.block;

import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import net.minecraft.block.Block;
import net.minecraft.block.AbstractBlock;
import net.minecraft.registry.RegistryKey;
import net.minecraft.sound.BlockSoundGroup;

/**
 * Emissive lamp block - full light emission (15).
 */
public class RainbowLampBlock extends Block {
    private final Color color;
    private final Shade shade;

    public RainbowLampBlock(Color color, Shade shade, RegistryKey<Block> key) {
        super(AbstractBlock.Settings.create()
                .registryKey(key)
                .mapColor(color.getMapColor())
                .strength(1.5f, 6.0f)
                .sounds(BlockSoundGroup.GLASS)
                .luminance(state -> 15)
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
