import { EasingType, system, world, } from "@minecraft/server";
import { setMovement, positionInAreaCheck, getGlobalVariables, } from "../../../helpers/global/global_functions";
import { showGlobalDialogue, } from "../../../helpers/dialog/dialog_helper";

enum sectionConcatValues {
    WaitingForPlayers = 100,
    Executed = 101,
}

enum missionValues {
    OpenedTrapdoors = 1,
}

/**
 * Handles trapdoors cutscene.
 */
function showCutscene() {
    const dimension = world.getDimension("overworld");
    const globalVariables = getGlobalVariables().globalVariables;

    for (const player of world.getAllPlayers()) {
        if (positionInAreaCheck(
            player.location,
            {x: 34, y: 8, z: 23},
            {x: 35, y: 8, z: 24},
        )) {
            player.teleport({x: 35.0, y: 8.0, z: 26.5}, {"rotation": {x: 0, y: 0}});
        }

        setMovement(player, false);
        player.camera.setCamera(
            "minecraft:free",
            {"location": {x: 35.0, y: 11.0, z: 24.0},
            "rotation": {x: 90, y: 0}}
        );

        system.runTimeout(() => {
            player.camera.setCamera("minecraft:free",
                {
                    "location": {x: 35.0, y: 10.0, z: 24.0},
                    "rotation": {x: 90, y: 0},
                    "easeOptions": {
                        "easeType": EasingType.InOutCubic,
                        "easeTime": 3.0
                    }
                }
            );
        }, 20);

        system.runTimeout(() => {
            player.playSound("close.wooden_trapdoor", {"location": {x: 35.0, y: 8.0, z: 24.0}});
        }, 80);

        system.runTimeout(() => {
            player.camera.clear();
            setMovement(player, true);
            globalVariables.setScore("mission", missionValues.OpenedTrapdoors);
        }, 100);
    }

    system.runTimeout(() => {
        globalVariables?.setScore("sectionConcat", sectionConcatValues.Executed);
    }, 80);
}

/**
 * Call showCutscene().
 */
system.runInterval(() => {
    showGlobalDialogue().then(() => {
        const players = world.getAllPlayers();
        let InLimbo = 0;
        for (const player of players) {
            if (positionInAreaCheck(
                player.location,
                {x: 10, y: 3, z: -2},
                {x: 63, y: 45, z: 53},
            )) {
                InLimbo++;
            }
        }

        const { globalVariables, sectionConcat, timer, } = getGlobalVariables();

        if (InLimbo === players.length && sectionConcat === sectionConcatValues.WaitingForPlayers) {
            if (timer > 0) {
                globalVariables?.addScore("timer", -1);
            } else {
                globalVariables?.setScore("timer", 380);
                // Extra 80 due to the cutscene adding time.
                showCutscene();
            }
        }
    });
});