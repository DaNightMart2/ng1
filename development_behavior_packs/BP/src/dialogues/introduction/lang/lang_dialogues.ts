import { Player, system, world, } from "@minecraft/server";
import { queueDialogue, } from "../../../handler/dialog/dialog_handler";

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (
            showLangMenu(player, true)
        ) {
            player.addTag("choosing_lang");

            queueDialogue(
                player,
                [
                    {
                        name: "eng__spa",
                        dialoguePackage: {
                            dialogue: { type: "options", payload: ["English", "Español"] },
                            characterName: "§lS.",
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

world.afterEvents.playerSpawn.subscribe(data => {
    if (data.initialSpawn) {
        data.player.removeTag("choosing_lang");
    }
});

function showLangMenu(player: Player, includeChoosing: boolean): boolean {
    if ((
        !player.hasTag("en") &&
        !player.hasTag("es")) &&
        !player.hasTag("choosing_lang") || !includeChoosing
    ) return true;
    return false;
}