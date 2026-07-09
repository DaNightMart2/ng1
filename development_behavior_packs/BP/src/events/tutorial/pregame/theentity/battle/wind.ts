import { EntityComponentTypes, InputPermissionCategory, system, world, } from "@minecraft/server";
import { positionInAreaCheck, } from "../../../../../helpers/global/global_functions";

let windParticleCooldown: Record<string, number> = {};
let antiJumpSticking: Record<string, boolean> = {};
const windParticleCooldownTime = 10;

system.runInterval(() => {
    const players = world.getAllPlayers();

    for (const player of players) {
        if (positionInAreaCheck(
            player.location,
            {x: 135, y: 3, z: 27},
            {x: 156, y: 18, z: 74},
        )) {
            const movementSpeed = player.getComponent(EntityComponentTypes.Movement);
            const calculatedSpeed = (149-player.location.x)/140;

            if (calculatedSpeed > 0) {
                movementSpeed?.setCurrentValue(calculatedSpeed);
            }

            if (!(player.id in antiJumpSticking) || antiJumpSticking[player.id] === true) {
                antiJumpSticking[player.id] = false;
                player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, false);
            }

            const dimension = world.getDimension("overworld");

            if (!(player.id in windParticleCooldown)) {
                windParticleCooldown[player.id] = windParticleCooldownTime;
            } else {
                windParticleCooldown[player.id]--;
            }

            if (windParticleCooldown[player.id] <= 0) {
                const location = player.location;
                dimension.spawnParticle("minecraft:wind_explosion_emitter", {x: location.x, y: location.y+1, z: location.z});;
                windParticleCooldown[player.id] = windParticleCooldownTime;
            }

        } else {
            if (!(player.id in antiJumpSticking) || antiJumpSticking[player.id] === false) {
                antiJumpSticking[player.id] = true;
                player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, true);
            }
        }
    }
});