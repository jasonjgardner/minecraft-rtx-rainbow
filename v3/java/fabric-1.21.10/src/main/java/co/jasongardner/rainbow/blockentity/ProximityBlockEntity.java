package co.jasongardner.rainbow.blockentity;

import net.minecraft.block.BlockState;
import net.minecraft.block.entity.BlockEntity;
import net.minecraft.block.entity.BlockEntityType;
import net.minecraft.entity.Entity;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.math.Box;
import net.minecraft.world.World;

import java.util.List;

/**
 * Block entity that detects nearby entities with the "proxy" tag
 * and updates the block state with the closest distance.
 *
 * Note: This is a placeholder for future proximity detection blocks.
 * The block entity type will be registered when proximity blocks are added.
 */
public class ProximityBlockEntity extends BlockEntity {
    private static final int MAX_DISTANCE = 10;
    private int closestProximity = MAX_DISTANCE;

    public ProximityBlockEntity(BlockEntityType<?> type, BlockPos pos, BlockState state) {
        super(type, pos, state);
    }

    public int getClosestProximity() {
        return closestProximity;
    }

    /**
     * Server-side tick handler for proximity detection.
     */
    public static void tick(World world, BlockPos pos, BlockState state, ProximityBlockEntity be) {
        if (world.isClient()) return;

        // Search for entities with "proxy" tag within MAX_DISTANCE blocks
        Box searchBox = new Box(pos).expand(MAX_DISTANCE);
        int closest = MAX_DISTANCE;

        List<Entity> entities = world.getEntitiesByClass(
            Entity.class,
            searchBox,
            entity -> entity.getCommandTags().contains("proxy")
        );

        for (Entity entity : entities) {
            double distance = Math.sqrt(entity.squaredDistanceTo(
                pos.getX() + 0.5,
                pos.getY() + 0.5,
                pos.getZ() + 0.5
            ));

            if (distance < closest && distance <= MAX_DISTANCE) {
                closest = (int) Math.round(distance);
            }
        }

        // Only update if proximity changed
        if (closest != be.closestProximity) {
            be.closestProximity = closest;
            be.markDirty();

            // TODO: Update block state with proximity value
            // This requires a custom block state property
        }
    }
}
