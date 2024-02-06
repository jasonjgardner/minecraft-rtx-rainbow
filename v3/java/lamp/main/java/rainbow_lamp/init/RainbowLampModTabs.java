
/*
 *    MCreator note: This file will be REGENERATED on each build.
 */
package rainbow_lamp.init;

import rainbow_lamp.RainbowLampMod;

import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.event.BuildCreativeModeTabContentsEvent;

import net.minecraft.world.item.CreativeModeTabs;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.core.registries.Registries;

@Mod.EventBusSubscriber(bus = Mod.EventBusSubscriber.Bus.MOD)
public class RainbowLampModTabs {
	public static final DeferredRegister<CreativeModeTab> REGISTRY = DeferredRegister.create(Registries.CREATIVE_MODE_TAB, RainbowLampMod.MODID);

	@SubscribeEvent
	public static void buildTabContentsVanilla(BuildCreativeModeTabContentsEvent tabData) {

		if (tabData.getTabKey() == CreativeModeTabs.BUILDING_BLOCKS) {
			tabData.accept(RainbowLampModBlocks.BLUE_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BLUE_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BLUE_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BLUE_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BLUE_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BLUE_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BLUE_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BLUE_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BLUE_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BLUE_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.BROWN_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.CYAN_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GRAY_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.GREEN_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_BLUE_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIGHT_GRAY_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.LIME_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.MAGENTA_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.ORANGE_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PINK_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.PURPLE_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.RED_900_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_50_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_100_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_200_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_300_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_400_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_500_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_600_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_700_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_800_LAMP.get().asItem());
			tabData.accept(RainbowLampModBlocks.YELLOW_900_LAMP.get().asItem());
		}
	}
}
