import { system, world, } from "@minecraft/server";
import { getGlobalVariables, } from "../../../helpers/global/global_functions";

/**
 * Modifies the state of the experiment room barricaded door and the shortcut to the laboratory from Limbo.
 * @param state state to set the doors to. Of type boolean.
*/
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

/**
 * Modifies the state of the main screen in the experiment room.
 * @param state state to set the screen to. Of type boolean.
 */
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

/**
 * Calls the function for modifying the state of the two doors and the screen.
 */
system.runInterval(() => {
    const sectionConcat = getGlobalVariables().sectionConcat;

    if (sectionConcat >= 120) {
        modify_doors(true);
    } else {
        modify_doors(false);
    }

    if (sectionConcat >= 102) {
        modify_screen(true);
    } else {
        modify_screen(false);
    }
});