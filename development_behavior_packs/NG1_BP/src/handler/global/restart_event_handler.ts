import { system, world, EntityComponentTypes, ScoreboardObjective, } from "@minecraft/server";
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
        player.removeTag("dialog-theentity_meeting");
        player.removeTag("dialog-theentity_initialization");
        player.removeTag("dialog-computer_tutorial");
        player.removeTag("dialog-theentity_initialization_closed");
    }
}

function restartTeleportMusic() {
    for (const player of world.getAllPlayers()) {
        for (const music of musicInfo) {
            player.removeTag(music.track);
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
        const movementSpeed = player.getComponent(EntityComponentTypes.Movement) as any;
        movementSpeed?.resetToDefaultValue();
        const Health = player.getComponent(EntityComponentTypes.Health) as any;
        Health?.resetToDefaultValue();
    }
}

function restartPosition() {
    for (const player of world.getAllPlayers()) {
        player.teleport({x: -12.5, y: 46.0, z: 7.5}, {"rotation": {x: 0, y: 0}});
    }
}

function restartScoreboard() {
    const globalVariablesTemp = world.scoreboard.getObjective("globalVariables");
    let globalVariables = globalVariablesTemp;

    if (!globalVariablesTemp?.isValid) {
        globalVariables = world.scoreboard.addObjective("globalVariables");
    }

    globalVariables?.setScore("sectionConcat", 100);
    globalVariables?.setScore("timer", 1200);
    globalVariables?.setScore("mission", 0);
}

function restartStructures() {
    const dimension = world.getDimension("overworld");

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

            const restartEntities = [
                "volley_ball",
                "wooden_doors",
                "screens",
                "screen",
                "path_to_farm",
                "path_to_outside",
                "path_to_limbo",
                "theentity",
                "tutorial_computer",
            ];

            let scoreboardTemp = world.scoreboard.getObjective("restartedEntities");
            let scoreboard;

            if (!scoreboardTemp) {
                scoreboard = world.scoreboard.addObjective("restartedEntities");
            } else {
                scoreboard = scoreboardTemp;
            }

            for (const restartEntity of restartEntities) {
                scoreboard.setScore(restartEntity, 1);
            }

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