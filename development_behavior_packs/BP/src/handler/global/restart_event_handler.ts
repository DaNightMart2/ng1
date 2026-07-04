import { system, world, } from "@minecraft/server";
import { musicInfo, } from "../../helpers/music/music_helper";
import { teleportInfo, } from "../../helpers/teleport/teleport_helper";
import { setMovement, } from "../../helpers/global/global_functions";

function restartLang() {
    for (const player of world.getAllPlayers()) {
        player.removeTag("en");
        player.removeTag("es");
        player.removeTag("choosing_lang");
    }
}

function restartAllTags() {
    for (const player of world.getAllPlayers()) {
        player.removeTag("dialog-prologue_start");
        player.removeTag("dialog-prologue_end");
    }
}

function restartTeleportMusic() {
    for (const player of world.getAllPlayers()) {
        for (const music of musicInfo) {
            player.removeTag(music.tag);
        }
        for (const teleport of teleportInfo) {
            player.removeTag(teleport.tag);
        }
    }
}

function restartPlayer() {
    for (const player of world.getAllPlayers()) {
        setMovement(player, true);
        player.camera.clear();
        player.stopMusic();
        player.onScreenDisplay.resetHudElementsVisibility();
    }
}

function restartPosition() {
    for (const player of world.getAllPlayers()) {
        player.teleport({x: -12.5, y: 46.0, z: 7.5}, {"rotation": {x: 0, y: 0}});
    }
}

function restartScoreboard() {
    for (const player of world.getAllPlayers()) {
        world.scoreboard.getObjective("teleportTickCount")?.setScore(player, 0);
        world.scoreboard.getObjective("globalVariables")?.setScore("sectionConcat", 100);
        world.scoreboard.getObjective("globalVariables")?.setScore("timer", 1200);
    }
}

function restartStructures() {
    const dimension = world.getDimension("overworld");

    world.structureManager.place(
        "ng1:lobby_trapdoors/close",
        dimension,
        {x: 34, y: 7, z: 23},
    );
    dimension.playSound("open.wooden_trapdoor", {x: 35.0, y: 8.0, z: 24.0});

    world.structureManager.place(
        "ng1:exp_closed_exit/closed",
        dimension,
        {x: 154, y: 9, z: 49},
    );

    world.structureManager.place(
        "ng1:theentity_chains/regular_chains",
        dimension,
        {x: 115, y: 21, z: 50},
    );

    world.structureManager.place(
        "ng1:tv_structure/structure",
        dimension,
        {x: 124, y: 3, z: 47},
    );
}

let restartedEntities = {
    volley_ball: false,
    wooden_doors: false,
    screens: false,
    screen: false,
    path_to_farm: false,
    path_to_outside: false,
    path_to_limbo: false,
    theentity: false,
}
function restartEntities() {
    const dimension = world.getDimension("overworld");

    if (!restartedEntities.volley_ball) {
        for (const ball of dimension.getEntities({"type": "ng1:volley_ball"})) {
            ball.remove();
        }
        for (const player of world.getAllPlayers()) {
            player.runCommand("clear @s ng1:volley_ball_spawn_egg");
        }
        dimension.spawnEntity("ng1:volley_ball", {x: 43.0, y: 8, z: 12.5});
        restartedEntities.volley_ball = true;
    }

    if (!restartedEntities.wooden_doors) {
        for (const wooden_door of dimension.getEntities({"type": "ng1:wooden_door", "tags": ["ng1:wooden_door"]})) {
            wooden_door.remove();
        }
        restartedEntities.wooden_doors = true;
    }

    if (!restartedEntities.screens) {
        for (const screen of dimension.getEntities({"type": "ng1:screen", "tags": ["ng1:screen"]})) {
            screen.remove();
        }
        restartedEntities.screens = true;
    }

    if (!restartedEntities.screen) {
        try {
            const screen = dimension.spawnEntity("ng1:screen", {x: 129.0, y: 6.5, z: 51.0}, {"initialRotation": 90});
            screen.addTag("ng1:screen");
            restartedEntities.screen = true;
        } catch (_) {}
    }

    if (!restartedEntities.path_to_farm) {
        try {
            const wooden_door_farm = dimension.spawnEntity("ng1:wooden_door", {x: 47.5, y: 7.0, z: 48.5}, {"initialRotation": 180});
            wooden_door_farm.addTag("ng1:wooden_door_farm");
            wooden_door_farm.addTag("ng1:wooden_door");
            wooden_door_farm.playAnimation("animation.wooden_door.is_open");
            wooden_door_farm.triggerEvent("ng1:close_door");
            wooden_door_farm.setProperty("ng1:in_movement", false); // To disable sound
            restartedEntities.path_to_farm = true;
        } catch (_) {}
    }

    if (!restartedEntities.path_to_outside) {
        try {
            const wooden_door_outside = dimension.spawnEntity("ng1:wooden_door", {x: 188.5, y: 14.0, z: 142.5}, {"initialRotation": 180});
            wooden_door_outside.addTag("ng1:wooden_door_outside");
            wooden_door_outside.addTag("ng1:wooden_door");
            wooden_door_outside.playAnimation("animation.wooden_door.is_open");
            wooden_door_outside.triggerEvent("ng1:close_door");
            wooden_door_outside.setProperty("ng1:in_movement", false); // To disable sound
            restartedEntities.path_to_outside = true;
        } catch (_) {}
    }

    if (!restartedEntities.path_to_limbo) {
        try {
            const wooden_door_limbo = dimension.spawnEntity("ng1:wooden_door", {x: 187.5, y: 14.0, z: 110.5}, {"initialRotation": 0});
            wooden_door_limbo.addTag("ng1:wooden_door_limbo");
            wooden_door_limbo.addTag("ng1:wooden_door");
            wooden_door_limbo.triggerEvent("ng1:open_door");
            wooden_door_limbo.playAnimation("animation.wooden_door.is_open");
            wooden_door_limbo.triggerEvent("ng1:close_door");
            wooden_door_limbo.setProperty("ng1:in_movement", false); // To disable sound
            restartedEntities.path_to_limbo = true;
        } catch (_) {}
    }

    if (!restartedEntities.theentity) {
        try {
            const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});
            for (const theentity of theentities) {
                theentity.remove();
            }

            const theentity = dimension.spawnEntity("ng1:theentity", {x: 115.2, y: 21.0, z: 51.0}, {"initialRotation": -90});
            theentity.addTag("ng1:theentity");

            restartedEntities.theentity = true;
        } catch (_) {}
    }
};

/**
 * Restarts that can be choosen when /reloading.
 */
system.runInterval(() => {
    for (const player of world.getPlayers({"tags": ["admin"]})) {
        if (player.hasTag("restart-event")) {
            restartScoreboard();
            restartStructures();
            restartAllTags();
            restartPlayer();
            restartTeleportMusic();
            player.runCommand("tag @a remove restart-event");
            system.runInterval(() => {
                restartEntities();
            });
        }

        if (player.hasTag("restart-lang")) {
            restartLang();
            player.runCommand("tag @a remove restart-lang");
        }

        if (player.hasTag("restart-pos")) {
            restartPosition();
            player.runCommand("tag @a remove restart-pos");
        }
    }
});