import { system, world, HudElement, Player } from "@minecraft/server";
import { positionInAreCheck } from "../../helpers/global_functions";

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
            {x: -7, y: 49, z: 18})) {
                player.addEffect("invisibility", 5,
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
    playerActor.runCommand("playanimation @e[" +
    "type=ng1:bomb, has_property={ng1:bomb_on=true} " +
    "] animation.bomb_on");
}

function bombParticle() {
    if (particleTimer <= 0) {
        playerActor.runCommand(
        "execute as @e[" +
        "type=ng1:bomb, " +
        "has_property={ng1:bomb_on=true}, " +
        "ry=-135, rym=135] " +
        "at @s run particle minecraft:basic_flame_particle "+
        "~-0.4 ~4.4 ~");

        playerActor.runCommand(
        "execute as @e[" +
        "type=ng1:bomb, " +
        "has_property={ng1:bomb_on=true}, " +
        "ry=45, rym=-45] " +
        "at @s run particle minecraft:basic_flame_particle "+
        "~0.4 ~4.4 ~");

        playerActor.runCommand(
        "execute as @e[" +
        "type=ng1:bomb, " +
        "has_property={ng1:bomb_on=true}, " +
        "ry=-45, rym=-135] " +
        "at @s run particle minecraft:basic_flame_particle "+
        "~ ~4.4 ~-0.4");

        playerActor.runCommand(
        "execute as @e[" +
        "type=ng1:bomb, " +
        "has_property={ng1:bomb_on=true}, " +
        "ry=135, rym=45] " +
        "at @s run particle minecraft:basic_flame_particle "+
        "~ ~4.4 ~0.4");
        particleTimer = 5;
    } else {
        particleTimer--;
    }
}

function screenUnloaded() {
    playerActor.runCommand("playanimation @e[" +
    "type=ng1:screen, has_property={ng1:is_hidden=true}] " +
    "animation.screen.is_hidden");
}

// Wooden door function
function keepWoodenDoorOpen() {
    playerActor.runCommand("playanimation @e[" +
    "type=ng1:screen, has_property={ng1:is_open=true}] " +
    "animation.wooden_door.is_open");
}

function stopWoodenDoorSound() {
    if (stopSound > 0) {
        stopSound--
    } else {
        playerActor.runCommand("event entity @e[" +
        "type=ng1:wooden_door, " +
        "has_property={ng1:in_movement=true}]" +
        "ng1:not_in_movement");
        stopSound = 125;
    }
}

function playWoodenDoorSound() {
    if (soundTimer <= 0) {
        const chance = Math.random();
        if (chance >= 0 && chance <= 0.1 * multiplier) {
            multiplier = 1;

            playerActor.runCommand("execute at @e[" +
            "type=ng1:wooden_door, " +
            "has_property={ng1:in_movement=true}] " +
            "run playsound fall.wood @a ~ ~1 ~ 1.0 1.0 0");

        } else {
            multiplier++;

            playerActor.runCommand("execute at @e[" +
            "type=ng1:wooden_door, " +
            "has_property={ng1:in_movement=true}] " +
            "run playsound place.wood @a ~ ~1 ~ 1.0 1.0 0");
        }

        soundTimer = 12.5;
    } else {
        soundTimer--;
    }
}

function playIdleAnimation() {
    if (animationCooldown <= 0) {
        playerActor.runCommand("playanimation @e["+
        "type=ng1:peter_jonson] " +
        "animation.peter_jonson.idle");
        animationCooldown = 90;
    } else {
        animationCooldown--;
    }

    playerActor.runCommand("tp @e[type=ng1:peter_jonson, tag=FarmOwner] " +
    "@e[type=ng1:interact_hitbox, name=peter_hitbox]");
    playerActor.runCommand("execute as @e[type=ng1:peter_jonson," +
    "tag=FarmOwner] at @s run tp @s ~ ~ ~ facing @p");
}

let particleTimer = 5;

let multiplier = 1;
let soundTimer = 12.5;
let stopSound = 125;

let animationCooldown = 0;

let playerActor: Player;

system.runInterval(() => {
    if (typeof playerActor !== typeof Player) {
        playerActor = world.getAllPlayers()[0];
    }
    hideHudElements();
    invisibilityInSpawn();

    bombUnloaded();
    bombParticle();

    screenUnloaded();

    keepWoodenDoorOpen();
    stopWoodenDoorSound();
    playWoodenDoorSound();

    playIdleAnimation();
});