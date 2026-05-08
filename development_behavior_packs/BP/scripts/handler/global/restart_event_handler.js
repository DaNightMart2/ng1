import { InputPermissionCategory, world } from "@minecraft/server";
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
        player.teleport({ x: -12.5, y: 45.0, z: 7.5 }, { "rotation": { x: 0, y: 0 } });
    }
}
function restartScoreboard() {
    for (const player of world.getAllPlayers()) {
        world.scoreboard.getObjective("teleportTickCount")?.setScore(player, 0);
        world.scoreboard.getObjective("info")?.setScore("level", -1);
    }
}
function resetStructures() {
    world.structureManager.place("LobbyTrapdoors", world.getDimension("overworld"), { x: 34, y: 7, z: 23 });
}
