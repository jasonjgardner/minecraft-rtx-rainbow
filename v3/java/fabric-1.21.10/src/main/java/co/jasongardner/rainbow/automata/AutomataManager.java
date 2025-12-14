package co.jasongardner.rainbow.automata;

import co.jasongardner.rainbow.RainbowMod;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents;
import net.minecraft.block.Block;
import net.minecraft.block.Blocks;
import net.minecraft.registry.Registries;
import net.minecraft.server.world.ServerWorld;
import net.minecraft.util.Identifier;
import net.minecraft.util.math.BlockPos;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Manages cellular automata simulations (Conway's Game of Life).
 * Each player can have their own simulation running.
 */
public class AutomataManager {
    private static AutomataManager INSTANCE;
    private static final int INTERVAL_TICKS = 10; // Update every 10 ticks (0.5 seconds)

    private final Map<UUID, AutomataSession> sessions = new HashMap<>();
    private int tickCounter = 0;
    private boolean initialized = false;

    // Default block options
    public static final String DEFAULT_ALIVE_BLOCK = "rainbow:lime_500_lamp";
    public static final String DEFAULT_DEAD_BLOCK = "rainbow:gray_900_block";

    private AutomataManager() {
    }

    public static AutomataManager getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new AutomataManager();
        }
        return INSTANCE;
    }

    /**
     * Initializes the tick handler. Call this from mod initialization.
     */
    public void initialize() {
        if (initialized) return;

        ServerTickEvents.END_SERVER_TICK.register(server -> {
            tickCounter++;
            if (tickCounter >= INTERVAL_TICKS) {
                tickCounter = 0;
                tickAllSessions();
            }
        });

        initialized = true;
        RainbowMod.LOGGER.info("Automata manager initialized.");
    }

    /**
     * Starts a new simulation for a player.
     */
    public void start(ServerWorld world, BlockPos origin, UUID playerId) {
        AutomataSession session = sessions.computeIfAbsent(playerId, id -> new AutomataSession());
        session.start(world, origin);
    }

    /**
     * Stops a player's simulation.
     */
    public void stop(UUID playerId) {
        AutomataSession session = sessions.get(playerId);
        if (session != null) {
            session.stop();
        }
    }

    /**
     * Resets a player's simulation grid.
     */
    public void reset(UUID playerId) {
        AutomataSession session = sessions.get(playerId);
        if (session != null) {
            session.reset();
        }
    }

    /**
     * Updates settings for a player's simulation.
     */
    public void setSettings(UUID playerId, int size, String orientation) {
        AutomataSession session = sessions.computeIfAbsent(playerId, id -> new AutomataSession());
        session.setSize(size);
        session.setOrientation(Orientation.fromString(orientation));
    }

    /**
     * Sets the alive block type for a player's simulation.
     */
    public void setAliveBlock(UUID playerId, String blockId) {
        AutomataSession session = sessions.computeIfAbsent(playerId, id -> new AutomataSession());
        session.setAliveBlock(blockId);
    }

    /**
     * Sets the dead block type for a player's simulation.
     */
    public void setDeadBlock(UUID playerId, String blockId) {
        AutomataSession session = sessions.computeIfAbsent(playerId, id -> new AutomataSession());
        session.setDeadBlock(blockId);
    }

    /**
     * Ticks all active sessions.
     */
    private void tickAllSessions() {
        for (AutomataSession session : sessions.values()) {
            if (session.isRunning()) {
                session.tick();
            }
        }
    }

    /**
     * Grid orientation options.
     */
    public enum Orientation {
        FLOOR,  // XZ plane (horizontal)
        WALL,   // XY plane (vertical)
        CUBE;   // Hollow 3D cube (all 6 faces)

        public static Orientation fromString(String str) {
            return switch (str.toLowerCase()) {
                case "wall" -> WALL;
                case "cube" -> CUBE;
                default -> FLOOR;
            };
        }
    }

    /**
     * Represents a single player's automata session.
     */
    public static class AutomataSession {
        private ServerWorld world;
        private BlockPos origin;
        private int size = 32;
        private Orientation orientation = Orientation.FLOOR;
        private String aliveBlockId = DEFAULT_ALIVE_BLOCK;
        private String deadBlockId = DEFAULT_DEAD_BLOCK;
        private boolean running = false;

        private int[][] grid;
        private int[][] prevGrid;

        public void start(ServerWorld world, BlockPos origin) {
            this.world = world;
            this.origin = origin;
            this.running = true;
            initializeGrid();
            draw();
        }

        public void stop() {
            this.running = false;
        }

        public void reset() {
            if (origin != null) {
                initializeGrid();
                draw();
            }
        }

        public boolean isRunning() {
            return running;
        }

        public void setSize(int size) {
            this.size = Math.max(16, Math.min(64, size));
        }

        public void setOrientation(Orientation orientation) {
            this.orientation = orientation;
        }

        public void setAliveBlock(String blockId) {
            this.aliveBlockId = blockId;
        }

        public void setDeadBlock(String blockId) {
            this.deadBlockId = blockId;
        }

        private void initializeGrid() {
            grid = new int[size][size];
            prevGrid = new int[size][size];

            for (int x = 0; x < size; x++) {
                for (int z = 0; z < size; z++) {
                    // Random initialization (30% chance of being alive)
                    grid[x][z] = Math.random() < 0.3 ? 1 : 0;
                    prevGrid[x][z] = -1; // Force initial draw
                }
            }
        }

        public void tick() {
            if (!running || world == null || origin == null) return;

            // Save current state for memoization
            for (int x = 0; x < size; x++) {
                System.arraycopy(grid[x], 0, prevGrid[x], 0, size);
            }

            // Compute next generation
            int[][] newGrid = new int[size][size];
            for (int x = 0; x < size; x++) {
                for (int z = 0; z < size; z++) {
                    int neighbors = countNeighbors(x, z);
                    boolean isAlive = grid[x][z] == 1;

                    if (isAlive) {
                        // Die from under/overpopulation, survive with 2-3 neighbors
                        newGrid[x][z] = (neighbors == 2 || neighbors == 3) ? 1 : 0;
                    } else {
                        // Reproduction with exactly 3 neighbors
                        newGrid[x][z] = (neighbors == 3) ? 1 : 0;
                    }
                }
            }

            grid = newGrid;
            draw();
        }

        private int countNeighbors(int x, int z) {
            int count = 0;
            for (int i = -1; i <= 1; i++) {
                for (int j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0) continue;
                    int nx = x + i;
                    int nz = z + j;
                    if (nx >= 0 && nx < size && nz >= 0 && nz < size) {
                        count += grid[nx][nz];
                    }
                }
            }
            return count;
        }

        private void draw() {
            if (world == null || origin == null) return;

            Block aliveBlock = getBlockFromId(aliveBlockId);
            Block deadBlock = getBlockFromId(deadBlockId);

            if (orientation == Orientation.CUBE) {
                drawCube(aliveBlock, deadBlock);
            } else {
                drawFlat(aliveBlock, deadBlock);
            }
        }

        private void drawFlat(Block aliveBlock, Block deadBlock) {
            for (int i = 0; i < size; i++) {
                for (int j = 0; j < size; j++) {
                    // Memoization: skip unchanged cells
                    if (prevGrid[i][j] == grid[i][j]) continue;

                    Block block = grid[i][j] == 1 ? aliveBlock : deadBlock;
                    BlockPos pos = getBlockLocation(i, j);

                    try {
                        world.setBlockState(pos, block.getDefaultState());
                    } catch (Exception e) {
                        // Ignore errors (unloaded chunks, etc.)
                    }
                }
            }
        }

        private void drawCube(Block aliveBlock, Block deadBlock) {
            for (int i = 0; i < size; i++) {
                for (int j = 0; j < size; j++) {
                    // Memoization: skip unchanged cells
                    if (prevGrid[i][j] == grid[i][j]) continue;

                    Block block = grid[i][j] == 1 ? aliveBlock : deadBlock;

                    try {
                        // Floor (bottom)
                        world.setBlockState(
                            new BlockPos(origin.getX() + i, origin.getY(), origin.getZ() + j),
                            block.getDefaultState());
                        // Ceiling (top)
                        world.setBlockState(
                            new BlockPos(origin.getX() + i, origin.getY() + size - 1, origin.getZ() + j),
                            block.getDefaultState());
                        // Front wall
                        world.setBlockState(
                            new BlockPos(origin.getX() + i, origin.getY() + j, origin.getZ()),
                            block.getDefaultState());
                        // Back wall
                        world.setBlockState(
                            new BlockPos(origin.getX() + i, origin.getY() + j, origin.getZ() + size - 1),
                            block.getDefaultState());
                        // Left wall
                        world.setBlockState(
                            new BlockPos(origin.getX(), origin.getY() + j, origin.getZ() + i),
                            block.getDefaultState());
                        // Right wall
                        world.setBlockState(
                            new BlockPos(origin.getX() + size - 1, origin.getY() + j, origin.getZ() + i),
                            block.getDefaultState());
                    } catch (Exception e) {
                        // Ignore errors
                    }
                }
            }
        }

        private BlockPos getBlockLocation(int i, int j) {
            return switch (orientation) {
                case WALL -> new BlockPos(origin.getX() + i, origin.getY() + j, origin.getZ());
                default -> new BlockPos(origin.getX() + i, origin.getY(), origin.getZ() + j);
            };
        }

        private Block getBlockFromId(String blockId) {
            Identifier id = Identifier.tryParse(blockId);
            if (id != null) {
                Block block = Registries.BLOCK.get(id);
                if (block != Blocks.AIR || blockId.equals("minecraft:air")) {
                    return block;
                }
            }
            // Fallback to a Rainbow block instead of stone
            Block fallback = Registries.BLOCK.get(Identifier.of("rainbow", "gray_500_block"));
            return fallback != Blocks.AIR ? fallback : Blocks.STONE;
        }
    }
}
