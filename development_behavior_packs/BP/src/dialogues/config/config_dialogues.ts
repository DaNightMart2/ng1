import { Player, system, world, } from "@minecraft/server";
import { queueDialogue, dialoguePackage, dialogueOptions, dialogueText, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, nameTranslations, } from "./config_translations";

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

function config(player: Player) {
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
                tags: [["restart-event"], []],
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
                tags: [["restart-lang"], []],
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
                tags: [["restart-pos"], []],
            },
        ],
    );
};

world.afterEvents.playerSpawn.subscribe(data => {
    if (data.initialSpawn) {
        system.runTimeout(() => {
            for (const player of world.getPlayers({"tags": ["admin"]})) {
                config(player);
            }
        }, 1000);
    }
})

system.runTimeout(() => {
    for (const player of world.getPlayers({"tags": ["admin"]})) {
        config(player);
    }
});