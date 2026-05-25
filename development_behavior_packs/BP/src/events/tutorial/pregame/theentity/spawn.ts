import { world, system, } from "@minecraft/server";
import { positionInAreCheck, } from "../../../../helpers/global/global_functions";

function showCutscene() {
    const dimension = world.getDimension("overworld");

    
}

system.runInterval(() => {
    let InExp = 0;
    for (const player of world.getAllPlayers()) {
        if (positionInAreCheck(
            player.location,
            {x: 102, y: 3, z: 27},
            {x: 156, y: 18, z: 74},
        )) {
            InExp++;
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
        if (InExp === world.getAllPlayers().length && sectionConcat === 101) {
            if (timer > 0) {
                globalVariables?.addScore("timer", -1);
            } else {
                globalVariables?.setScore("sectionConcat", 102);
                globalVariables?.setScore("timer", 6000);
                showCutscene();
            }
        }
    }
}, 1);