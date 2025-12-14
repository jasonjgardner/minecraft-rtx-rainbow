package co.jasongardner.rainbow.config;

import co.jasongardner.rainbow.RainbowMod;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import net.fabricmc.loader.api.FabricLoader;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Manages per-player API key storage with basic encryption.
 * Keys are stored in config/rainbow/agent_keys.json
 */
public class AgentConfig {
    private static AgentConfig INSTANCE;
    private static final String CONFIG_FILE = "agent_keys.json";
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();

    // Map of player UUID -> encrypted API key
    private Map<String, String> playerKeys = new HashMap<>();
    private final Path configPath;

    private AgentConfig() {
        configPath = FabricLoader.getInstance()
            .getConfigDir()
            .resolve("rainbow")
            .resolve(CONFIG_FILE);
    }

    public static AgentConfig getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new AgentConfig();
            INSTANCE.load();
        }
        return INSTANCE;
    }

    /**
     * Sets API key for a player (stores encrypted).
     */
    public void setApiKey(UUID playerId, String apiKey) {
        String encrypted = encrypt(apiKey, playerId);
        playerKeys.put(playerId.toString(), encrypted);
        save();
    }

    /**
     * Gets decrypted API key for a player.
     * @return API key or null if not set
     */
    public String getApiKey(UUID playerId) {
        String encrypted = playerKeys.get(playerId.toString());
        if (encrypted == null) {
            return null;
        }
        return decrypt(encrypted, playerId);
    }

    /**
     * Checks if player has an API key configured.
     */
    public boolean hasApiKey(UUID playerId) {
        return playerKeys.containsKey(playerId.toString());
    }

    /**
     * Removes API key for a player.
     */
    public void removeApiKey(UUID playerId) {
        playerKeys.remove(playerId.toString());
        save();
    }

    /**
     * Loads config from disk.
     */
    private void load() {
        try {
            if (Files.exists(configPath)) {
                String json = Files.readString(configPath, StandardCharsets.UTF_8);
                Type type = new TypeToken<Map<String, String>>(){}.getType();
                Map<String, String> loaded = GSON.fromJson(json, type);
                if (loaded != null) {
                    playerKeys = loaded;
                }
                RainbowMod.LOGGER.info("Loaded {} API keys from config", playerKeys.size());
            }
        } catch (IOException e) {
            RainbowMod.LOGGER.error("Failed to load agent config", e);
        }
    }

    /**
     * Saves config to disk.
     */
    private void save() {
        try {
            // Create directory if needed
            Files.createDirectories(configPath.getParent());

            String json = GSON.toJson(playerKeys);
            Files.writeString(configPath, json, StandardCharsets.UTF_8);
        } catch (IOException e) {
            RainbowMod.LOGGER.error("Failed to save agent config", e);
        }
    }

    /**
     * Simple encryption using player UUID as key derivation.
     * Note: This is basic obfuscation to prevent casual viewing, not cryptographically secure.
     */
    private String encrypt(String data, UUID playerId) {
        try {
            SecretKeySpec secretKey = deriveKey(playerId);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encrypted = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            RainbowMod.LOGGER.error("Failed to encrypt API key", e);
            // Fallback to base64 only (not secure, but better than nothing)
            return Base64.getEncoder().encodeToString(data.getBytes(StandardCharsets.UTF_8));
        }
    }

    private String decrypt(String data, UUID playerId) {
        try {
            SecretKeySpec secretKey = deriveKey(playerId);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decoded = Base64.getDecoder().decode(data);
            byte[] decrypted = cipher.doFinal(decoded);
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            RainbowMod.LOGGER.error("Failed to decrypt API key", e);
            // Try fallback base64 decode
            try {
                return new String(Base64.getDecoder().decode(data), StandardCharsets.UTF_8);
            } catch (Exception e2) {
                return null;
            }
        }
    }

    private SecretKeySpec deriveKey(UUID playerId) throws Exception {
        // Derive a key from the player UUID
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        byte[] key = sha.digest(playerId.toString().getBytes(StandardCharsets.UTF_8));
        // Use first 16 bytes for AES-128
        return new SecretKeySpec(Arrays.copyOf(key, 16), "AES");
    }
}
