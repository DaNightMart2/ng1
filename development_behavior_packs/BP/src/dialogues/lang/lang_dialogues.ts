import { Player, system, world, } from "@minecraft/server";
import { traverseTree, dialoguePackage, dialogueOptions, dialogueText, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, nameTranslations } from "./lang_translations";
import { positionInAreCheck, } from "../../helpers/global/global_functions";

/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param textIdentifier text to show or number to get the text translation to show. Of type string or number.
 */
function lang_dialog_package(
    player: Player,
    textIdentifier: string | number,
): dialoguePackage {
    let dialogue: dialogueText | dialogueOptions;

    let text: string | string[];
    if (typeof textIdentifier === "number") {
        text = payloadTranslations[textIdentifier][lang(player)];
    } else {
        text = textIdentifier;
    }

    if (typeof text === "string")
        dialogue = { type: "text", payload: text }
    else
        dialogue = { type: "options", payload: text }
    return {
        dialogue: dialogue,
        characterName: nameTranslations.system[lang(player)],
        characterImagePath: "textures/ui/faces/system/others/console",
        soundName: "click_on.metal_pressure_plate",
    };
}

let languageChoosingPlayers: Player[] = [];
const languageChoosing = system.runInterval(() => {
    if (world.getAllPlayers().length > 1) {
        if (world.getAllPlayers().length === languageChoosingPlayers.length) {
            system.clearRun(languageChoosing);
        }
    }

    for (const player of world.getAllPlayers()) {
        if (languageChoosingPlayers.includes(player)) return;
        if (!languageChosen(player)) {
            if (player.isInWater) {
                if (positionInAreCheck(player.location, {x: -19, y: 3, z: 6}, {x: -7, y: 4, z: 18})) {
                    player.teleport({x: -13.5, y: 40, z: 12.5}, {"rotation": {x: 90, y: 0}});
                }
                languageChoosingPlayers.push(player);
                traverseTree(
                    player,
                    [
                        {
                            name: "nextDialogTutorial",
                            dialoguePackage: lang_dialog_package(
                                player,
                                0,
                            ),
                            next: ["eng__spa"],
                        },

                        {
                            name: "eng__spa",
                            dialoguePackage: lang_dialog_package(
                                player,
                                1,
                            ),
                            next: ["", "ar__mx"],
                            tags: [["en"], []],
                        },

                        {
                            name: "ar__mx",
                            dialoguePackage: lang_dialog_package(
                                player,
                                2,
                            ),
                            next: ["", ""],
                            tags: [["es_ar"], ["es_mx"]],
                        }
                    ],
                    0,
                );
            }
        } else languageChoosingPlayers.push(player);
    }
});

function languageChosen(player: Player): boolean {
    if (!player.hasTag("es_ar") && !player.hasTag("en") && !player.hasTag("es_mx")) return false;
    return true;
}