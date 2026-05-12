import { InputPermissionCategory, system, world } from "@minecraft/server";
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
    world.structureManager.place(// Path to experiment trapdoors
    "ng1:lobby_trapdoors", world.getDimension("overworld"), { x: 34, y: 7, z: 23 });
    world.structureManager.place(// TheEntity chains
    "ng1:regular_chains", world.getDimension("overworld"), { x: 34, y: 7, z: 23 });
    const theEntityActor = world.getEntity("-5725191405544");
    if (theEntityActor) { // Teleport TheEntity to cell
        theEntityActor.teleport({ x: 115.5, y: 21.0, z: 51.0 }, { "rotation": { x: 0, y: -90 } });
    }
    const woodenDoorToFarm = world.getEntity("-5725191405544");
    if (woodenDoorToFarm) { // Close wooden door to farm
        woodenDoorToFarm.triggerEvent("ng1:close_door");
    }
    // const woodenDoorToOutside = world.getDimension("overworld").;
    // if (woodenDoorToOutside) { // Close wooden door to outside of farm
    //     woodenDoorToOutside.triggerEvent("ng1:close_door");
    // }
    "execute if score bomb info matches 0 run kill @e[type=ng1:interact_hitbox, name=tutorialBomb]";
    "kill @e[type=ng1:bomb, tag=tutorialBomb]";
    "execute if score bomb info matches 0 run kill @e[type=ng1:rey_saul, tag=main_saul]";
    "fill 154 9 49 154 12 52 light_gray_concrete destroy";
    "kill @e[type=ng1:screen, tag=ExperimentScreen]";
    "summon ng1:screen 129.0 6 51.0 90 0";
    "event entity @e[type=ng1:screen, tag=ExperimentScreen] ng1:hide_screen";
    "structure load blown_up 124 8 47";
    "setblock 123 17 116 redstone_wire destroy";
    "setblock 74 25 123 air destroy";
    "structure load barricadedExpLobbyDoor 105 3 49";
    "structure load closed_window 185 23 141";
    "setblock 183 20 126 spruce_fence destroy";
    "fill 178 21 135 178 21 117 lever[\"lever_direction\"=\"east\", \"open_bit\"=false] replace lever";
    "setblock 178 21 126 air destroy";
    "setblock 178 20 126 stone_button[\"facing_direction\"=5] destroy";
    "setblock 23 7 46 bamboo_trapdoor[\"upside_down_bit\"=true, \"direction\"=0] destroy";
    "execute as @e[type=ng1:interact_hitbox, name=vip_seller, y=0, dy=0] at @s run tp @s ~ ~4 ~";
    "setblock 562 5 -7 barrier destroy";
    "setblock 562 4 -8 bamboo_trapdoor[\"upside_down_bit\"=true, \"direction\"=0, \"open_bit\"=false] destroy";
    "tp @e[type=ng1:interact_hitbox, name=peter_hitbox] 190.0 14.0 141.0";
    "structure load bandalized_sign 187 23 143";
    "fill 189 24 144 185 24 144 barrier destroy";
    "fill 190 23 144 178 13 145 air replace";
    "fill 178 13 143 183 23 143 air destroy";
    "fill 186 19 144 189 19 145 spruce_trapdoor[\"direction\"=2]";
    "setblock 185 15 143 lever[\"lever_direction\"=\"south\", \"open_bit\"=false] destroy";
    "setblock 191 20 126 spruce_fence_gate[\"minecraft:cardinal_direction\"=\"east\", \"open_bit\"=false] destroy";
    playerActor.runCommand("kill @e[type=ng1:interact_hitbox, name=tutorialBomb]");
}
let playerActor;
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
