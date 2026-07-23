import { system, world, } from "@minecraft/server";
import { getGlobalVariables, } from "../../../helpers/global/global_functions";

enum sectionConcatValues {
    OpenedTrapdoors = 101,
    ScreenAppeared = 102,
    TheEntitySpawned = 105,
    TheEntityFled = 111,

}

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
function modify_screen_structure(sectionConcat: number) {
    const dimension = world.getDimension("overworld");
    const screens = dimension.getEntities({
        "type": "ng1:screen",
        "tags": ["ng1:screen"],
    });

    for (const screen of screens) {
        if (sectionConcat < sectionConcatValues.ScreenAppeared) {
            if (!screen.getProperty("ng1:is_hidden")) {
                screen.triggerEvent("ng1:hide_screen");
            }

            world.structureManager.place(
                "ng1:tv_structure/structure",
                dimension,
                { x: 124, y: 3, z: 47 },
            );
        } else if (sectionConcat < sectionConcatValues.TheEntitySpawned) {
            if (screen.getProperty("ng1:is_hidden")) {
                screen.triggerEvent("ng1:show_screen");
            }

            world.structureManager.place(
                "ng1:tv_structure/structure",
                dimension,
                { x: 124, y: 3, z: 47 },
            );
        } else if (sectionConcat < sectionConcatValues.TheEntityFled) {
            world.structureManager.place(
                "ng1:tv_structure/empty",
                dimension,
                { x: 124, y: 3, z: 47 },
            );
            screen.remove();
        }
    }
}

/**
 * Modifies the state of Limbo trapdoors.
 * @param state state to set the trapdoors to. Of type boolean.
*/
function modify_trapdoors(state: boolean) {
    const dimension = world.getDimension("overworld");

    let result = ""
    if (state) {
        result = "open";
    } else {
        result = "closed";
    }

    world.structureManager.place("ng1:lobby_trapdoors/" + result, dimension, {x: 34, y: 7, z: 23});
}

/**
 * Calls the function for modifying the state of the two doors and the screen.
 */
system.runInterval(() => {
    const sectionConcat = getGlobalVariables().sectionConcat;

    modify_trapdoors(sectionConcat >= sectionConcatValues.OpenedTrapdoors);
    modify_doors(sectionConcat >= sectionConcatValues.TheEntityFled);
    modify_screen_structure(sectionConcat);
});