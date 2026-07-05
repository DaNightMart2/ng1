import { world, system, EasingType, HudVisibility, } from "@minecraft/server";
import { positionInAreCheck, setMovement, getGlobalVariables, } from "../../../../helpers/global/global_functions";
import { showGlobalDialogue, } from "../../../../helpers/dialog/dialog_helper";

enum sectionConcatValues {
    WaitingForPlayers = 101,
    Executed = 102,
    Finished = 103,
}

/**
 * Depending on the current section, does a certain action of the cutscene.
 */
function showCutscene() {
    const dimension = world.getDimension("overworld");

    for (const player of world.getAllPlayers()) {
        player.stopMusic();
        player.playMusic("ng1:gogys_sacrifice", {"loop": true, "fade": 1.0, "volume": 1.0});

        const screens = dimension.getEntities({"type": "ng1:screen", "tags": ["ng1:screen"]});
        for (const screen of screens) {
            screen.triggerEvent("ng1:show_screen");
        }

        /**
         * Camera looking at screen and on it.
         */
        system.runTimeout(() => {
            setMovement(player, false);
            player.onScreenDisplay.setHudVisibility(HudVisibility.Hide);
            player.camera.setFov({"fov": 70});
            player.camera.setCamera("minecraft:free", {"location": {x: 122.0, y: 8.0, z: 51.0}, "rotation": {x: 0, y: -90}});
            // Camera looking at screen

            /**
             * Camera to screen.
             */
            system.runTimeout(() => {
                player.camera.setCamera("minecraft:free", {"location": {x: 127.8, y: 8.0, z: 51.0}, "rotation": {x: 0, y: -90}, "easeOptions": {"easeTime": 3.0, "easeType": EasingType.InCubic}});
                // Camera on screen
            }, 20);

        }, 525);

        /**
         * Camera looking at TheEntity and on them.
         */
        system.runTimeout(() => {
            const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});
            for (const theentity of theentities) {
                theentity.playAnimation("animation.theentity.jail_sequence");
            }

            player.camera.setCamera("minecraft:free", {"location": {x: 136.0, y: 22.8, z: 51.0}, "rotation": {x: 0, y: 90}});
            // Camera looking at TheEntity

            player.camera.setCamera("minecraft:free", {"location": {x: 118.5, y: 22.8, z: 51.0}, "rotation": {x: 0, y: 90}, "easeOptions": {"easeTime": 5.0, "easeType": EasingType.OutCubic}});
            // Camera on TheEntity
        }, 605);

        /**
         * TheEntity escape.
         */
        system.runTimeout(() => {

            world.structureManager.place(
                "ng1:theentity_chains/no_chains",
                dimension,
                {x: 115, y: 21, z: 50},
            );

            player.playSound("dig.chain", {"volume": 1.0, "location": {x: 115.2, y: 22.8, z: 51.0}});

            player.camera.setCamera("minecraft:free", {"location": {x: 118.5, y: 22.3, z: 51.0}, "rotation": {x: 0, y: 90}, "easeOptions": {"easeTime": 0.4, "easeType": EasingType.OutBounce}});

            player.camera.setFov({"easeOptions": {"easeTime": 0.4, "easeType": EasingType.InBounce}, "fov": 40});

            dimension.spawnParticle("minecraft:campfire_smoke_particle", {x: 117.5, y: 21.0, z: 51.0});

            dimension.spawnParticle("minecraft:dragon_death_explosion_emitter", {x: 115.5, y: 23.0, z: 51.0});

            dimension.spawnParticle("minecraft:camera_shoot_explosion", {x: 115.5, y: 23.0, z: 51.0});

            player.playSound("random.explode", {"location": {x: 115.5, y: 23.0, z: 51.0}, "volume": 0.5});

            // Chain breaking

            /**
             * Juggle FOV
             */
            system.runTimeout(() => {
                player.camera.setFov({"easeOptions": {"easeTime": 0.2, "easeType": EasingType.OutBounce}, "fov": 70});
            }, 15);

        }, 765);

        /**
         * End cutscene.
         */
        system.runTimeout(() => {
            setMovement(player, true);
            player.camera.clear();
            player.onScreenDisplay.resetHudElementsVisibility();
            getGlobalVariables().globalVariables.setScore("sectionConcat", sectionConcatValues.Finished);
        }, 880);
    }
}

/**
 * Calls showCutscene().
 */
system.runInterval(() => {
    showGlobalDialogue().then(() => {
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

        const globalVariables = getGlobalVariables().globalVariables;
        let sectionConcat = getGlobalVariables().sectionConcat;
        const timer = getGlobalVariables().timer;

        if (InExp === world.getAllPlayers().length && sectionConcat === sectionConcatValues.WaitingForPlayers) {
            if (timer > 0) {
                globalVariables?.addScore("timer", -1);
            } else {
                globalVariables?.setScore("sectionConcat", sectionConcatValues.Executed);
                showCutscene();
            }
        }
    });
});