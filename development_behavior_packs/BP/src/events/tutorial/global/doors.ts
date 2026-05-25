import { system, world, } from "@minecraft/server";

function modify_doors(state: boolean) {
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

function modify_screen(state: boolean) {
    const dimension = world.getDimension("overworld");

    for (const screen of dimension.getEntities({
        "type": "ng1:screen",
        "tags": ["ng1:screen"],
    })) {
        if (state && screen.getProperty("ng1:is_hidden")) {
            screen.triggerEvent("ng1:show_screen");
        } else if (!state && !screen.getProperty("ng1:is_hidden")) {
            screen.triggerEvent("ng1:hide_screen");
        }
    }
}

system.runInterval(() => {
    let sectionConcat
    try {
        sectionConcat = world.scoreboard.getObjective("globalVariables")?.getScore("sectionConcat");
    } catch (_) {
        sectionConcat = 0;
    }
    if (typeof sectionConcat === "number" && sectionConcat >= 110) {
        modify_doors(true);
    } else {
        modify_doors(false);
    }

    if (typeof sectionConcat === "number" && sectionConcat >= 102) {
        modify_screen(true);
    } else {
        modify_screen(false);
    }
});