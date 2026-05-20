import { system, world, } from "@minecraft/server";
import { traverseTree, } from "../../../handler/dialog/dialog_handler";
import { lang, } from "../../../helpers/dialog/dialog_helper";
import { payloadTranslations, nameTranslations, } from "./lang_translations";
import { positionInAreCheck, } from "../../../helpers/global/global_functions";
/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. If started with ';', it will show the string itself. Of type key of type of payload translations or string.
 */
function lang_dialog_package(player, translationIdentifier) {
    let dialogue;
    let text;
    if (translationIdentifier.charAt(0) === ";") {
        text = translationIdentifier;
    }
    else {
        text = payloadTranslations[translationIdentifier][lang(player)];
    }
    if (typeof text === "string")
        dialogue = { type: "text", payload: text, };
    else
        dialogue = { type: "options", payload: text, };
    return {
        dialogue: dialogue,
        characterName: nameTranslations.system[lang(player)],
        characterImagePath: "textures/ui/faces/system/others/console",
        soundName: "click_on.metal_pressure_plate",
    };
}
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (positionInAreCheck(player.location, { x: -19, y: 46, z: 6 }, { x: -7, y: 49, z: 18 }) &&
            showLangMenu(player, true)) {
            player.addTag("choosing_lang");
            traverseTree(player, [
                {
                    name: "eng__spa",
                    dialoguePackage: lang_dialog_package(player, "eng__spa"),
                    next: ["", "ar__mx"],
                    tags: [["en", "-choosing_lang"], ["-en"]],
                },
                {
                    name: "ar__mx",
                    dialoguePackage: lang_dialog_package(player, "ar__mx"),
                    next: ["", "", "eng__spa"],
                    tags: [["es_ar", "-choosing_lang"], ["es_mx", "-choosing_lang"]],
                }
            ], 0);
        }
    }
});
world.afterEvents.playerSpawn.subscribe(data => {
    if (data.initialSpawn) {
        data.player.removeTag("choosing_lang");
    }
});
function showLangMenu(player, includeChoosing) {
    if ((!player.hasTag("es_ar") &&
        !player.hasTag("en") &&
        !player.hasTag("es_mx")) &&
        !player.hasTag("choosing_lang") || !includeChoosing)
        return true;
    return false;
}
