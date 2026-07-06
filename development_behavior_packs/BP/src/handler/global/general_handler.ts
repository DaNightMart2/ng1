import { system, world, HudElement, Dimension, Entity, Player, } from "@minecraft/server";
import { positionInAreCheck, } from "../../helpers/global/global_functions";

/**
 * Hides some HUD elements from all players.
 */
function hideHudElements(players: Player[]) {
    for (const player of players) {

        player.onScreenDisplay.setHudVisibility(
            0, [HudElement.AirBubbles, HudElement.Hunger]
        );
    }
}

/**
 * Give players saturation so they don't have to eat food to survive (anti-starvation).
 */
function saturation(players: Player[]) {
    for (const player of players) {
        player.addEffect("saturation", 1, {
            "showParticles": false, "amplifier": 1
        });
    }
}

/**
 * Give players in spawn invisibility.
 */
function invisibilityInSpawn(players: Player[]) {
    for (const player of players) {
        if (positionInAreCheck(
            player.location,
            {x: -19, y: 3, z: 6},
            {x: -7, y: 49, z: 18},
        )) {
            player.addEffect(
                "invisibility",
                20,
                {"showParticles": false, "amplifier": 255}
            );
        }
    }
}

/**
 * Makes bombs turn off with a key.
 */
world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:bomb" &&
    data.itemStack?.typeId === "ng1:key") {
        data.target.triggerEvent("ng1:bomb_off");
        data.player.runCommand("clear @s ng1:key");
    } 
});

/**
 * Makes it so whenever a bomb is loaded it automatically updates its animation.
 */
function bombUnloaded(bombs: Entity[]) {
    for (const bomb of bombs) {
        if (bomb.getProperty("ng1:bomb_on")) {
            bomb.playAnimation("animation.bomb_on");
        }
    }
}

let bombParticleTimers: Record<string, number> = {};
/**
 * Makes bomb which are on emit particles depending on their rotation.
 */
function bombParticle(bombs: Entity[]) {
    for (const bomb of bombs) {
        if (bomb.getProperty("ng1:bomb_on")) {
            if (!(bomb.id in bombParticleTimers)) {
                bombParticleTimers[bomb.id] = 5;
            }

            if (bombParticleTimers[bomb.id] <= 0) {
                bombParticleTimers[bomb.id] = 5;

                const bombYrotation = bomb.getRotation().y;

                if (bombYrotation === -180) {
                    dimension.spawnParticle("minecraft:basic_flame_particle", {
                        x: bomb.location.x - 0.4,
                        y: bomb.location.y + 4.4,
                        z: bomb.location.z
                    });
                }

                else if (bombYrotation === 0) {
                    dimension.spawnParticle("minecraft:basic_flame_particle", {
                        x: bomb.location.x + 0.4,
                        y: bomb.location.y + 4.4,
                        z: bomb.location.z
                    });
                }

                else if (bombYrotation === -90) {
                    dimension.spawnParticle("minecraft:basic_flame_particle", {
                        x: bomb.location.x,
                        y: bomb.location.y + 4.4,
                        z: bomb.location.z - 0.4
                    });
                }

                else if (bombYrotation === 90) {
                    dimension.spawnParticle("minecraft:basic_flame_particle", {
                        x: bomb.location.x,
                        y: bomb.location.y + 4.4,
                        z: bomb.location.z + 0.4
                    });
                }
            } else {
                bombParticleTimers[bomb.id]--;
            }
        }
    }
}

/**
 * Makes it so whenever a screen is loaded it automatically updates its animation.
 */
function screenUnloaded(screens: Entity[]) {
    for (const screen of screens) {
        if (screen.getProperty("ng1:is_hidden")) {
            screen.playAnimation("animation.screen.is_hidden");
        }
    }
}

/**
 * Makes it so whenever a wooden door is loaded it automatically updates its animation.
 */
function woodenDoorUnloaded(woodenDoors: Entity[]) {
    for (const wooden_door of woodenDoors) {
        if (wooden_door.getProperty("ng1:is_open") && !wooden_door.getProperty("ng1:in_movement")) {
            wooden_door.playAnimation("animation.wooden_door.is_open");
        }
    }
}

let woodenDoorsStopSound: Record<string, number> = {};
/**
 * Makes it so when a wooden door finishes opening it sets its "in_movement" property to false.
 */
function stopWoodenDoorSound(woodenDoors: Entity[]) {
    for (const wooden_door of woodenDoors) {
        if (wooden_door.getProperty("ng1:in_movement")) {
            if (!(wooden_door.id in woodenDoorsStopSound)) {
                woodenDoorsStopSound[wooden_door.id] = 112.5;
            }

            if (woodenDoorsStopSound[wooden_door.id] > 0) {
                woodenDoorsStopSound[wooden_door.id]--;
            } else {
                wooden_door.setProperty("ng1:in_movement", false);
                woodenDoorsStopSound[wooden_door.id] = 112.5;
            }
        }
    }
}

