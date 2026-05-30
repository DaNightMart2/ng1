import { world, system, EasingType, } from "@minecraft/server";
import { positionInAreCheck, } from "../../../../helpers/global/global_functions";

function showCutscene() {
    const dimension = world.getDimension("overworld");
    const screens = dimension.getEntities({"type": "ng1:screen", "tags": ["ng1:screen"]});
    for (const screen of screens) {
        screen.triggerEvent("ng1:show_screen");
    }

    for (const player of world.getAllPlayers()) {
        player.stopMusic();
        player.playMusic("ng1:gogys_sacrifice", {"loop": true, "fade": 1.0, "volume": 1.0});

        system.runTimeout(() => {
            player.camera.setCamera("minecraft:free", {"location": {x: 122.0, y: 8.0, z: 51.0}, "rotation": {x: 0, y: -90}});
            // Camera looking at screen

            system.runTimeout(() => {
                player.camera.setCamera("minecraft:free", {"location": {x: 127.8, y: 8.0, z: 51.0}, "rotation": {x: 0, y: -90}, "easeOptions": {"easeTime": 3.0, "easeType": EasingType.InCubic}});
                // Camera on screen

                system.runTimeout(() => {
                    player.camera.setCamera("minecraft:free", {"location": {x: 135.0, y: 23.0, z: 51.0}, "rotation": {x: 0, y: 90}}); // Camera looking at TheEntity

                    player.camera.setCamera("minecraft:free", {"location": {x: 118.5, y: 23.0, z: 51.0}, "rotation": {x: 0, y: 90}, "easeOptions": {"easeTime": 5.0, "easeType": EasingType.OutCubic}});
                    // Camera on TheEntity

                    system.runTimeout(() => {
                        player.playSound("dig.chain", {"volume": 1.0, "location": {x: 1185.5, y: 23.0, z: 51.0}});
                        // Chain breaking SFX
                    }, 130);

                    system.runTimeout(() => {
                        player.camera.clear(); // Clear camera

                    }, 240);
                }, 100);
            }, 20);
        }, 525);

        system.runTimeout(() => {
            world.structureManager.place(
                "ng1:theentity_chains/no_chains",
                dimension,
                {x: 115, y: 21, z: 50},
            );
        }, 765);
    }

    const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});
    for (const theentity of theentities) {
        system.runTimeout(() => {
            theentity.playAnimation("animation.theentity.jail_sequence");
        }, 625);
    }
}

let calledCutscene: boolean;
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
        if (sectionConcat !== 102) {
            calledCutscene = false;
        }

        if (InExp === world.getAllPlayers().length && sectionConcat === 101) {
            if (timer > 0) {
                globalVariables?.addScore("timer", -1);
            } else {
                globalVariables?.setScore("sectionConcat", 102);
            }
        }

        if (sectionConcat === 102 && calledCutscene === false) {
            calledCutscene = true;
            globalVariables?.setScore("timer", 6000);
            showCutscene();
        }
    }

}, 1);