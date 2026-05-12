import { Dimension, InputPermissionCategory, Player, system, world } from "@minecraft/server";
import { musicInfo } from "../../helpers/music/music_helper";
import { teleportInfo } from "../../helpers/teleport/teleport_helper";

function restartLang() {
    for (const player of world.getAllPlayers()) {
        player.removeTag("es_ar");
        player.removeTag("en_us");
        player.removeTag("es_mx");
        player.removeTag("en_uk");
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
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true);
        player.camera.clear();
    }
}

function restartPosition() {
    for (const player of world.getAllPlayers()) {
        player.teleport({x: -12.5, y: 45.0, z: 7.5}, {"rotation": {x: 0, y: 0}});
    }
}

function restartScoreboard() {
    for (const player of world.getAllPlayers()) {
        world.scoreboard.getObjective("teleportTickCount")?.setScore(player, 0);
        world.scoreboard.getObjective("info")?.setScore("level", -1);
    }
}

function resetStructures() {
    world.structureManager.place( // Path to experiment trapdoors
        "ng1:lobby_trapdoors",
        world.getDimension("overworld"),
        {x: 34, y: 7, z: 23}
    );

    world.structureManager.place( // TheEntity chains
        "ng1:regular_chains",
        world.getDimension("overworld"),
        {x: 34, y: 7, z: 23}
    );

    const theEntityActor = world.getEntity("-5725191405544");
    if (theEntityActor) { // Teleport TheEntity to cell
        theEntityActor.teleport({x: 115.5, y: 21.0, z: 51.0}, {"rotation": {x: 0, y: -90}});
    }

    const woodenDoorToFarm = world.getEntity("-5725191405544");
    if (woodenDoorToFarm) { // Close wooden door to farm
        woodenDoorToFarm.triggerEvent("ng1:close_door");
    }

    // const woodenDoorToOutside = world.getDimension("overworld").;
    // if (woodenDoorToOutside) { // Close wooden door to outside of farm
    //     woodenDoorToOutside.triggerEvent("ng1:close_door");
    // }

    playerActor.runCommand(
        "kill @e[type=ng1:interact_hitbox, name=tutorialBomb]"
    );
}

let playerActor: Player;
const waitForRestart = system.runTimeout(() => {
    for (const player of world.getAllPlayers()) {
        if (player.hasTag("restart")) {
            system.clearRun(waitForRestart);
            playerActor = player;
            restartLang();
            restartTeleportMusic();
            restartPlayer();
            restartScoreboard();
            resetStructures();
        }
    }
});