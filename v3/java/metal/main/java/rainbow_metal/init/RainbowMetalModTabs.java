
/*
 *    MCreator note: This file will be REGENERATED on each build.
 */
package rainbow_metal.init;

import rainbow_metal.RainbowMetalMod;

import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.event.BuildCreativeModeTabContentsEvent;

import net.minecraft.world.item.CreativeModeTabs;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.core.registries.Registries;

@Mod.EventBusSubscriber(bus = Mod.EventBusSubscriber.Bus.MOD)
public class RainbowMetalModTabs {
	public static final DeferredRegister<CreativeModeTab> REGISTRY = DeferredRegister.create(Registries.CREATIVE_MODE_TAB, RainbowMetalMod.MODID);

	@SubscribeEvent
	public static void buildTabContentsVanilla(BuildCreativeModeTabContentsEvent tabData) {

		if (tabData.getTabKey() == CreativeModeTabs.BUILDING_BLOCKS) {
			tabData.accept(RainbowMetalModBlocks.BLUE_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BLUE_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BLUE_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BLUE_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BLUE_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BLUE_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BLUE_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BLUE_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.BROWN_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.CYAN_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GRAY_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.GREEN_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_BLUE_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIGHT_GRAY_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.LIME_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.MAGENTA_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.ORANGE_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PINK_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.PURPLE_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.RED_900_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_50_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_100_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_200_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_300_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_400_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_500_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_600_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_700_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_800_PLATE.get().asItem());
			tabData.accept(RainbowMetalModBlocks.YELLOW_900_PLATE.get().asItem());
		}
	}
}
