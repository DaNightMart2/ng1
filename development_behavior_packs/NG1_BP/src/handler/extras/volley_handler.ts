import { world, system, Dimension, Entity, EntitySwingSource, } from "@minecraft/server";
import { positionInAreaCheck, } from "../../helpers/global/global_functions";

let dimension: Dimension;
system.runTimeout(() => {
    dimension = world.getDimension("overworld");
});

/**
 * Handles grabbing volley ball.
 */
world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:volley_ball" && data.target.isOnGround) {
        data.target.remove();
        data.player.runCommand("give @s ng1:volley_ball_spawn_egg 1 0 {\"minecraft:item_lock\": {\"mode\": \"lock_in_inventory\"}}");
    }
});

/**
 * Handles a ball's knockback through a player.
 * @param player the player to get the rotation from and execute the command from. Of type Entity.
 * @param ball the ball to apply the knockback to. Of type Entity.
 * @param force if to apply force or not. Of type boolean.
 */
function ballKnockback(player: Entity, ball: Entity, force?: boolean) {
    ball.setRotation(player.getRotation());

    let i = 0;
    ball.teleport(ball.location, {"rotation": {x: ball.getRotation().x, y: player.getRotation().y}});
    const knockBack = system.runInterval(() => {
        if (!ball.isValid) {
            system.clearRun(knockBack);
            return;
        }

        let y_addition: number;
        let x_addition: number;
        if (!force) {
            x_addition = 0.4;
            y_addition = 0.2;
        } else {
            x_addition = 0.1;
            y_addition = 0.07;
        }

        const ballY = ball.getRotation().y;

        let x_rotation_add: number;
        if (ballY > -90 && ballY < 90) {
            x_rotation_add = ballY / -90 * x_addition;
        } else if (ballY < 90) {
            x_rotation_add = - (ballY / -180 - 1) / 5 * 4;
        } else {
            x_rotation_add = (ballY / 180 - 1) / 5 * 4;
        }

        if (!ball.tryTeleport({
            x: ball.location.x + x_rotation_add,
            y: ball.location.y + y_addition * Math.max(0, (-player.getRotation().x + 20) / 50),
            z: ball.location.z + (x_addition - (x_addition*2 / 180) * Math.abs(ballY))
        }, {"checkForBlocks": true})) {
            system.clearRun(knockBack);
            return;
        }
        i++;
        if (i > 20) system.clearRun(knockBack);
    });
}

/**
 * Handles volley ball hitting.
 */
world.afterEvents.playerSwingStart.subscribe(data => {
    if (data.swingSource === EntitySwingSource.Attack) {
        const player = data.player;
        const firstViewedBall = data.player.getEntitiesFromViewDirection({"type": "ng1:volley_ball"})[0];
        if (firstViewedBall) {
            const ball = firstViewedBall.entity;
            ballKnockback(player, ball, player.isSneaking);
        }
    }
});

/**
 * Handles serving.
 */
world.afterEvents.playerSwingStart.subscribe(data => {
    if (data.swingSource === EntitySwingSource.Attack && data.heldItemStack?.typeId === "ng1:volley_ball_spawn_egg") {
        const player = data.player;

        player.runCommand("clear @s ng1:volley_ball_spawn_egg 0 1");
        const ball = dimension.spawnEntity("ng1:volley_ball", {x: player.location.x, y: player.location.y + 1.8, z: player.location.z}, {"initialRotation": player.getRotation().y});
        ballKnockback(player, ball, player.isSneaking);
    }
});

/**
 * Handles volley ball levitation, spawning out of area and players too far away.
 */
function volleyBallHandling() {
    for (const player of world.getAllPlayers()) {
        if (player.runCommand("execute if entity @s[hasitem={item=ng1:volley_ball_spawn_egg}]").successCount && !positionInAreaCheck(player.location, {x: 34, y: 7, z: -1}, {x: 59, y: 16, z: 15})) {
            player.runCommand("clear @s ng1:volley_ball_spawn_egg 0 1");
            player.onScreenDisplay.setActionBar({"translate": "title.ng1:volley_ball_far_away"});
            dimension.spawnEntity("ng1:volley_ball", {x: 43.0, y: 8, z: 12.5});
        }
    }

    for (const ball of dimension.getEntities({"type": "ng1:volley_ball"})) {
        ball.addEffect("slow_falling", 1, {"amplifier": 0.5, "showParticles": true});
        if (!positionInAreaCheck(ball.location, {x: 34, y: 7, z: -1}, {x: 59, y: 45, z: 15})) {
            ball.remove();  
            dimension.spawnEntity("ng1:volley_ball", {x: 43.0, y: 8, z: 12.5});
        }
    }
}

system.runInterval(() => {
    volleyBallHandling();
});