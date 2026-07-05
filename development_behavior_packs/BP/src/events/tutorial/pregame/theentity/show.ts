import { EasingType, system, world, } from "@minecraft/server";
import { getGlobalVariables, } from "../../../../helpers/global/global_functions";
import { theentity_dialog_sequence, } from "../../../../dialogues/theentity_dialogs";
import { showGlobalDialogue, } from "../../../../helpers/dialog/dialog_helper";

enum sectionConcatValues {
    WaitingForTheEntity = 103,
    Executed = 104,
}

/**
 * Handles TheEntity appearance cutscene.
 */
function showCutscene() {
    const dimension = world.getDimension("overworld");

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
        for (const player of world.getAllPlayers()) {
            player.onScreenDisplay.setTitle("______");
            player.onScreenDisplay.updateSubtitle("§l§2TheEntity");
        }

        const cameraOnTheEntity = system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});
                for (const theentity of theentities) {
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
        const globalVariables = getGlobalVariables().globalVariables;
        let sectionConcat = getGlobalVariables().sectionConcat;
        const timer = getGlobalVariables().timer;

        if (sectionConcat === sectionConcatValues.WaitingForTheEntity) {
            if (timer > 0) {
                globalVariables?.addScore("timer", -1);
            } else {
                globalVariables?.setScore("sectionConcat", sectionConcatValues.Executed);
                showCutscene();
            }
        }
    });
});