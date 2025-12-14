package co.jasongardner.rainbow.block;

import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import net.minecraft.block.AbstractBlock;
import net.minecraft.block.Block;
import net.minecraft.registry.RegistryKey;
import net.minecraft.sound.BlockSoundGroup;

/**
 * Metallic plate block - non-emissive with metal sounds.
 */
public class RainbowPlateBlock extends Block {
    private final Color color;
    private final Shade shade;

    public RainbowPlateBlock(Color color, Shade shade, RegistryKey<Block> key) {
        super(AbstractBlock.Settings.create()
                .registryKey(key)
                .mapColor(color.getMapColor())
                .strength(2.0f, 6.0f)
                .sounds(BlockSoundGroup.METAL)
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
