package co.jasongardner.rainbow.block;

import co.jasongardner.rainbow.RainbowMod;
import co.jasongardner.rainbow.data.RainbowColors;
import co.jasongardner.rainbow.data.RainbowColors.BlockType;
import co.jasongardner.rainbow.data.RainbowColors.Color;
import co.jasongardner.rainbow.data.RainbowColors.Shade;
import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;
import net.minecraft.block.Block;
import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroups;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.util.Identifier;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Handles registration of all 980 rainbow blocks (7 types x 14 colors x 10 shades).
 */
public class ModBlocks {
    // Store all registered blocks by their ID
    private static final Map<String, Block> BLOCKS = new HashMap<>();

    // Store blocks by type for easy access
    private static final List<Block> GLASS_BLOCKS = new ArrayList<>();
    private static final List<Block> LAMP_BLOCKS = new ArrayList<>();
    private static final List<Block> DECORATIVE_BLOCKS = new ArrayList<>();
    private static final List<Block> PLATE_BLOCKS = new ArrayList<>();
    private static final List<Block> SLAB_BLOCKS = new ArrayList<>();
    private static final List<Block> STAIRS_BLOCKS = new ArrayList<>();

    /**
     * Registers all rainbow blocks.
     */
    public static void registerBlocks() {
        RainbowMod.LOGGER.info("Registering rainbow blocks...");

        for (Color color : Color.values()) {
            for (Shade shade : Shade.values()) {
                // Register each block type for this color/shade combination
                registerDecorativeBlock(color, shade);
                registerLampBlock(color, shade);
                registerLampSlabBlock(color, shade);
                registerLampStairsBlock(color, shade);
                registerGlassBlock(color, shade);
                registerGlassSlabBlock(color, shade);
                registerPlateBlock(color, shade);
            }
        }

        RainbowMod.LOGGER.info("Registered {} rainbow blocks.", BLOCKS.size());
    }

    private static RegistryKey<Block> createBlockKey(String id) {
        return RegistryKey.of(RegistryKeys.BLOCK, Identifier.of(RainbowMod.MOD_ID, id));
    }

    private static RegistryKey<Item> createItemKey(String id) {
        return RegistryKey.of(RegistryKeys.ITEM, Identifier.of(RainbowMod.MOD_ID, id));
    }

    private static void registerDecorativeBlock(Color color, Shade shade) {
        String id = RainbowColors.getBlockId(color, shade, BlockType.BLOCK);
        RegistryKey<Block> key = createBlockKey(id);
        Block block = new RainbowBlock(color, shade, key);
        registerBlock(id, block);
        DECORATIVE_BLOCKS.add(block);
    }

    private static void registerLampBlock(Color color, Shade shade) {
        String id = RainbowColors.getBlockId(color, shade, BlockType.LAMP);
        RegistryKey<Block> key = createBlockKey(id);
        Block block = new RainbowLampBlock(color, shade, key);
        registerBlock(id, block);
        LAMP_BLOCKS.add(block);
    }

    private static void registerLampSlabBlock(Color color, Shade shade) {
        String id = RainbowColors.getBlockId(color, shade, BlockType.LAMP_SLAB);
        RegistryKey<Block> key = createBlockKey(id);
        Block block = new RainbowLampSlabBlock(color, shade, key);
        registerBlock(id, block);
        LAMP_BLOCKS.add(block);
        SLAB_BLOCKS.add(block);
    }

    private static void registerLampStairsBlock(Color color, Shade shade) {
        String id = RainbowColors.getBlockId(color, shade, BlockType.LAMP_STAIRS);
        RegistryKey<Block> key = createBlockKey(id);
        Block block = RainbowLampStairsBlock.create(color, shade, key);
        registerBlock(id, block);
        LAMP_BLOCKS.add(block);
        STAIRS_BLOCKS.add(block);
    }

    private static void registerGlassBlock(Color color, Shade shade) {
        String id = RainbowColors.getBlockId(color, shade, BlockType.GLASS);
        RegistryKey<Block> key = createBlockKey(id);
        Block block = new RainbowGlassBlock(color, shade, key);
        registerBlock(id, block);
        GLASS_BLOCKS.add(block);
    }

    private static void registerGlassSlabBlock(Color color, Shade shade) {
        String id = RainbowColors.getBlockId(color, shade, BlockType.GLASS_SLAB);
        RegistryKey<Block> key = createBlockKey(id);
        Block block = new RainbowGlassSlabBlock(color, shade, key);
        registerBlock(id, block);
        GLASS_BLOCKS.add(block);
        SLAB_BLOCKS.add(block);
    }

    private static void registerPlateBlock(Color color, Shade shade) {
        String id = RainbowColors.getBlockId(color, shade, BlockType.PLATE);
        RegistryKey<Block> key = createBlockKey(id);
        Block block = new RainbowPlateBlock(color, shade, key);
        registerBlock(id, block);
        PLATE_BLOCKS.add(block);
    }

    /**
     * Registers a block and its corresponding BlockItem.
     */
    private static void registerBlock(String id, Block block) {
        Identifier identifier = Identifier.of(RainbowMod.MOD_ID, id);

        // Register the block
        Registry.register(Registries.BLOCK, identifier, block);

        // Register the BlockItem with registry key
        RegistryKey<Item> itemKey = createItemKey(id);
        BlockItem blockItem = new BlockItem(block, new Item.Settings().registryKey(itemKey));
        Registry.register(Registries.ITEM, identifier, blockItem);

        BLOCKS.put(id, block);
    }

    /**
     * Gets a block by its ID.
     */
    public static Block getBlock(String id) {
        return BLOCKS.get(id);
    }

    /**
     * Gets a block by color, shade, and type.
     */
    public static Block getBlock(Color color, Shade shade, BlockType type) {
        return BLOCKS.get(RainbowColors.getBlockId(color, shade, type));
    }

    /**
     * Gets all registered blocks.
     */
    public static Map<String, Block> getAllBlocks() {
        return BLOCKS;
    }

    /**
     * Gets all glass blocks (for render layer registration).
     */
    public static List<Block> getGlassBlocks() {
        return GLASS_BLOCKS;
    }

    /**
     * Gets all lamp blocks.
     */
    public static List<Block> getLampBlocks() {
        return LAMP_BLOCKS;
    }

    /**
     * Gets all decorative blocks.
     */
    public static List<Block> getDecorativeBlocks() {
        return DECORATIVE_BLOCKS;
    }

    /**
     * Gets all plate blocks.
     */
    public static List<Block> getPlateBlocks() {
        return PLATE_BLOCKS;
    }

    /**
     * Gets the total number of registered blocks.
     */
    public static int getBlockCount() {
        return BLOCKS.size();
    }
}
