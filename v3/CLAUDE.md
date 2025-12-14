# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Rainbow III**, a Minecraft Bedrock Edition resource/behavior pack generator that creates colored decorative blocks with RTX/PBR texture support. It generates hundreds of block variants across 14 color families (blue, brown, cyan, gray, green, light_blue, light_gray, lime, magenta, orange, pink, purple, red, yellow) with 10 shade levels each (50-900).

## Build Commands

```bash
# Install dependencies (uses Bun runtime)
bun install

# Full distribution build - formats, builds assets, compiles scripts, deploys
bun run dist

# Individual steps:
bun run format          # Format TypeScript files with Prettier
bun run build           # Generate block JSONs, textures, manifests, biomes
bun run compile         # Bundle src/main.ts to Bedrock addon scripts
bun run deploy          # Copy packs to Minecraft Bedrock dev folders

# Enable Minecraft loopback for local testing
bun run enablemcloopback
bun run enablemcpreviewloopback
```

## Architecture

### Directory Structure

- `scripts/builder/` - Build system that generates all pack assets
  - `app/build.ts` - Main build orchestrator, generates blocks for each behavior pack
  - `app/behaviors/` - Block type classes (DecorativeBlock, Lamp, Glass, Plate, etc.)
  - `app/biomes.ts` - Biome generation with themed color schemes
  - `app/colorSchemes.ts` - Color harmony system for biome palette generation
  - `app/java.ts` - Java Edition resource pack generator
  - `_constants.ts` - Namespace (`rainbow`), paths, version constants
  - `types.ts` - Shared TypeScript types (Shades, IBlock, etc.)

- `src/` - Minecraft Script API code (runs in-game)
  - `main.ts` - Entry point, debug HUD showing block info
  - `proximityBlock.ts`, `morphBlock.ts`, `cellularAutomata.ts` - Block behaviors

- `bedrock/` - Generated output
  - `BP/` - Behavior packs (one per block category: Block Colors, Lamps, Glass, etc.)
  - `RP/` - Resource pack with textures, models, lighting configs
  - `RP/subpacks/` - Resolution variants (16x through 1024x)

### Block Generation System

The build system uses a class hierarchy for block types. `DecorativeBlock` is the base class; specialized blocks (Lamp, Glass, Plate) extend it with custom components, geometries, and material instances.

Each block generates:
- Block JSON definition (in BP)
- Texture set JSON referencing PBR maps (`_basecolor`, `_mer`, `_normal`/`_height`)
- Language entries for display names
- Entries in `blocks.json` and terrain atlas

### Key Constants

- Namespace: `rainbow` (all block IDs prefixed with `rainbow:`)
- Block version: `1.21.120`
- Target Minecraft version: `1.21.120`
- Colors: 14 base colors x 10 shades = 140 color variants per block type

### Deployment

`deploy.ts` copies generated packs to:
- `%APPDATA%/Minecraft Bedrock/Users/Shared/games/com.mojang/development_*_packs/`
- Same for Minecraft Bedrock Preview

## TypeScript Configuration

- Uses ES2020 modules with Node resolution
- Scripts output to `bedrock/BP/rainbow-addon/scripts/`
- Strict mode enabled

## Java Edition (Fabric 1.21.10)

### Location

`java/fabric-1.21.10/` - Fabric mod port of the Bedrock addon

### Build Commands

```bash
cd java/fabric-1.21.10

# Build the mod JAR
./gradlew build

# Run data generation (loot tables, tags)
./gradlew runDatagen

# Run client for testing
./gradlew runClient
```

### Fabric Mod Structure

- `src/main/java/co/jasongardner/rainbow/` - Java source code
  - `RainbowMod.java` - Main entry point (ModInitializer)
  - `block/` - Block classes (RainbowBlock, RainbowLampBlock, etc.)
  - `blockentity/` - Block entities for proximity/morph detection
  - `command/` - `/rainbow automata` command for cellular automata
  - `automata/` - Conway's Game of Life implementation
  - `data/` - Color/Shade enums (RainbowColors.java)
  - `itemgroup/` - Creative tab organization
  - `datagen/` - Fabric data generation providers

- `src/main/resources/assets/rainbowiii/` - Generated assets
  - `blockstates/` - 980 blockstate JSON files
  - `models/block/` - Block models (includes slab/stair variants)
  - `models/item/` - Item models
  - `textures/block/` - 16x textures (copied from Bedrock)
  - `lang/en_us.json` - Translations

- `resourcepacks/` - HD texture packs (32x, 64x)

### Asset Generation

```bash
# Generate Fabric assets from Bedrock textures
bun run scripts/builder/app/fabric.ts
```

This copies textures from `bedrock/RP/subpacks/` and generates all JSON files.

### Block Types (7 core types, 980 total blocks)

| Type | Class | Light | Notes |
|------|-------|-------|-------|
| block | RainbowBlock | 0 | Basic decorative |
| lamp | RainbowLampBlock | 15 | Full emission |
| lamp_slab | RainbowLampSlabBlock | 14 | SlabBlock with light |
| lamp_stairs | RainbowLampStairsBlock | 15 | StairsBlock with light |
| glass | RainbowGlassBlock | 0 | Transparent |
| glass_slab | RainbowGlassSlabBlock | 0 | Transparent slab |
| plate | RainbowPlateBlock | 0 | Metal sound |

### Interactive Features

- **Proximity Block Entity**: Detects entities with "proxy" tag within 10 blocks
- **Morph Block Entity**: Rotates based on nearest player's head position
- **Cellular Automata**: `/rainbow automata start|stop|reset|settings` - Conway's Game of Life
