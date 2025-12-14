package co.jasongardner.rainbow.agent;

import co.jasongardner.rainbow.RainbowMod;
import co.jasongardner.rainbow.config.AgentConfig;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;

import java.util.Deque;
import java.util.LinkedList;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Singleton manager for AI agent sessions.
 * Follows pattern from AutomataManager.
 */
public class AgentManager {
    private static AgentManager INSTANCE;

    // Per-player sessions (thread-safe for async callbacks)
    private final Map<UUID, AgentSession> sessions = new ConcurrentHashMap<>();

    // Rate limiting: player UUID -> rate limiter
    private final Map<UUID, RateLimiter> rateLimiters = new ConcurrentHashMap<>();

    private boolean initialized = false;
    private int tickCounter = 0;

    private AgentManager() {}

    public static AgentManager getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new AgentManager();
        }
        return INSTANCE;
    }

    /**
     * Initialize tick handler. Called from RainbowMod.onInitialize().
     */
    public void initialize() {
        if (initialized) return;

        ServerTickEvents.END_SERVER_TICK.register(server -> {
            tickCounter++;
            if (tickCounter >= AgentConstants.TICK_INTERVAL) {
                tickCounter = 0;
                tickAllSessions();
            }
        });

        initialized = true;
        RainbowMod.LOGGER.info("Agent manager initialized.");
    }

    /**
     * Starts a new build task for a player.
     * @param player The player requesting the build
     * @param prompt Natural language description of what to build
     * @return true if task started, false if no API key or rate limited
     */
    public boolean startBuildTask(ServerPlayerEntity player, String prompt) {
        UUID playerId = player.getUuid();

        // Check API key
        String apiKey = AgentConfig.getInstance().getApiKey(playerId);
        if (apiKey == null) {
            player.sendMessage(Text.literal("[Agent] No API key set. Use /rainbow agent setkey <key>"));
            return false;
        }

        // Check rate limit
        RateLimiter limiter = rateLimiters.computeIfAbsent(playerId,
            id -> new RateLimiter(AgentConstants.MAX_REQUESTS_PER_MINUTE, 60_000));
        if (!limiter.tryAcquire()) {
            long waitTime = limiter.getTimeUntilAvailable() / 1000;
            player.sendMessage(Text.literal(String.format(
                "[Agent] Rate limited. Please wait %d seconds before sending another request.",
                waitTime
            )));
            return false;
        }

        // Get or create session
        AgentSession session = sessions.computeIfAbsent(playerId,
            id -> new AgentSession(player.getServerWorld(), player));

        // Update world reference (player may have changed dimensions)
        session.setWorld(player.getServerWorld());
        session.setPlayer(player);

        // Start async build task
        session.submitPrompt(apiKey, prompt);

        return true;
    }

    /**
     * Stops current task for a player.
     */
    public void stopTask(UUID playerId) {
        AgentSession session = sessions.get(playerId);
        if (session != null) {
            session.stop();
        }
    }

    /**
     * Gets status of a player's current task.
     */
    public AgentStatus getStatus(UUID playerId) {
        AgentSession session = sessions.get(playerId);
        if (session == null) {
            return new AgentStatus(false, false, 0, 0, null);
        }

        return new AgentStatus(
            true,
            session.isProcessing(),
            session.getPendingOperationCount(),
            session.getTotalBlocksPlaced(),
            session.getLastError()
        );
    }

    /**
     * Processes pending block operations for all sessions.
     */
    private void tickAllSessions() {
        for (AgentSession session : sessions.values()) {
            session.tick();
        }
    }

    /**
     * Simple rate limiter using sliding window.
     */
    private static class RateLimiter {
        private final Deque<Long> timestamps = new LinkedList<>();
        private final int maxRequests;
        private final long windowMs;

        public RateLimiter(int maxRequests, long windowMs) {
            this.maxRequests = maxRequests;
            this.windowMs = windowMs;
        }

        public synchronized boolean tryAcquire() {
            long now = System.currentTimeMillis();

            // Remove old timestamps
            while (!timestamps.isEmpty() && timestamps.peekFirst() < now - windowMs) {
                timestamps.pollFirst();
            }

            if (timestamps.size() >= maxRequests) {
                return false;
            }

            timestamps.addLast(now);
            return true;
        }

        public synchronized long getTimeUntilAvailable() {
            if (timestamps.size() < maxRequests) return 0;
            long oldest = timestamps.peekFirst();
            return (oldest + windowMs) - System.currentTimeMillis();
        }
    }

    /**
     * Agent status for /rainbow agent status command.
     */
    public record AgentStatus(
        boolean hasSession,
        boolean isProcessing,
        int pendingOperations,
        int blocksPlaced,
        String lastError
    ) {}
}
