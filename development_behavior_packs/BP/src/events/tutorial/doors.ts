import { system, world, } from "@minecraft/server";

function exp_shortcut(state: boolean) {
    const dimension = world.getDimension("overworld");

    let result = ""
    if (state) {
        result = "open";
    } else {
        result = "closed";
        for (const player of world.getAllPlayers()) {
            player.removeTag("ToLaboratory02");
        }
    }

    world.structureManager.place("ng1:lab_shortcut/" + result, dimension, {x: 19, y: 6, z: -2});
    world.structureManager.place("ng1:exp_barricaded_door/" + result, dimension, {x: 105, y: 3, z: 49});
}

system.runInterval(() => {
    let sectionConcat
    try {
        sectionConcat = world.scoreboard.getObjective("globalVariables")?.getScore("sectionConcat");
    } catch (_) {
        sectionConcat = 0;
    }
    if (typeof sectionConcat === "number" && sectionConcat >= 110) {
        exp_shortcut(true);
    } else {
        exp_shortcut(false);
    }
});