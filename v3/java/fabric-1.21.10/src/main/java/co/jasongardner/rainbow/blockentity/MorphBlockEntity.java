package co.jasongardner.rainbow.blockentity;

import net.minecraft.block.BlockState;
import net.minecraft.block.entity.BlockEntity;
import net.minecraft.block.entity.BlockEntityType;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.World;

/**
 * Block entity that rotates based on the nearest player's head position.
 * Provides 12 rotation states based on player head Y coordinate.
 *
 * Note: This is a placeholder for future morph blocks.
 * The block entity type will be registered when morph blocks are added.
 */
public class MorphBlockEntity extends BlockEntity {
    private int preciseRotation = 1;

    public MorphBlockEntity(BlockEntityType<?> type, BlockPos pos, BlockState state) {
        super(type, pos, state);
    }

    public int getPreciseRotation() {
        return preciseRotation;
    }

    /**
     * Server-side tick handler for morph rotation.
     */
    public static void tick(World world, BlockPos pos, BlockState state, MorphBlockEntity be) {
        if (world.isClient()) return;

        // Find nearest player within 16 blocks
        PlayerEntity nearest = world.getClosestPlayer(
            pos.getX() + 0.5,
            pos.getY() + 0.5,
            pos.getZ() + 0.5,
            16.0,
            false
        );

        if (nearest != null) {
            // Calculate rotation based on player head Y position
            // Maps head Y position (modulo 36) to rotation values 1-12
            double headY = nearest.getEyePos().y;
            int rotation = Math.min(12, Math.max(1, (int) (headY % 36 / 3)));

            if (rotation != be.preciseRotation) {
                be.preciseRotation = rotation;
                be.markDirty();

                // TODO: Update block state with rotation value
                // This requires a custom block state property
            }
        }
    }
}
