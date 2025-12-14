import {
  BlockPermutation,
  system,
  world,
  DimensionLocation,
  Vector3,
} from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

const INTERVAL_TICKS = 10; // Update every 10 ticks (0.5 seconds)

// Special indices for inventory slots
const HOTBAR_SLOT_1 = -1;
const HOTBAR_SLOT_2 = -2;

// Block options for alive/dead cells
const BLOCK_OPTIONS = [
  // Inventory slots (special handling)
  "HOTBAR_SLOT_1",
  "HOTBAR_SLOT_2",
  // Rainbow lit blocks
  "rainbow:lime_500_lit",
  "rainbow:cyan_500_lit",
  "rainbow:blue_500_lit",
  "rainbow:magenta_500_lit",
  "rainbow:purple_500_lit",
  "rainbow:pink_500_lit",
  "rainbow:red_500_lit",
  "rainbow:orange_500_lit",
  "rainbow:yellow_500_lit",
  "rainbow:teal_500_lit",
  "rainbow:white_500_lit",
  // Rainbow lamp blocks
  "rainbow:lime_500_lamp",
  "rainbow:cyan_500_lamp",
  "rainbow:blue_500_lamp",
  "rainbow:magenta_500_lamp",
  "rainbow:purple_500_lamp",
  "rainbow:pink_500_lamp",
  "rainbow:red_500_lamp",
  "rainbow:orange_500_lamp",
  "rainbow:yellow_500_lamp",
  "rainbow:teal_500_lamp",
  "rainbow:white_500_lamp",
  // Rainbow blocks
  "rainbow:lime_500_block",
  "rainbow:cyan_500_block",
  "rainbow:blue_500_block",
  "rainbow:magenta_500_block",
  "rainbow:purple_500_block",
  "rainbow:pink_500_block",
  "rainbow:red_500_block",
  "rainbow:orange_500_block",
  "rainbow:yellow_500_block",
  "rainbow:teal_500_block",
  "rainbow:white_500_block",
  // Grayscale
  "rainbow:gray_900_block",
  "rainbow:gray_700_block",
  "rainbow:gray_500_block",
  "rainbow:gray_300_block",
  "rainbow:gray_100_block",
  // Vanilla blocks
  "minecraft:air",
  "minecraft:glass",
  "minecraft:white_stained_glass",
  "minecraft:redstone_block",
  "minecraft:glowstone",
  "minecraft:sea_lantern",
  "minecraft:shroomlight",
];

const BLOCK_LABELS = [
  // Inventory slots
  "§e⬛ Hotbar Slot 1",
  "§e⬛ Hotbar Slot 2",
  // Lit blocks
  "Lime Lit",
  "Cyan Lit",
  "Blue Lit",
  "Magenta Lit",
  "Purple Lit",
  "Pink Lit",
  "Red Lit",
  "Orange Lit",
  "Yellow Lit",
  "Teal Lit",
  "White Lit",
  // Lamp blocks
  "Lime Lamp",
  "Cyan Lamp",
  "Blue Lamp",
  "Magenta Lamp",
  "Purple Lamp",
  "Pink Lamp",
  "Red Lamp",
  "Orange Lamp",
  "Yellow Lamp",
  "Teal Lamp",
  "White Lamp",
  // Block variants
  "Lime Block",
  "Cyan Block",
  "Blue Block",
  "Magenta Block",
  "Purple Block",
  "Pink Block",
  "Red Block",
  "Orange Block",
  "Yellow Block",
  "Teal Block",
  "White Block",
  // Grayscale
  "Black",
  "Dark Gray",
  "Gray",
  "Light Gray",
  "White",
  // Vanilla
  "Air (invisible)",
  "Glass",
  "White Glass",
  "Redstone Block",
  "Glowstone",
  "Sea Lantern",
  "Shroomlight",
];

// Store actual block IDs from inventory slots
let hotbarBlock1: string = "minecraft:stone";
let hotbarBlock2: string = "minecraft:air";

// Grid orientation: "floor" (XZ plane), "wall" (XY plane), or "cube" (hollow 3D)
type Orientation = "floor" | "wall" | "cube";

// Settings
let BOARD_SIZE = 32;
let orientation: Orientation = "floor";
let aliveBlockIndex = 2; // lime_500_lit (index 2 after hotbar slots)
let deadBlockIndex = 57; // gray_900_block

// Helper to resolve block type from index (handles hotbar slots)
function getBlockType(index: number): string {
  const option = BLOCK_OPTIONS[index];
  if (option === "HOTBAR_SLOT_1") return hotbarBlock1;
  if (option === "HOTBAR_SLOT_2") return hotbarBlock2;
  return option;
}

