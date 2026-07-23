import { Player, world, } from "@minecraft/server";
import { queueDialogue, dialoguePackage, dialogueOptions, dialogueText, } from "../handler/dialog/dialog_handler";
import { lang, } from "../helpers/dialog/dialog_helper";

export { theentity_dialog_sequence, theentity_initializing_dialog, };

const payloadTranslations = {
    "1_welcome_players": {
        "en": "> Welcome, players. I see you are new to this place, so let me tell you something:",
        "es": "> Bienvenidos, jugadores. Veo que son nuevos en este lugar, así que déjenme decirles algo:",
    },
    "2_dp": {
        "en": "> The people here, the people from P. D., do NOT want you here.",
        "es": "> Las personas aquí, las personas de D. P., NO los quieren aquí.",
    },
    "3_confusion": {
        "en": "> You seem confused. Do you not know who P. D. is? Well, lucky you...",
        "es": "> Parecen confundidos. ¿No saben quién es D. P.? Qué afortunados...",
    },
    "4_death": {
        "en": "> §o§4You will die without meeting them.",
        "es": "> §o§4Morirán sin conocerlos.",
    },

    "5_initializing": {
        "en": "> (I will now proceed to prepare until all of you have finished reading my dialogues.)",
        "es": "> (Ahora procederé a prepararme hasta que todos ustedes hayan terminado de leer mis diálogos.)",
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
        characterImagePath: "textures/ui/faces/theentity/main",
        soundName: "click_on.metal_pressure_plate",
    };
}

/**
 * Calls TheEntity (first battle introduction) dialogs.
 */
function theentity_dialog_sequence() {
    for (const player of world.getAllPlayers()) {
        queueDialogue(
            player,
            [
                {
                    name: "welcome_players",
                    dialoguePackage: theentity_dialog_package(
                        player,
                        "1_welcome_players",
                    ),
                    next: ["dp"],
                },
                {
                    name: "dp",
                    dialoguePackage: theentity_dialog_package(
                        player,
                        "2_dp",
                    ),
                    next: ["confusion"],
                },
                {
                    name: "confusion",
                    dialoguePackage: theentity_dialog_package(
                        player,
                        "3_confusion",
                    ),
                    next: ["death"],
                },
                {
                    name: "death",
                    dialoguePackage: theentity_dialog_package(
                        player,
                        "4_death",
                    ),
                    next: [""],
                    tags: [["dialog-theentity_meeting"]],
                },
            ],
            true,
        );
    }
}

/**
 * Calls TheEntity dialogue for when one player has not yet finished a dialogue.
 */
function theentity_initializing_dialog(player: Player) {
    queueDialogue(
        player,
        [
            {
                name: "initializing",
                dialoguePackage: theentity_dialog_package(
                    player,
                    "5_initializing",
                ),
                next: [""],
                tags: [["dialog-theentity_initialization_closed"]],
            },
        ],
    );
}
