import { Player, system, world, } from "@minecraft/server";
import { queueDialogue, dialoguePackage, dialogueOptions, dialogueText, } from "../handler/dialog/dialog_handler";
import { lang, } from "../helpers/dialog/dialog_helper";
import { getGlobalVariables, } from "../helpers/global/global_functions";

export { theentity_dialog_package, };

const payloadTranslations = {
    "1_initializing": {
        "en": "(Initializing Systems)",
        "es": "(Inicializando Sistemas)",
    },
    "2_welcome_players": {
        "en": "Welcome, players. I see you're new to this place, let me get something straight:",
        "es": "Bienvenidos, jugadores. Veo que son nuevos en este lugar, déjenme aclararles algo:",
    },
    "3_dp": {
        "en": "The people here, the people from P. D. do NOT want you here.",
        "es": "Las personas aquí, las personas de D. P. NO los quieren aquí.",
    },
    "4_confusion": {
        "en": "You seem confused, do you not know who P. D. is? Well, lucky you...",
        "es": "",
    },
    "5_death": {
        "en": "§oY o u  w i l l  d i e  w i t h o u t  m e e t i n g  t h e m .",
        "es": "§oM o r i r á s  s i n  c o n o c e r l o s .",
    },
}

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

/**
 * Call TheEntity dialogs when on the correct section.
 */
system.runInterval(() => {
    const sectionConcat = getGlobalVariables().sectionConcat;

    if (sectionConcat === 112) {
        for (const player of world.getAllPlayers()) {
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
        }
    }
});