// Read blocks from player's hotbar slots
function updateHotbarBlocks(player: any) {
  try {
    const inventory = player.getComponent("minecraft:inventory");
    if (!inventory?.container) return;

    // Slot 0 = first hotbar slot
    const slot1 = inventory.container.getItem(0);
    if (slot1?.typeId) {
      // Convert item ID to block ID (remove "minecraft:*_spawn_egg" etc.)
      hotbarBlock1 = slot1.typeId;
    }

    // Slot 1 = second hotbar slot
    const slot2 = inventory.container.getItem(1);
    if (slot2?.typeId) {
      hotbarBlock2 = slot2.typeId;
    }
  } catch (e) {
    // Ignore errors
  }
}

let isRunning = false;
let origin: Vector3 | null = null;
let runId: number | null = null;

let dimensionId: string | null = null;

// 2D array to store state: 0 = dead, 1 = alive
let grid: number[][] = [];
let prevGrid: number[][] = []; // Memoization: track previous state

function initializeGrid() {
  grid = [];
  prevGrid = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    grid[x] = [];
    prevGrid[x] = [];
    for (let z = 0; z < BOARD_SIZE; z++) {
      // Random initialization (30% chance of being alive)
      grid[x][z] = Math.random() < 0.3 ? 1 : 0;
      prevGrid[x][z] = -1; // Force initial draw
    }
  }
}

function countNeighbors(x: number, z: number): number {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const nx = x + i;
      const nz = z + j;
      if (nx >= 0 && nx < BOARD_SIZE && nz >= 0 && nz < BOARD_SIZE) {
        count += grid[nx][nz];
      }
    }
  }
  return count;
}

function updateGrid() {
  // Save current state for memoization before computing next
  prevGrid = grid.map((row) => [...row]);

  const newGrid: number[][] = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    newGrid[x] = [];
    for (let z = 0; z < BOARD_SIZE; z++) {
      const neighbors = countNeighbors(x, z);
      const isAlive = grid[x][z] === 1;

      if (isAlive) {
        if (neighbors < 2 || neighbors > 3) {
          newGrid[x][z] = 0; // Die
        } else {
          newGrid[x][z] = 1; // Stay alive
        }
      } else {
        if (neighbors === 3) {
          newGrid[x][z] = 1; // Reproduction
        } else {
          newGrid[x][z] = 0; // Stay dead
        }
      }
    }
  }
  grid = newGrid;
}

function getBlockLocation(i: number, j: number): Vector3 {
  if (!origin) return { x: 0, y: 0, z: 0 };
  if (orientation === "floor") {
    // Horizontal grid on XZ plane
    return { x: origin.x + i, y: origin.y, z: origin.z + j };
  } else {
    // Vertical grid on XY plane (wall)
    return { x: origin.x + i, y: origin.y + j, z: origin.z };
  }
}

function setBlock(dimension: any, location: Vector3, blockType: string) {
  try {
    const block = dimension.getBlock(location);
    if (block && block.typeId !== blockType) {
      block.setType(blockType);
    }
  } catch (e) {
    // Ignore errors (e.g. unloaded chunks)
  }
}

function drawCube(dimension: any) {
  if (!origin) return;
  const size = BOARD_SIZE;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // Memoization: skip if cell hasn't changed
      if (prevGrid[i]?.[j] === grid[i][j]) continue;

      const blockType =
        grid[i][j] === 1
          ? getBlockType(aliveBlockIndex)
          : getBlockType(deadBlockIndex);

      // Floor (bottom face) - y = origin.y
      setBlock(
        dimension,
        { x: origin.x + i, y: origin.y, z: origin.z + j },
        blockType,
      );

      // Ceiling (top face) - y = origin.y + size - 1
      setBlock(
        dimension,
        { x: origin.x + i, y: origin.y + size - 1, z: origin.z + j },
        blockType,
      );

      // Front wall - z = origin.z
      setBlock(
        dimension,
        { x: origin.x + i, y: origin.y + j, z: origin.z },
        blockType,
      );

      // Back wall - z = origin.z + size - 1
      setBlock(
        dimension,
        { x: origin.x + i, y: origin.y + j, z: origin.z + size - 1 },
        blockType,
      );

      // Left wall - x = origin.x
      setBlock(
        dimension,
        { x: origin.x, y: origin.y + j, z: origin.z + i },
        blockType,
      );

      // Right wall - x = origin.x + size - 1
      setBlock(
        dimension,
        { x: origin.x + size - 1, y: origin.y + j, z: origin.z + i },
        blockType,
      );
    }
  }
}

