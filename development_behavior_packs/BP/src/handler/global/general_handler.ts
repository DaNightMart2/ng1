import { system, world, HudElement, Dimension, } from "@minecraft/server";
import { positionInAreCheck, } from "../../helpers/global/global_functions";

function hideHudElements() {
    for (const player of world.getAllPlayers()) {

        player.onScreenDisplay.setHudVisibility(
            0, [HudElement.AirBubbles, HudElement.Hunger]
        );

        player.addEffect("saturation", 1, {
            "showParticles": false, "amplifier": 1
        });
    }
}

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

world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:bomb" &&
    data.itemStack?.typeId === "ng1:key") {
        data.target.triggerEvent("ng1:bomb_off");
        data.player.runCommand("clear @s ng1:key");
    } 
});

function bombUnloaded() {
    const bombs = dimension.getEntities(
        {"type": "ng1:bomb"}
    );
    for (const bomb of bombs) {
        if (bomb.getProperty("ng1:bomb_on")) {
            bomb.playAnimation("animation.bomb_on");
        }
    }
}

function bombParticle() {
    if (particleTimer <= 0) {
        const bombs = dimension.getEntities(
            {"type": "ng1:bomb"}
        );
        for (const bomb of bombs) {
            if (bomb.getProperty("ng1:bomb_on")) {
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
            }
        }
        particleTimer = 5;
    } else {
        particleTimer--;
    }
}

function screenUnloaded() {
    const screens = dimension.getEntities(
        {"type": "ng1:screen"}
    );
    for (const screen of screens) {
        if (screen.getProperty("ng1:is_hidden")) {
            screen.playAnimation("animation.screen.is_hidden");
        }
    }
}

function keepWoodenDoorOpen() {
    const wooden_doors = dimension.getEntities(
        {"type": "ng1:wooden_door"}
    );
    for (const wooden_door of wooden_doors) {
        if (wooden_door.getProperty("ng1:is_open")) {
            wooden_door.playAnimation("animation.screen.is_open");
        }
    }
}

function stopWoodenDoorSound() {
    if (stopSound > 0) {
        stopSound--
    } else {
        const wooden_doors = dimension.getEntities(
            {"type": "ng1:wooden_door"}
        );
        for (const wooden_door of wooden_doors) {
            if (wooden_door.getProperty("ng1:in_movement")) {
                wooden_door.triggerEvent("ng1:not_in_movement");
            }
        }
        stopSound = 125;
    }
}

function playWoodenDoorSound() {
    if (soundTimer <= 0) {
        const chance = Math.random();
        if (chance >= 0 && chance <= 0.1 * multiplier) {
            multiplier = 1;

            const wooden_doors = dimension.getEntities(
                {"type": "ng1:wooden_door"}
            );
            for (const wooden_door of wooden_doors) {
                if (wooden_door.getProperty("ng1:in_movement")) {
                    dimension.playSound("fall.wood", wooden_door.location)
                }
            }
        } else {
            multiplier++;

            const wooden_doors = dimension.getEntities(
                {"type": "ng1:wooden_door"}
            );
            for (const wooden_door of wooden_doors) {
                if (wooden_door.getProperty("ng1:in_movement")) {
                    dimension.playSound("place.wood", wooden_door.location)
                }
            }
        }

        soundTimer = 12.5;
    } else {
        soundTimer--;
    }
}

function playPeterJonsonIdleAnimation() {
    if (animationCooldown <= 0) {
        const peter_jonsons = dimension.getEntities(
            {"type": "ng1:peter_jonson"}
        );
        for (const peter_jonson of peter_jonsons) {
            peter_jonson.playAnimation("animation.peter_jonson.idle");
        }
        animationCooldown = 90;
    } else {
        animationCooldown--;
    }

    const peter_jonson_hitbox = dimension.getEntities(
        {"type": "ng1:interact_hitbox", "name": "peter_hitbox"}
    )[0];
    const peter_jonson_actor = dimension.getEntities(
        {"type": "ng1:peter_jonson", "tags": ["ng1:peter_jonson"]}
    )[0];

    if (peter_jonson_hitbox && peter_jonson_actor) {
        peter_jonson_actor.teleport(peter_jonson_hitbox.location);
    }
}

let particleTimer = 5;

let multiplier = 1;
let soundTimer = 12.5;
let stopSound = 125;

let animationCooldown = 0;

let dimension: Dimension;
system.runTimeout(() => {
    dimension = world.getDimension("overworld");
});

system.runInterval(() => {
    if (dimension) {
        hideHudElements();
        invisibilityInSpawn();

        bombUnloaded();
        bombParticle();

        screenUnloaded();

        keepWoodenDoorOpen();
        stopWoodenDoorSound();
        playWoodenDoorSound();

        playPeterJonsonIdleAnimation();
    }
});