let woodenDoorsSoundTimer: Record<string, number> = {};
let woodenDoorsMultipliers: Record<string, number> = {};
/**
 * Plays a sound when a wooden door is opening or closing.
 */
function playWoodenDoorSound(woodenDoors: Entity[]) {
    for (const wooden_door of woodenDoors) {
        if (!wooden_door.getProperty("ng1:in_movement")) continue;
        if (!(wooden_door.id in woodenDoorsSoundTimer)) {
            woodenDoorsSoundTimer[wooden_door.id] = 12.5;
        }

        if (!(wooden_door.id in woodenDoorsMultipliers)) {
            woodenDoorsMultipliers[wooden_door.id] = 1;
        }

        if (woodenDoorsSoundTimer[wooden_door.id] && woodenDoorsMultipliers[wooden_door.id]) {
            if (woodenDoorsSoundTimer[wooden_door.id] <= 0.0000001) {
                const chance = Math.random();
                if (chance >= 0 && chance <= 0.1 * woodenDoorsMultipliers[wooden_door.id]) {
                    woodenDoorsMultipliers[wooden_door.id] = 1;
                    dimension.playSound("fall.wood", wooden_door.location);
                } else {
                    woodenDoorsMultipliers[wooden_door.id]++;
                    dimension.playSound("place.wood", wooden_door.location);
                }
                woodenDoorsSoundTimer[wooden_door.id] = 12.5;
            } else {
                woodenDoorsSoundTimer[wooden_door.id] -= 1 + 0.5 / 12;
            }
        }
    }
}

let peterJonsonAnimationCooldowns: Record<string, number> = {};
/**
 * Handles playing Peter Jonsons' idle animation.
 */
function playPeterJonsonIdleAnimation(peterJonsons: Entity[]) {
    for (const peter_jonson of peterJonsons) {
        if (!(peter_jonson.id in peterJonsonAnimationCooldowns)) {
            peterJonsonAnimationCooldowns[peter_jonson.id] = 0;
        }

        if (peterJonsonAnimationCooldowns[peter_jonson.id] <= 0) {
            peter_jonson.playAnimation("animation.peter_jonson.idle");
            peterJonsonAnimationCooldowns[peter_jonson.id] = 90;
        } else {
            peterJonsonAnimationCooldowns[peter_jonson.id]--;
        }
    }
}

let sentFailMessage = false;
/**
 * Handles Peter Jonsons' position based on his hitbox's position.
 */
function peterJonsonPosition(peterJonsons: Entity[], peterJonsonHitboxes: Entity[]) {
    for (const peter_jonson of peterJonsons) {
        if (peterJonsonHitboxes.length === 1) {
            sentFailMessage = false;
            peter_jonson.teleport(peterJonsonHitboxes[0].location);
        } else if (peterJonsonHitboxes.length > 1 && !sentFailMessage) {
            sentFailMessage = true;
            console.warn("Failed to teleport \"Peter Jonson\" to \"Peter Jonson Hitbox\" > Multiple \"Peter Jonson Hitbox\"es found > This message will be disabled until the teleport works. Then, it can reappear.");
        }
    }
}

let dimension: Dimension;
system.runTimeout(() => {
    dimension = world.getDimension("overworld");
});

system.runInterval(() => {
    if (dimension) {
        const players = world.getAllPlayers();
        hideHudElements(players);
        saturation(players);
        invisibilityInSpawn(players);

        const bombs = dimension.getEntities(
            {"type": "ng1:bomb", "tags": ["ng1:bomb"]}
        );
        bombUnloaded(bombs);
        bombParticle(bombs);

        const screens = dimension.getEntities(
            {"type": "ng1:screen", "tags": ["ng1:screen"]}
        );
        screenUnloaded(screens);

        const woodenDoors = dimension.getEntities(
            {"type": "ng1:wooden_door", "tags": ["ng1:wooden_door"]}
        );
        woodenDoorUnloaded(woodenDoors);
        stopWoodenDoorSound(woodenDoors);
        playWoodenDoorSound(woodenDoors);

        const peterJonsons = dimension.getEntities(
            {"type": "ng1:peter_jonson", "tags": ["ng1:peter_jonson"]}
        );
        const peterJonsonHitboxes = dimension.getEntities(
            {"type": "ng1:interact_hitbox", "name": "ng1:peter_hitbox"}
        );
        playPeterJonsonIdleAnimation(peterJonsons);
        peterJonsonPosition(peterJonsons, peterJonsonHitboxes);
    }
});
