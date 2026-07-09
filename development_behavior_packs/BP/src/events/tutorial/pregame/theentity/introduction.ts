import { world, system, EasingType, HudVisibility, } from "@minecraft/server";
import { positionInAreaCheck, getGlobalVariables, } from "../../../../helpers/global/global_functions";
import { showGlobalDialogue, } from "../../../../helpers/dialog/dialog_helper";
import { theentity_dialog_sequence, theentity_initializing_dialog, } from "../../../../dialogues/theentity_dialogs";

enum sectionConcatValues {
    WaitingForTheEntity = 103,
    Executed = 104,
    StructurePlaced = 105,
}

/**
 * Depending on the current section, does a certain action of the cutscene.
 */
function showCutscene() {
    const dimension = world.getDimension("overworld");
    const { globalVariables } = getGlobalVariables();

    /**
     * Explosion effect.
     */
    system.runTimeout(() => {
        world.structureManager.place(
            "ng1:tv_structure/empty",
            dimension,
            {x: 124, y: 3, z: 47},
        );

        const screens = dimension.getEntities({"type": "ng1:screen", "tags": ["ng1:screen"]});
        for (const screen of screens) {
            screen.remove();
        }

        globalVariables.setScore("sectionConcat", sectionConcatValues.StructurePlaced);

        dimension.spawnParticle("minecraft:dragon_death_explosion_emitter", {x: 129.0, y: 10.0, z: 51.0});
        for (const player of world.getAllPlayers()) {
            player.playSound("random.explode", {"location": {x: 129.0, y: 18.0, z: 51.0}, "volume": 50.0});
        }
    }, 40);

    /**
     * TheEntity fall
     */
    system.runTimeout(() => {
        const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});
        for (const theentity of theentities) {
            theentity.teleport({x: 128.5, y: 25, z: 51.0}, {"rotation": {x: 0, y: 90}});
            theentity.addEffect("slow_falling", 200, {"amplifier": 10, "showParticles": false});
        }

        const players = world.getAllPlayers();
        for (const player of players) {
            player.onScreenDisplay.setTitle("______");
            player.onScreenDisplay.updateSubtitle("Â§lÂ§2TheEntity");
        }

        const cameraOnTheEntity = system.runInterval(() => {
            const currentPlayers = world.getAllPlayers();
            const currentTheentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});

            for (const player of currentPlayers) {
                for (const theentity of currentTheentities) {
                    if (theentity.location.y > 4) {
                        player.camera.setCamera("minecraft:free", {"easeOptions": {"easeType": EasingType.OutCubic, "easeTime": 0.3}, "rotation": {x: 0, y: -90}, "location": {x: 125, y: theentity.location.y + 1.0, z: 51.0}});
                    } else {
                        system.clearRun(cameraOnTheEntity);
                        system.runTimeout(() => {
                            theentity_dialog_sequence();
                        }, 20);
                    }
                }
            }
        });
    }, 60);
};

/**
 * Calls showCutscene().
 */
system.runInterval(() => {
    showGlobalDialogue().then(() => {
        const players = world.getAllPlayers();
        const meetingPlayers = world.getPlayers({"tags": ["dialog-theentity_meeting"]});
        let InExp = 0;

        for (const player of players) {
            if (positionInAreaCheck(
                player.location,
                {x: 102, y: 3, z: 27},
                {x: 156, y: 18, z: 74},
            )) {
                InExp++;
            }
        }

        const { globalVariables, sectionConcat, timer } = getGlobalVariables();

        for (const player of players) {
            if (player.hasTag("dialog-theentity_meeting") && !player.hasTag("dialog-theentity_initialization")) {
                if (meetingPlayers.length < players.length) {
                    theentity_initializing_dialog(player);
                    player.addTag("dialog-theentity_initialization");
                } else {
                    player.camera.clear();
                }
            }
        }

        if (InExp === players.length && sectionConcat === sectionConcatValues.WaitingForTheEntity) {
            if (timer > 0) {
                globalVariables?.addScore("timer", -1);
            } else {
                globalVariables?.setScore("sectionConcat", sectionConcatValues.Executed);
                showCutscene();
            }
        }
    });
});