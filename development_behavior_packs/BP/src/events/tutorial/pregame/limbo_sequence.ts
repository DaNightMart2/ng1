import { EasingType, system, world, } from "@minecraft/server";
import { setMovement, positionInAreCheck, } from "../../../helpers/global/global_functions";

function showCutscene() {
    const dimension = world.getDimension("overworld");

    for (const player of world.getAllPlayers()) {
        if (positionInAreCheck(
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
        }, 100);
    }

    system.runTimeout(() => {
        world.structureManager.place(
            "ng1:lobby_trapdoors/open",
            dimension,
            {x: 34, y: 7, z: 23},
        );
    }, 80);
}

let calledCutscene: boolean;
system.runInterval(() => {
    let InLimbo = 0;
    for (const player of world.getAllPlayers()) {
        if (positionInAreCheck(
            player.location,
            {x: 10, y: 3, z: -2},
            {x: 63, y: 45, z: 53},
        )) {
            InLimbo++;
        }
    }

    const globalVariables = world.scoreboard.getObjective("globalVariables");
    let sectionConcat;
    let timer;

    try {
        sectionConcat = globalVariables?.getScore("sectionConcat");
    } catch (_) {
        sectionConcat = globalVariables?.addScore("sectionConcat", 100);
    }
    try {
        timer = globalVariables?.getScore("timer");
    } catch (_) {
        timer = globalVariables?.addScore("timer", 1200);
    }

    if (typeof sectionConcat === "number" && typeof timer === "number") {
        if (sectionConcat !== 101) {
            calledCutscene = false;
        }

        if (InLimbo === world.getAllPlayers().length && sectionConcat === 100) {
            if (timer > 0) {
                globalVariables?.addScore("timer", -1);
            } else {
                globalVariables?.setScore("sectionConcat", 101);
            }
        }

        if (sectionConcat === 101 && calledCutscene === false) {
            calledCutscene = true;
            globalVariables?.setScore("timer", 1200);
            showCutscene();
        }
    }
}, 1);