import { lang, } from "../../../helpers/dialog/dialog_helper";
import { payloadTranslations } from "./prologue_translations";
/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. If started with ';', it will show the string itself. Of type key of type of payload translations or string.
 */
function prologue_dialog_package(player, translationIdentifier) {
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
        characterName: "",
        characterImagePath: "",
        soundName: "click_on.metal_pressure_plate",
    };
}
