import { Player, PlayerCursorInventoryComponent, system, world, } from "@minecraft/server";
import { queueDialogue, dialoguePackage, dialogueOptions, dialogueText, } from "../handler/dialog/dialog_handler";
import { lang, } from "../helpers/dialog/dialog_helper";

const payloadTranslations = {
    "0_yes_no": {
        "en": ["Yes", "No"],
        "es": ["Sí", "No"],
    },
    "1_event": {
        "en": "* Do you want to restart structures, scoreboards and entities?",
        "es": "* ¿Quieres reiniciar las estructuras, los marcadores y las entidades?",
    },
    "2_lang": {
        "en": "* Do you want to restart language selection?",
        "es": "* ¿Quieres reiniciar la selección de idiomas?",
    },
    "3_pos": {
        "en": "* Do you want to restart positions?",
        "es": "* ¿Quieres reiniciar las posiciones?",
    },
}

const nameTranslations = {
    system: {
        "en": "§lSystem",
        "es": "§lSistema",
    },
}

/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. Of type key of type of payload translations.
 */
function config_dialog_package(
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
        characterName: nameTranslations.system[lang(player)],
        characterImagePath: "textures/ui/faces/system/others/console",
        soundName: "click_on.metal_pressure_plate",
    };
}

/**
 * Call config dialog to players with admin tag.
 */
system.runTimeout(() => {
    for (const player of world.getPlayers({"tags": ["admin"]})) {
        player.addTag("dialog-on_restart");
        queueDialogue(
            player,
            [
                {
                    name: "event",
                    dialoguePackage: config_dialog_package(
                        player,
                        "1_event",
                    ),
                    next: ["event_question"],
                },
                {
                    name: "event_question",
                    dialoguePackage: config_dialog_package(
                        player,
                        "0_yes_no",
                    ),
                    next: ["lang", "lang", ""],
                    tags: [["restart-event"], [], ["-dialog-on_restart"]],
                },

                {
                    name: "lang",
                    dialoguePackage: config_dialog_package(
                        player,
                        "2_lang",
                    ),
                    next: ["lang_question"],
                },
                {
                    name: "lang_question",
                    dialoguePackage: config_dialog_package(
                        player,
                        "0_yes_no",
                    ),
                    next: ["pos", "pos", ""],
                    tags: [["restart-lang"], [], ["-dialog-on_restart"]],
                },

                {
                    name: "pos",
                    dialoguePackage: config_dialog_package(
                        player,
                        "3_pos",
                    ),
                    next: ["pos_question"],
                },
                {
                    name: "pos_question",
                    dialoguePackage: config_dialog_package(
                        player,
                        "0_yes_no",
                    ),
                    next: ["", "", ""],
                    tags: [["restart-pos", "-dialog-on_restart"], ["-dialog-on_restart"], ["-dialog-on_restart"]],
                },
            ],
        );
    }
});
