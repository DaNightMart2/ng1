import { system, world, } from "@minecraft/server";
import { traverseTree, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, nameTranslations } from "./lang_translations";
import { positionInAreCheck, } from "../../helpers/global/global_functions";
/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. Of type key of type of payload translations.
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
        dialogue = { type: "text", payload: text };
    else
        dialogue = { type: "options", payload: text };
    return {
        dialogue: dialogue,
        characterName: nameTranslations.system[lang(player)],
        characterImagePath: "textures/ui/faces/system/others/console",
        soundName: "click_on.metal_pressure_plate",
    };
}
let languageChoosingPlayers = [];
const languageChoosing = system.runInterval(() => {
    if (world.getAllPlayers().length > 1) {
        if (world.getAllPlayers().length === languageChoosingPlayers.length) {
            system.clearRun(languageChoosing);
        }
    }
    for (const player of world.getAllPlayers()) {
        if (!languageChosen(player)) {
            if (player.isInWater) {
                if (positionInAreCheck(player.location, { x: -20, y: 3, z: 6 }, { x: -7, y: 4, z: 18 })) {
                    player.teleport({ x: -14.5, y: 40, z: 12.5 }, { "rotation": { x: 90, y: 0 } });
                }
                if (languageChoosingPlayers.includes(player))
                    return;
                languageChoosingPlayers.push(player);
                traverseTree(player, [
                    {
                        name: "nextDialogTutorial",
                        dialoguePackage: lang_dialog_package(player, "nextDialogTutorial"),
                        next: ["eng__spa"],
                    },
                    {
                        name: "eng__spa",
                        dialoguePackage: lang_dialog_package(player, "eng__spa"),
                        next: ["", "ar__mx"],
                        tags: [["en"], []],
                    },
                    {
                        name: "ar__mx",
                        dialoguePackage: lang_dialog_package(player, "ar__mx"),
                        next: ["", ""],
                        tags: [["es_ar"], ["es_mx"]],
                    }
                ], 0);
            }
        }
        else
            languageChoosingPlayers.push(player);
    }
});
function languageChosen(player) {
    if (!player.hasTag("es_ar") && !player.hasTag("en") && !player.hasTag("es_mx"))
        return false;
    return true;
}
