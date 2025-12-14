/*
 *    MCreator note:
 *
 *    If you lock base mod element files, you can edit this file and it won't get overwritten.
 *    If you change your modid or package, you need to apply these changes to this file MANUALLY.
 *
 *    Settings in @Mod annotation WON'T be changed in case of the base mod element
 *    files lock too, so you need to set them manually here in such case.
 *
 *    If you do not lock base mod element files in Workspace settings, this file
 *    will be REGENERATED on each build.
 *
 */
package rainbow;

import rainbow.init.RainbowModBlocks;
import rainbow.init.RainbowModItems;

import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.itemgroup.v1.FabricItemGroup;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.item.ItemGroup;
import net.minecraft.item.ItemStack;
import net.minecraft.text.Text;
import net.minecraft.util.Identifier;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class RainbowMod implements ModInitializer {
    public static final Logger LOGGER = LogManager.getLogger("rainbow");
    public static final String MODID = "rainbow";
    
    // Create an item group for creative tab
    public static final ItemGroup ITEM_GROUP = FabricItemGroup.builder()
        .displayName(Text.translatable("itemGroup.rainbow.main"))
        .icon(() -> new ItemStack(RainbowModBlocks.BLUE_500_BLOCK))
        .build();

    @Override
    public void onInitialize() {
        LOGGER.info("Initializing Rainbow Block Mod");
        
        // Register blocks and items
        RainbowModBlocks.registerBlocks();
        RainbowModItems.registerItems();
        
        // Register the item group
        Registry.register(Registries.ITEM_GROUP, new Identifier(MODID, "main"), ITEM_GROUP);
    }
}
