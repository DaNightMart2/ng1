import { Player, } from "@minecraft/server";
import { queueDialogue, dialoguePackage, dialogueOptions, dialogueText, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, } from "./theentity_translations";

export { theentity_first_battle, };

/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. Of type key of type of payload translations.
 */
function theentity_dialog_package(
    player: Player,
    translationIdentifier: keyof typeof payloadTranslations,
): dialoguePackage {
    let dialogue: dialogueText | dialogueOptions;

    const text = payloadTranslations[translationIdentifier][lang(player)];

    if (typeof text === "string")
        dialogue = { type: "text", payload: text, }
    else
        dialogue = { type: "options", payload: text, }
    return {
        dialogue: dialogue,
        characterName: "TheEntity",
        characterImagePath: "textures/ui/faces/system/others/console",
        soundName: "click_on.metal_pressure_plate",
    };
}

function theentity_first_battle(player: Player) {
    queueDialogue(
        player,
        [
            {
                name: "initializing",
                dialoguePackage: theentity_dialog_package(
                    player,
                    "1_initializing",
                ),
                next: ["welcome_players"],
            },
            {
                name: "welcome_players",
                dialoguePackage: theentity_dialog_package(
                    player,
                    "2_welcome_players",
                ),
                next: ["dp"],
            },
            {
                name: "dp",
                dialoguePackage: theentity_dialog_package(
                    player,
                    "3_dp",
                ),
                next: ["confusion"],
            },
            {
                name: "confusion",
                dialoguePackage: theentity_dialog_package(
                    player,
                    "4_confusion",
                ),
                next: ["death"],
            },
            {
                name: "death",
                dialoguePackage: theentity_dialog_package(
                    player,
                    "5_death",
                ),
                next: [""],
            },
        ],
    );
};