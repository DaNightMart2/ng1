import { system, world, } from "@minecraft/server";
import { queueDialogue, } from "../handler/dialog/dialog_handler";

/**
 * Calls choosing lang dialog to players who have not chosen a language.
 */
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (
            !player.hasTag("en") &&
            !player.hasTag("es") &&
            !player.hasTag("choosing_lang")
        ) {
            player.addTag("choosing_lang");

            queueDialogue(
                player,
                [
                    {
                        name: "eng__spa",
                        dialoguePackage: {
                            dialogue: { type: "options", payload: ["English", "Español"] },
                            characterName: "§lSystem",
                            characterImagePath: "textures/ui/faces/system/others/console",
                            soundName: "click_on.metal_pressure_plate",
                        },
                        next: ["", ""],
                        tags: [["en", "-choosing_lang"], ["es", "-choosing_lang"]],
                    },
                ],
            );
        }
    }
});

/**
 * Remove choosing lang tag from players who left and rejoined.
 */
world.afterEvents.playerSpawn.subscribe(data => {
    if (data.initialSpawn) {
        data.player.removeTag("choosing_lang");
    }
});