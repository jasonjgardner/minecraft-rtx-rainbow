package co.jasongardner.rainbow.itemgroup;

import co.jasongardner.rainbow.RainbowMod;
import co.jasongardner.rainbow.block.ModBlocks;
import co.jasongardner.rainbow.data.RainbowColors.BlockType;
import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import net.fabricmc.fabric.api.itemgroup.v1.FabricItemGroup;
import net.minecraft.block.Block;
import net.minecraft.item.ItemGroup;
import net.minecraft.item.ItemStack;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.text.Text;
import net.minecraft.util.Identifier;

import java.util.HashMap;
import java.util.Map;

/**
 * Registers creative mode item groups for Rainbow III blocks.
 * Provides both type-based tabs (all lamps, all glass, etc.) and
 * color-based tabs (all blue blocks, all red blocks, etc.) for
 * flexible browsing.
 */
public class ModItemGroups {
    // Type-based item group registry keys
    public static final RegistryKey<ItemGroup> BLOCKS_KEY = RegistryKey.of(
            RegistryKeys.ITEM_GROUP, Identifier.of(RainbowMod.MOD_ID, "blocks"));
    public static final RegistryKey<ItemGroup> LAMPS_KEY = RegistryKey.of(
            RegistryKeys.ITEM_GROUP, Identifier.of(RainbowMod.MOD_ID, "lamps"));
    public static final RegistryKey<ItemGroup> GLASS_KEY = RegistryKey.of(
            RegistryKeys.ITEM_GROUP, Identifier.of(RainbowMod.MOD_ID, "glass"));
    public static final RegistryKey<ItemGroup> PLATES_KEY = RegistryKey.of(
            RegistryKeys.ITEM_GROUP, Identifier.of(RainbowMod.MOD_ID, "plates"));

    // Type-based item groups
    public static ItemGroup RAINBOW_BLOCKS;
    public static ItemGroup RAINBOW_LAMPS;
    public static ItemGroup RAINBOW_GLASS;
    public static ItemGroup RAINBOW_PLATES;

    // Color-based item groups (one per color)
    public static final Map<Color, ItemGroup> COLOR_GROUPS = new HashMap<>();

    public static void registerItemGroups() {
        RainbowMod.LOGGER.info("Registering item groups...");

        // Register type-based tabs
        registerTypeBasedTabs();

        // Register color-based tabs
        registerColorBasedTabs();

        RainbowMod.LOGGER.info("Registered {} item groups.", 4 + Color.values().length);
    }

