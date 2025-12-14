import DecorativeBlock from "./behaviors/DecorativeBlock.ts";
import { IColor } from "./build.ts";
import { $ } from "bun";
import { writeFile, rename, readFile, readdir } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import { copyFile, ensureDir } from "fs-extra";
import { ROOT_DIR } from "../_constants.ts";

const JAVA_DEST = join(ROOT_DIR, "java", "1.21.8");

export async function buildJava({
  namespace,
  blocks,
  texts,
  colors,
}: {
  namespace: string;
  blocks: Record<string, DecorativeBlock[]>;
  texts: Record<string, string>;
  colors: Record<string, IColor>;
}) {
  // Create a NeoForge mod for Minecraft Java 1.21.8
  // Scaffolds a minimal mod project and generates resources from the Bedrock-driven data

  // Paths
  const SRC_MAIN_JAVA = join(JAVA_DEST, "src", "main", "java");
  const PKG_DIR = join(SRC_MAIN_JAVA, "co", "jasongardner", "rainbow");
  const SRC_MAIN_RES = join(JAVA_DEST, "src", "main", "resources");
  const META_INF = join(SRC_MAIN_RES, "META-INF");
  const MOD_ID = "rainbowiii";
  const ASSETS = join(SRC_MAIN_RES, "assets", MOD_ID);
  const BLOCKSTATES = join(ASSETS, "blockstates");
  const MODELS_BLOCK = join(ASSETS, "models", "block");
  const MODELS_ITEM = join(ASSETS, "models", "item");
  const TEX_BLOCK = join(ASSETS, "textures", "block");
  const LANG_DIR = join(ASSETS, "lang");

  // Ensure folders
  await Promise.all([
    ensureDir(PKG_DIR),
    ensureDir(META_INF),
    ensureDir(BLOCKSTATES),
    ensureDir(MODELS_BLOCK),
    ensureDir(MODELS_ITEM),
    ensureDir(TEX_BLOCK),
    ensureDir(LANG_DIR),
  ]);

  // Write minimal pack.mcmeta
  const packMcMeta = {
    pack: {
      pack_format: 48,
      description: "RAINBOW III Java assets",
    },
  } as const;
  await writeFile(
    join(SRC_MAIN_RES, "pack.mcmeta"),
    JSON.stringify(packMcMeta, null, 2),
  );

  // Write minimal mods.toml for NeoForge
  const modsToml = `modLoader="javafml"
loaderVersion="[1,)"
license="MIT"
issueTrackerURL="https://github.com/jasonjgardner/minecraft-rtx-rainbow/issues"

[[mods]]
modId="${MOD_ID}"
version="3.0.0"
displayName="RAINBOW III"
authors="Jason Gardner"
description='''
Programmatically generated rainbow blocks and more.
'''
`;
  await writeFile(join(META_INF, "mods.toml"), modsToml, "utf-8");
  // Some NeoForge setups expect neoforge.mods.toml
  await writeFile(join(META_INF, "neoforge.mods.toml"), modsToml, "utf-8");

  // Main mod class wired to event bus and our registries
  const rainbowModJava = `package co.jasongardner.rainbow;

import net.neoforged.fml.common.Mod;
import net.neoforged.fml.javafmlmod.FMLJavaModLoadingContext;
import net.neoforged.bus.api.IEventBus;

@Mod("${MOD_ID}")
public class RainbowMod {
    public RainbowMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        RainbowRegistry.register(modEventBus);
    }
}
`;
  await writeFile(join(PKG_DIR, "RainbowMod.java"), rainbowModJava, "utf-8");

  // Registry class: registers blocks, items, and creative tab. Populates from generated ids.
  const allBlocks = Object.values(blocks).flat();
  const ids = allBlocks.map((b) => b.blockId);
  const idsJavaArray = ids.map((id) => `"${id}"`).join(", ");
  const rainbowRegistryJava = `package co.jasongardner.rainbow;

import net.minecraft.core.registries.Registries;
import net.minecraft.network.chat.Component;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.SoundType;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.RegistryObject;

public class RainbowRegistry {
    public static final String MODID = "${MOD_ID}";

    public static final DeferredRegister<Block> BLOCKS = DeferredRegister.create(Registries.BLOCK, MODID);
    public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(Registries.ITEM, MODID);
    public static final DeferredRegister<CreativeModeTab> TABS = DeferredRegister.create(Registries.CREATIVE_MODE_TAB, MODID);

    public static RegistryObject<CreativeModeTab> RAINBOW_TAB;

    public static void register(IEventBus modEventBus) {
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
        TABS.register(modEventBus);

        for (String id : IDS) {
            registerSimpleBlock(id);
        }

        RAINBOW_TAB = TABS.register("rainbow_tab", () -> CreativeModeTab.builder()
            .icon(() -> new ItemStack(ITEMS.getEntries().stream().findFirst().orElseThrow().get()))
            .title(Component.translatable("itemGroup.${MOD_ID}"))
            .displayItems((params, output) -> ITEMS.getEntries().forEach(ro -> output.accept(ro.get())))
            .build());
    }

    private static void registerSimpleBlock(String id) {
        RegistryObject<Block> block = BLOCKS.register(id, () -> new Block(BlockBehaviour.Properties.of().strength(1.5f).sound(SoundType.GLASS)));
        ITEMS.register(id, () -> new BlockItem(block.get(), new Item.Properties()));
    }

    private static final String[] IDS = new String[] { ${idsJavaArray} };
}
`;
  await writeFile(
    join(PKG_DIR, "RainbowRegistry.java"),
    rainbowRegistryJava,
    "utf-8",
  );

  // Generate lang file from provided texts -> translate to Forge/NeoForge keys
  // The Bedrock texts map uses tile.<ns>:<id>.name; for NeoForge we want block.<modid>.<id>
  const langEntries: Record<string, string> = {
    "itemGroup.${'rainbowiii'}": "RAINBOW III",
  };
  for (const [key, value] of Object.entries(texts)) {
    // Expecting key like: tile.rainbow:green_500_block.name
    const m = key.match(/^tile\.([^:]+):(.+)\.name$/);
    if (m) {
      const [, _ns, id] = m;
      langEntries[`block.${MOD_ID}.${id}`] = value;
    }
  }
  await writeFile(
    join(LANG_DIR, "en_us.json"),
    JSON.stringify(langEntries, null, 2),
  );

  // Build blockstates and models for each DecorativeBlock discovered

  await Promise.all(
    allBlocks.map(async (b) => {
      const blockId = b.blockId; // e.g. green_500_block

      // Blockstate (simple single-variant)
      const blockstate = {
        variants: {
          "": { model: `${MOD_ID}:block/${blockId}` },
        },
      } as const;
      await writeFile(
        join(BLOCKSTATES, `${blockId}.json`),
        JSON.stringify(blockstate, null, 2),
      );

      // Block model (cube_all)
      const modelBlock = {
        parent: "block/cube_all",
        textures: {
          all: `${MOD_ID}:block/${blockId}`,
        },
      } as const;
      await writeFile(
        join(MODELS_BLOCK, `${blockId}.json`),
        JSON.stringify(modelBlock, null, 2),
      );

      // Item model pointing to the block model
      const modelItem = {
        parent: `${MOD_ID}:block/${blockId}`,
      } as const;
      await writeFile(
        join(MODELS_ITEM, `${blockId}.json`),
        JSON.stringify(modelItem, null, 2),
      );
    }),
  );

  // Attempt to copy Bedrock textures as Java textures (use 16x as source)
  // Bedrock filename example: <color>_<shade>_block_basecolor.png -> Java expects <id>.png
  const bedrockTexDir = join(
    ROOT_DIR,
    "bedrock",
    "RP",
    "subpacks",
    "16x",
    "textures",
    "blocks",
  );
  try {
    await ensureDir(bedrockTexDir);
    const files = await readdir(bedrockTexDir);
    await Promise.all(
      files
        .filter((f) => /_block_basecolor\.png$/i.test(f))
        .map(async (f) => {
          const id = basename(f, "_basecolor.png"); // green_500_block
          const src = join(bedrockTexDir, f);
          const dest = join(TEX_BLOCK, `${id}.png`);
          await copyFile(src, dest);
        }),
    );
  } catch (_) {
    // If textures aren't available, skip copying
  }

  // Optional: Initialize gradle wrapper if needed (user can run manually)
  await $`./gradlew --version`.cwd(JAVA_DEST);
}
