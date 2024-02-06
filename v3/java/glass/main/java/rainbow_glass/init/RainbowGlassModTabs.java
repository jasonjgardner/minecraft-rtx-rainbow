
/*
 *    MCreator note: This file will be REGENERATED on each build.
 */
package rainbow_glass.init;

import rainbow_glass.RainbowGlassMod;

import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.event.BuildCreativeModeTabContentsEvent;

import net.minecraft.world.item.CreativeModeTabs;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.core.registries.Registries;

@Mod.EventBusSubscriber(bus = Mod.EventBusSubscriber.Bus.MOD)
public class RainbowGlassModTabs {
	public static final DeferredRegister<CreativeModeTab> REGISTRY = DeferredRegister.create(Registries.CREATIVE_MODE_TAB, RainbowGlassMod.MODID);

	@SubscribeEvent
	public static void buildTabContentsVanilla(BuildCreativeModeTabContentsEvent tabData) {

		if (tabData.getTabKey() == CreativeModeTabs.BUILDING_BLOCKS) {
			tabData.accept(RainbowGlassModBlocks.BLUE_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BLUE_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BLUE_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BLUE_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BLUE_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BLUE_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BLUE_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BLUE_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BLUE_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BLUE_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.BROWN_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.CYAN_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GRAY_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.GREEN_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_BLUE_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIGHT_GRAY_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.LIME_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.MAGENTA_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.ORANGE_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PINK_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.PURPLE_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.RED_900_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_50_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_100_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_200_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_300_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_400_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_500_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_600_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_700_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_800_GLASS.get().asItem());
			tabData.accept(RainbowGlassModBlocks.YELLOW_900_GLASS.get().asItem());
		}
	}
}
