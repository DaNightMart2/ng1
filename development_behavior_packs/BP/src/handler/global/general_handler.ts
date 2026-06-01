import { system, world, HudElement, Dimension, } from "@minecraft/server";
import { positionInAreCheck, } from "../../helpers/global/global_functions";

/**
 * Hides some HUD elements from all players.
 */
function hideHudElements() {
    for (const player of world.getAllPlayers()) {

        player.onScreenDisplay.setHudVisibility(
            0, [HudElement.AirBubbles, HudElement.Hunger]
        );
    }
}

/**
 * Give players saturation so they don't have to eat food to survive (anti-starvation).
 */
function saturation() {
    for (const player of world.getAllPlayers()) {
        player.addEffect("saturation", 1, {
            "showParticles": false, "amplifier": 1
        });
    }
}

/**
 * Give players in spawn invisibility.
 */
function invisibilityInSpawn() {
    for (const player of world.getAllPlayers()) {
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
function bombUnloaded() {
    const bombs = dimension.getEntities(
        { "type": "ng1:bomb", "tags": ["ng1:bomb"]}
    );
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
function bombParticle() {
    const bombs = dimension.getEntities(
        {"type": "ng1:bomb", "tags": ["ng1:bomb"]}
    );

    for (const bomb of bombs) {
        if (bomb.getProperty("ng1:bomb_on")) {
            if (!Object.keys(bombParticleTimers).includes(bomb.id)) {
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
function screenUnloaded() {
    const screens = dimension.getEntities(
        {"type": "ng1:screen", "tags": ["ng1:screen"]}
    );
    for (const screen of screens) {
        if (screen.getProperty("ng1:is_hidden")) {
            screen.playAnimation("animation.screen.is_hidden");
        }
    }
}

/**
 * Makes it so whenever a wooden door is loaded it automatically updates its animation.
 */
function woodenDoorUnloaded() {
    const wooden_doors = dimension.getEntities(
        {"type": "ng1:wooden_door", "tags": ["ng1:wooden_door"]}
    );
    for (const wooden_door of wooden_doors) {
        if (wooden_door.getProperty("ng1:is_open") && !wooden_door.getProperty("ng1:in_movement")) {
            wooden_door.playAnimation("animation.wooden_door.is_open");
        }
    }
}

let woodenDoorsStopSound: Record<string, number> = {};
/**
 * Makes it so when a wooden door finishes opening it sets its "in_movement" property to false.
 */
function stopWoodenDoorSound() {
    const wooden_doors = dimension.getEntities(
        {"type": "ng1:wooden_door", "tags": ["ng1:wooden_door"]}
    );

    for (const wooden_door of wooden_doors) {
        if (wooden_door.getProperty("ng1:in_movement")) {
            if (!Object.keys(woodenDoorsStopSound).includes(wooden_door.id)) {
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
function playWoodenDoorSound() {
    const wooden_doors = dimension.getEntities(
        {"type": "ng1:wooden_door", "tags": ["ng1:wooden_door"]}
    );

    for (const wooden_door of wooden_doors) {
        if (!wooden_door.getProperty("ng1:in_movement")) return;
        if (!Object.keys(woodenDoorsSoundTimer).includes(wooden_door.id)) {
            woodenDoorsSoundTimer[wooden_door.id] = 12.5;
        }

        if (!Object.keys(woodenDoorsMultipliers).includes(wooden_door.id)) {
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
function playPeterJonsonIdleAnimation() {
    const peter_jonsons = dimension.getEntities(
        {"type": "ng1:peter_jonson", "tags": ["ng1:peter_jonson"]}
    );

    for (const peter_jonson of peter_jonsons) {
        if (!Object.keys(peterJonsonAnimationCooldowns).includes(peter_jonson.id)) {
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
function peterJonsonPosition() {
    const peter_jonson_hitboxes = dimension.getEntities(
        {"type": "ng1:interact_hitbox", "name": "ng1:peter_hitbox"}
    );

    const peter_jonsons = dimension.getEntities(
        {"type": "ng1:peter_jonson", "tags": ["ng1:peter_jonson"]}
    );

    for (const peter_jonson of peter_jonsons) {
        if (peter_jonson_hitboxes.length === 1) {
            sentFailMessage = false;
            peter_jonson.teleport(peter_jonson_hitboxes[0].location);
        } else if (peter_jonson_hitboxes.length > 1 && !sentFailMessage) {
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
        hideHudElements();
        saturation();
        invisibilityInSpawn();

        bombUnloaded();
        bombParticle();

        screenUnloaded();

        woodenDoorUnloaded();
        stopWoodenDoorSound();
        playWoodenDoorSound();

        playPeterJonsonIdleAnimation();
        peterJonsonPosition();
    }
});