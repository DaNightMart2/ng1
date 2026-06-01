import { world, system, EasingType, HudVisibility, ScoreboardObjective, } from "@minecraft/server";
import { positionInAreCheck, setMovement, } from "../../../../helpers/global/global_functions";

/**
 * Depending on the current section, does a certain action of the cutscene.
 */
function proceedCutscene() {
    const dimension = world.getDimension("overworld");
    const globalVariables = getGlobalVariables()[0];
    const sectionConcat = getGlobalVariables()[1];

    if (globalVariables) {
        for (const player of world.getAllPlayers()) {

            if (sectionConcat === 102) {
                globalVariables?.setScore("timer", 525);
                player.stopMusic();
                player.playMusic("ng1:gogys_sacrifice", {"loop": true, "fade": 1.0, "volume": 1.0});

                const screens = dimension.getEntities({"type": "ng1:screen", "tags": ["ng1:screen"]});
                for (const screen of screens) {
                    screen.triggerEvent("ng1:show_screen");
                }
            }

            if (sectionConcat === 103) {
                globalVariables?.setScore("timer", 20);
                setMovement(player, false);
                player.onScreenDisplay.setHudVisibility(HudVisibility.Hide);
                player.camera.setFov({"fov": 70});
                player.camera.setCamera("minecraft:free", {"location": {x: 122.0, y: 8.0, z: 51.0}, "rotation": {x: 0, y: -90}});
                // Camera looking at screen
            }

            if (sectionConcat === 104) {
                globalVariables?.setScore("timer", 60);
                player.camera.setCamera("minecraft:free", {"location": {x: 127.8, y: 8.0, z: 51.0}, "rotation": {x: 0, y: -90}, "easeOptions": {"easeTime": 3.0, "easeType": EasingType.InCubic}});
                // Camera on screen
            }

            if (sectionConcat === 105) {
                globalVariables?.setScore("timer", 165);
                player.camera.setCamera("minecraft:free", {"location": {x: 136.0, y: 22.8, z: 51.0}, "rotation": {x: 0, y: 90}});
                
                const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});
                for (const theentity of theentities) {
                    theentity.playAnimation("animation.theentity.jail_sequence");
                }
                // Camera looking at TheEntity

                player.camera.setCamera("minecraft:free", {"location": {x: 118.5, y: 22.8, z: 51.0}, "rotation": {x: 0, y: 90}, "easeOptions": {"easeTime": 5.0, "easeType": EasingType.OutCubic}});
                // Camera on TheEntity
            }

            if (sectionConcat === 106) {
                globalVariables?.setScore("timer", 10);
                world.structureManager.place(
                    "ng1:theentity_chains/no_chains",
                    dimension,
                    {x: 115, y: 21, z: 50},
                );
                player.playSound("dig.chain", {"volume": 1.0, "location": {x: 115.2, y: 22.8, z: 51.0}});
                player.camera.setCamera("minecraft:free", {"location": {x: 118.5, y: 22.3, z: 51.0}, "rotation": {x: 0, y: 90}, "easeOptions": {"easeTime": 0.4, "easeType": EasingType.OutBounce}});
                player.camera.setFov({"easeOptions": {"easeTime": 0.4, "easeType": EasingType.InBounce}, "fov": 40});
                dimension.spawnParticle("minecraft:campfire_smoke_particle", {x: 117.5, y: 21.0, z: 51.0});
                // Chain breaking
            }

            if (sectionConcat === 107) {
                globalVariables?.setScore("timer", 100);
                player.camera.setFov({"easeOptions": {"easeTime": 0.2, "easeType": EasingType.OutBounce}, "fov": 70});
            }

            if (sectionConcat === 108) {
                setMovement(player, true);
                player.camera.clear();
                player.onScreenDisplay.resetHudElementsVisibility();
                // End cutscene
            }
        }
    }
}

/** 
 * Gets the globalVariables and sectionConcat and timer from it and returns all that in an array. Returns [globalVariables, sectionConcat, timer], [ScoreboardObjective, number, number].
 */
function getGlobalVariables(): [ScoreboardObjective | undefined, number | undefined, number | undefined] {
    let sectionConcat;
    let timer;

    const globalVariables = world.scoreboard.getObjective("globalVariables");

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

    return [globalVariables, sectionConcat, timer];
}

let setTimer: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
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

    const globalVariables = getGlobalVariables()[0];
    let sectionConcat = getGlobalVariables()[1];
    const timer = getGlobalVariables()[2];

    if (typeof sectionConcat === "number" && typeof timer === "number") {
        if (sectionConcat >= 101 && sectionConcat <= 108) {
            if (timer > 0) {
                if (!(sectionConcat === 101) || InExp >= world.getAllPlayers().length) {
                    globalVariables?.addScore("timer", -1);
                }
            } else {
                globalVariables?.addScore("sectionConcat", 1);
                sectionConcat++;
            }

            if (setTimer) {
                if (setTimer[sectionConcat-101] !== true) {
                    proceedCutscene();
                }
            }
        }

        setTimer = [false, false, false, false, false, false, false, false];
        for (let i = 0; i <= sectionConcat-101; i++) {
            setTimer[i] = true;
        }
    }
}, 1);