    /**
     * Registers the 4 type-based creative tabs (Blocks, Lamps, Glass, Plates).
     */
    private static void registerTypeBasedTabs() {
        // Rainbow Blocks (decorative)
        RAINBOW_BLOCKS = Registry.register(Registries.ITEM_GROUP,
                BLOCKS_KEY,
                FabricItemGroup.builder()
                        .icon(() -> {
                            Block block = ModBlocks.getBlock(Color.BLUE, Shade.S500, BlockType.BLOCK);
                            return block != null ? new ItemStack(block) : ItemStack.EMPTY;
                        })
                        .displayName(Text.translatable("itemGroup.rainbow.blocks"))
                        .entries((context, entries) -> {
                            for (Color color : Color.values()) {
                                for (Shade shade : Shade.values()) {
                                    Block block = ModBlocks.getBlock(color, shade, BlockType.BLOCK);
                                    if (block != null) {
                                        entries.add(block);
                                    }
                                }
                            }
                        })
                        .build());

        // Rainbow Lamps (emissive blocks, slabs, stairs)
        RAINBOW_LAMPS = Registry.register(Registries.ITEM_GROUP,
                LAMPS_KEY,
                FabricItemGroup.builder()
                        .icon(() -> {
                            Block block = ModBlocks.getBlock(Color.LIME, Shade.S500, BlockType.LAMP);
                            return block != null ? new ItemStack(block) : ItemStack.EMPTY;
                        })
                        .displayName(Text.translatable("itemGroup.rainbow.lamps"))
                        .entries((context, entries) -> {
                            for (Color color : Color.values()) {
                                for (Shade shade : Shade.values()) {
                                    // Full lamps
                                    Block lamp = ModBlocks.getBlock(color, shade, BlockType.LAMP);
                                    if (lamp != null) entries.add(lamp);
                                    // Lamp slabs
                                    Block lampSlab = ModBlocks.getBlock(color, shade, BlockType.LAMP_SLAB);
                                    if (lampSlab != null) entries.add(lampSlab);
                                    // Lamp stairs
                                    Block lampStairs = ModBlocks.getBlock(color, shade, BlockType.LAMP_STAIRS);
                                    if (lampStairs != null) entries.add(lampStairs);
                                }
                            }
                        })
                        .build());

        // Rainbow Glass (transparent blocks and slabs)
        RAINBOW_GLASS = Registry.register(Registries.ITEM_GROUP,
                GLASS_KEY,
                FabricItemGroup.builder()
                        .icon(() -> {
                            Block block = ModBlocks.getBlock(Color.CYAN, Shade.S500, BlockType.GLASS);
                            return block != null ? new ItemStack(block) : ItemStack.EMPTY;
                        })
                        .displayName(Text.translatable("itemGroup.rainbow.glass"))
                        .entries((context, entries) -> {
                            for (Color color : Color.values()) {
                                for (Shade shade : Shade.values()) {
                                    // Full glass
                                    Block glass = ModBlocks.getBlock(color, shade, BlockType.GLASS);
                                    if (glass != null) entries.add(glass);
                                    // Glass slabs
                                    Block glassSlab = ModBlocks.getBlock(color, shade, BlockType.GLASS_SLAB);
                                    if (glassSlab != null) entries.add(glassSlab);
                                }
                            }
                        })
                        .build());

        // Rainbow Plates (metallic blocks)
        RAINBOW_PLATES = Registry.register(Registries.ITEM_GROUP,
                PLATES_KEY,
                FabricItemGroup.builder()
                        .icon(() -> {
                            Block block = ModBlocks.getBlock(Color.GRAY, Shade.S500, BlockType.PLATE);
                            return block != null ? new ItemStack(block) : ItemStack.EMPTY;
                        })
                        .displayName(Text.translatable("itemGroup.rainbow.plates"))
                        .entries((context, entries) -> {
                            for (Color color : Color.values()) {
                                for (Shade shade : Shade.values()) {
                                    Block plate = ModBlocks.getBlock(color, shade, BlockType.PLATE);
                                    if (plate != null) entries.add(plate);
                                }
                            }
                        })
                        .build());
    }

    /**
     * Registers color-based creative tabs (one per color family).
     * Each tab contains all block types for that color.
     */
    private static void registerColorBasedTabs() {
        for (Color color : Color.values()) {
            RegistryKey<ItemGroup> key = RegistryKey.of(
                    RegistryKeys.ITEM_GROUP,
                    Identifier.of(RainbowMod.MOD_ID, "color_" + color.getId()));

            ItemGroup group = Registry.register(Registries.ITEM_GROUP,
                    key,
                    FabricItemGroup.builder()
                            .icon(() -> {
                                // Use the 500 shade lamp as icon for good visibility
                                Block block = ModBlocks.getBlock(color, Shade.S500, BlockType.LAMP);
                                return block != null ? new ItemStack(block) : ItemStack.EMPTY;
                            })
                            .displayName(Text.translatable("itemGroup.rainbow.color." + color.getId()))
                            .entries((context, entries) -> {
                                // Add all block types for this color, organized by shade
                                for (Shade shade : Shade.values()) {
                                    // Decorative block
                                    Block block = ModBlocks.getBlock(color, shade, BlockType.BLOCK);
                                    if (block != null) entries.add(block);

                                    // Lamp variants
                                    Block lamp = ModBlocks.getBlock(color, shade, BlockType.LAMP);
                                    if (lamp != null) entries.add(lamp);
                                    Block lampSlab = ModBlocks.getBlock(color, shade, BlockType.LAMP_SLAB);
                                    if (lampSlab != null) entries.add(lampSlab);
                                    Block lampStairs = ModBlocks.getBlock(color, shade, BlockType.LAMP_STAIRS);
                                    if (lampStairs != null) entries.add(lampStairs);

                                    // Glass variants
                                    Block glass = ModBlocks.getBlock(color, shade, BlockType.GLASS);
                                    if (glass != null) entries.add(glass);
                                    Block glassSlab = ModBlocks.getBlock(color, shade, BlockType.GLASS_SLAB);
                                    if (glassSlab != null) entries.add(glassSlab);

                                    // Plate
                                    Block plate = ModBlocks.getBlock(color, shade, BlockType.PLATE);
                                    if (plate != null) entries.add(plate);
                                }
                            })
                            .build());

            COLOR_GROUPS.put(color, group);
        }
    }
}
