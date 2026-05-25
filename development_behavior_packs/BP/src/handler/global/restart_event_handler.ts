import { system, world, } from "@minecraft/server";
import { musicInfo, } from "../../helpers/music/music_helper";
import { teleportInfo, } from "../../helpers/teleport/teleport_helper";

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
        for (let i = 0; i <= 12; i++) {
            player.inputPermissions.setPermissionCategory(i, true);
        }
        player.camera.clear();
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

function restartStructuresEntities() {
    const dimension = world.getDimension("overworld");

    world.structureManager.place( // Path to experiment trapdoors
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

    // world.structureManager.place( // TheEntity chains
    //     "ng1:regular_chains",
    //     world.getDimension("overworld"),
    //     // Coordinates (missing)
    // );

    // const theEntityActor = world.getEntity("-5725191405544");
    // if (theEntityActor) { // Teleport TheEntity to cell
    //     theEntityActor.teleport({x: 115.5, y: 21.0, z: 51.0}, {"rotation": {x: 0, y: -90}});
    // }

    // const woodenDoorToFarm = world.getEntity("-5725191405544");
    // if (woodenDoorToFarm) { // Close wooden door to farm
    //     woodenDoorToFarm.triggerEvent("ng1:close_door");
    // }

    // const woodenDoorToOutside = world.getDimension("overworld").;
    // if (woodenDoorToOutside) { // Close wooden door to outside of farm
    //     woodenDoorToOutside.triggerEvent("ng1:close_door");
    // }

    "execute if score bomb info matches 0 run kill @e[type=ng1:interact_hitbox, name=tutorialBomb]"
    "kill @e[type=ng1:bomb, tag=tutorialBomb]"
    "execute if score bomb info matches 0 run kill @e[type=ng1:rey_saul, tag=main_saul]"
    "fill 154 9 49 154 12 52 light_gray_concrete destroy"
    "kill @e[type=ng1:screen, tag=ExperimentScreen]"
    "summon ng1:screen 129.0 6 51.0 90 0"
    "event entity @e[type=ng1:screen, tag=ExperimentScreen] ng1:hide_screen"
    "structure load blown_up 124 8 47"
    "setblock 123 17 116 redstone_wire destroy"
    "setblock 74 25 123 air destroy"
    "structure load barricadedExpLobbyDoor 105 3 49"
    "structure load closed_window 185 23 141"
    "setblock 183 20 126 spruce_fence destroy"
    "fill 178 21 135 178 21 117 lever[\"lever_direction\"=\"east\", \"open_bit\"=false] replace lever"
    "setblock 178 21 126 air destroy"
    "setblock 178 20 126 stone_button[\"facing_direction\"=5] destroy"
    "setblock 23 7 46 bamboo_trapdoor[\"upside_down_bit\"=true, \"direction\"=0] destroy"
    "execute as @e[type=ng1:interact_hitbox, name=vip_seller, y=0, dy=0] at @s run tp @s ~ ~4 ~"
    "setblock 562 5 -7 barrier destroy"
    "setblock 562 4 -8 bamboo_trapdoor[\"upside_down_bit\"=true, \"direction\"=0, \"open_bit\"=false] destroy"
    "tp @e[type=ng1:interact_hitbox, name=peter_hitbox] 190.0 14.0 141.0"
    "structure load bandalized_sign 187 23 143"
    "fill 189 24 144 185 24 144 barrier destroy"
    "fill 190 23 144 178 13 145 air replace"
    "fill 178 13 143 183 23 143 air destroy"
    "fill 186 19 144 189 19 145 spruce_trapdoor[\"direction\"=2]"
    "setblock 185 15 143 lever[\"lever_direction\"=\"south\", \"open_bit\"=false] destroy"
    "setblock 191 20 126 spruce_fence_gate[\"minecraft:cardinal_direction\"=\"east\", \"open_bit\"=false] destroy"

    const tutorialBombs = dimension.getEntities({"type": "ng1:interact_hitbox", "name": "tutorialBomb"});
    for (const tutorialBomb of tutorialBombs) {
        tutorialBomb.remove();
    }
}

/**
 * Restart that can be choosen when /reloading.
 */
system.runInterval(() => {
    for (const player of world.getPlayers({"tags": ["admin"]})) {
        if (player.hasTag("restart-event")) {
            restartScoreboard();
            restartStructuresEntities();
            restartAllTags();
            restartPlayer();
            restartTeleportMusic();
            player.runCommand("tag @a remove restart-event");
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