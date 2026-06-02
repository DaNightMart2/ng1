import { system, world, } from "@minecraft/server";
import { getGlobalVariables, } from "../../../../helpers/global/global_functions";

let i = 0;
system.runInterval(() => {
    const dimension = world.getDimension("overworld");

    const globalVariables = getGlobalVariables().globalVariables;
    const sectionConcat = getGlobalVariables().sectionConcat;

    if (sectionConcat === 109) {
        world.structureManager.place(
            "ng1:tv_structure/empty",
            dimension,
            {x: 124, y: 3, z: 47},
        );

        const screens = dimension.getEntities({"type": "ng1:screen", "tags": ["ng1:screen"]});
        for (const screen of screens) {
            screen.remove();
        }

        for (const player of world.getAllPlayers()) {
            player.playSound("random.explode", {"location": {x: 129.0, y: 18.0, z: 51.0}, "volume": 1.0});
        }
        dimension.spawnParticle("minecraft:dragon_death_explosion_emitter", {x: 129.0, y: 10.0, z: 51.0});
        // Initial sound and particle call to avoid initial 10 tick delay.

        const explosionFX = system.runInterval(() => {
            dimension.spawnParticle("minecraft:dragon_death_explosion_emitter", {x: 129.0, y: 10.0, z: 51.0});
            for (const player of world.getAllPlayers()) {
                player.playSound("random.explode", {"location": {x: 129.0, y: 18.0, z: 51.0}, "volume": 1.0});
            }
            if (i >= 1) {
                system.clearRun(explosionFX);
            } else {
                i++;
            }
        }, 10);

        globalVariables.setScore("sectionConcat", 110);
    }
});