function drawGrid(dimension: any) {
  if (!origin) return;

  if (orientation === "cube") {
    drawCube(dimension);
    return;
  }

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      // Memoization: skip if cell hasn't changed
      if (prevGrid[i]?.[j] === grid[i][j]) continue;

      const blockType =
        grid[i][j] === 1
          ? getBlockType(aliveBlockIndex)
          : getBlockType(deadBlockIndex);
      const location = getBlockLocation(i, j);
      setBlock(dimension, location, blockType);
    }
  }
}

function startSimulation(player: any) {
  if (isRunning) return;

  const blockHit = player.getBlockFromViewDirection();
  if (!blockHit) {
    player.sendMessage("§cPlease look at a block to set the origin.");
    return;
  }

  origin = {
    x: Math.floor(blockHit.block.location.x),
    y: Math.floor(blockHit.block.location.y) + 1,
    z: Math.floor(blockHit.block.location.z),
  };
  dimensionId = player.dimension.id;

  // Read blocks from player's hotbar slots (for custom block options)
  updateHotbarBlocks(player);

  initializeGrid();
  isRunning = true;

  // Draw initial grid immediately
  drawGrid(player.dimension);

  player.sendMessage(
    `§aCellular Automata started (${BOARD_SIZE}x${BOARD_SIZE} ${orientation}) at ${origin.x}, ${origin.y}, ${origin.z}`,
  );

  runId = system.runInterval(() => {
    if (!isRunning || !origin || !dimensionId) {
      if (runId !== null) system.clearRun(runId);
      return;
    }
    const dim = world.getDimension(dimensionId);
    if (!dim) return;

    updateGrid();
    drawGrid(dim);
  }, INTERVAL_TICKS);
}

function stopSimulation(player: any) {
  isRunning = false;
  if (runId !== null) {
    system.clearRun(runId);
    runId = null;
  }
  player.sendMessage("§cCellular Automata stopped.");
}

const ORIENTATION_OPTIONS: Orientation[] = ["floor", "wall", "cube"];
const ORIENTATION_LABELS = [
  "Floor (horizontal)",
  "Wall (vertical)",
  "Cube (hollow)",
];

async function showSettingsMenu(player: any) {
  const orientIndex = ORIENTATION_OPTIONS.indexOf(orientation);
  const form = new ModalFormData()
    .title("Simulation Settings")
    .dropdown("Grid Size", ["32x32", "64x64"], BOARD_SIZE === 32 ? 0 : 1)
    .dropdown(
      "Orientation",
      ORIENTATION_LABELS,
      orientIndex >= 0 ? orientIndex : 0,
    )
    .dropdown("Alive Block", BLOCK_LABELS, aliveBlockIndex)
    .dropdown("Dead Block", BLOCK_LABELS, deadBlockIndex);

  system.run(async () => {
    const response = await form.show(player);
    if (response.canceled || !response.formValues) return;

    BOARD_SIZE = response.formValues[0] === 0 ? 32 : 64;
    orientation = ORIENTATION_OPTIONS[response.formValues[1] as number];
    aliveBlockIndex = response.formValues[2] as number;
    deadBlockIndex = response.formValues[3] as number;
    player.sendMessage(
      `§aSettings: ${BOARD_SIZE}x${BOARD_SIZE} ${orientation}\n§aAlive: ${BLOCK_LABELS[aliveBlockIndex]} | Dead: ${BLOCK_LABELS[deadBlockIndex]}`,
    );
  });
}

async function showMainMenu(player: any) {
  const status = isRunning ? "§aRunning" : "§cStopped";
  const form = new ActionFormData()
    .title("Cellular Automata")
    .body(
      `Status: ${status}\nSize: ${BOARD_SIZE}x${BOARD_SIZE} | ${orientation}\nAlive: ${BLOCK_LABELS[aliveBlockIndex]} | Dead: ${BLOCK_LABELS[deadBlockIndex]}`,
    )
    .button("Start Simulation")
    .button("Stop Simulation")
    .button("Reset Grid")
    .button("Settings");

  system.run(async () => {
    const response = await form.show(player);

    if (response.canceled) return;

    if (response.selection === 0) {
      startSimulation(player);
    } else if (response.selection === 1) {
      stopSimulation(player);
    } else if (response.selection === 2) {
      if (origin) {
        initializeGrid();
        player.sendMessage("§aGrid reset.");
      } else {
        player.sendMessage("§cNo active simulation to reset.");
      }
    } else if (response.selection === 3) {
      showSettingsMenu(player);
    }
  });
}

// Listen for script event: /scriptevent rainbow:automata
system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id !== "rainbow:automata") return;
  if (!event.sourceEntity || event.sourceEntity.typeId !== "minecraft:player")
    return;

  showMainMenu(event.sourceEntity);
});
