
/*
 *    MCreator note: This file will be REGENERATED on each build.
 */
package rainbow.init;

import rainbow.RainbowMod;

import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.event.BuildCreativeModeTabContentsEvent;

import net.minecraft.world.item.CreativeModeTabs;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.core.registries.Registries;

@Mod.EventBusSubscriber(bus = Mod.EventBusSubscriber.Bus.MOD)
public class RainbowModTabs {
	public static final DeferredRegister<CreativeModeTab> REGISTRY = DeferredRegister.create(Registries.CREATIVE_MODE_TAB, RainbowMod.MODID);

	@SubscribeEvent
	public static void buildTabContentsVanilla(BuildCreativeModeTabContentsEvent tabData) {

		if (tabData.getTabKey() == CreativeModeTabs.BUILDING_BLOCKS) {
			tabData.accept(RainbowModBlocks.BLUE_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BLUE_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BLUE_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BLUE_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BLUE_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BLUE_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BLUE_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BLUE_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BLUE_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BLUE_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.BROWN_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.CYAN_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GRAY_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.GREEN_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_BLUE_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIGHT_GRAY_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.LIME_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.MAGENTA_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.ORANGE_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PINK_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.PURPLE_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.RED_900_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_50_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_100_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_200_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_300_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_400_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_500_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_600_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_700_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_800_BLOCK.get().asItem());
			tabData.accept(RainbowModBlocks.YELLOW_900_BLOCK.get().asItem());
		}
	}
}
