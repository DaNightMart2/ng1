import { system, world, } from "@minecraft/server";
import { positionInAreaCheck, getGlobalVariables, } from "../../../../../helpers/global/global_functions";

const teleportOffset = 0.01;

enum sectionConcatValues {
    BattleIsSetUp = 107,
}

system.runInterval(() => {
    let PushActivated = false;
    const sectionConcat = getGlobalVariables().sectionConcat;

    if (sectionConcat === sectionConcatValues.BattleIsSetUp) {
        PushActivated = true;
    } else {
        system.runTimeout(() => {
            PushActivated = false;
        }, 60);
    }

    if (PushActivated) {
        for (const player of world.getAllPlayers()) {
            if (!positionInAreaCheck(
                player.location,
                { x: 107, y: 3, z: 27 },
                { x: 146, y: 18, z: 74 },
            )) {
                player.teleport({ x: 109.0, y: 3.0, z: 51.0 }, { "rotation": { x: 0, y: -90, } });
            }
        }

        for (const pivotPlayer of world.getAllPlayers()) {
            const affectedPlayers = world.getAllPlayers();
            const pivotPlayerArrayPos = affectedPlayers.indexOf(pivotPlayer);
            affectedPlayers.splice(pivotPlayerArrayPos, 1);

            for (const affectedPlayer of affectedPlayers) {
                const distance = Math.sqrt(
                    (affectedPlayer.location.x - pivotPlayer.location.x) ** 2 +
                    (affectedPlayer.location.z - pivotPlayer.location.z) ** 2
                );

                if (distance < 5) {
                    let xPivotChange = -teleportOffset;
                    let zPivotChange = -teleportOffset;

                    if (pivotPlayer.location.x - affectedPlayer.location.x > 0) {
                        xPivotChange = -xPivotChange;
                    }
                    if (pivotPlayer.location.z - affectedPlayer.location.z > 0) {
                        zPivotChange = -zPivotChange;
                    }

                    affectedPlayer.teleport({
                        x: affectedPlayer.location.x - xPivotChange,
                        y: 3,
                        z: affectedPlayer.location.z - zPivotChange,
                    });
                }
            }
        }
    }
});