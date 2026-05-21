import { Player, system, world, } from "@minecraft/server";
import {
    queueDialogue,
    dialoguePackage,
    dialogueOptions,
    dialogueText,
} from "../../../handler/dialog/dialog_handler";
import { lang, } from "../../../helpers/dialog/dialog_helper";
import { payloadTranslations, nameTranslations, } from "./lang_translations";
import { positionInAreCheck, } from "../../../helpers/global/global_functions";

/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. Of type key of type of payload translations.
 */
function lang_dialog_package(
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

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (
            positionInAreCheck(player.location, {x: -19, y: 46, z: 6}, {x: -7, y: 49, z: 18}) &&
            showLangMenu(player, true)
        ) {
            player.addTag("choosing_lang");

            queueDialogue(
                player,
                [
                    {
                        name: "eng__spa",
                        dialoguePackage: lang_dialog_package(
                            player,
                            "1_eng__spa",
                        ),
                        next: ["", "ar__mx"],
                        tags: [["en", "-choosing_lang"], []],
                    },

                    {
                        name: "ar__mx",
                        dialoguePackage: lang_dialog_package(
                            player,
                            "2_ar__mx",
                        ),
                        next: ["", "", "eng__spa"],
                        tags: [["es_ar", "-choosing_lang"], ["es_mx", "-choosing_lang"]],
                    }
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
        !player.hasTag("es_ar") &&
        !player.hasTag("en") &&
        !player.hasTag("es_mx")) &&
        !player.hasTag("choosing_lang") || !includeChoosing
    ) return true;
    return false;
}