import { world, Player, } from "@minecraft/server";
import { dialoguePackage, dialogueText, dialogueOptions, } from "../handler/dialog/dialog_handler";
import { lang, } from "../helpers/dialog/dialog_helper";

const payloadTranslations = {
    "name": {
        "en": "",
        "es": "",
    },
}

/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. Of type key of type of payload translations.
 */
function peter_dialog_package(
    player: Player,
    translationIdentifier: keyof typeof payloadTranslations,
    expression: string,
): dialoguePackage {
    let dialogue: dialogueText | dialogueOptions;

    const text = payloadTranslations[translationIdentifier][lang(player)];

    if (typeof text === "string")
        dialogue = { type: "text", payload: text, }
    else
        dialogue = { type: "options", payload: text, }
    return {
        dialogue: dialogue,
        characterName: "Peter Jonson",
        characterImagePath: "textures/ui/faces/jonson/" + expression,
        soundName: "mob.villager.talk",
    };
}

enum Expression {
    ANGRY = "angry",
    BLUFFING = "bluffing",
    EXCITEDLY_WONDERING = "excitedly_wondering",
    HAPPILY_EVIL = "happily_evil",
    NEUTRAL = "neutral",
    REALLY_ANGRY = "really_angry",
}

world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:interact_hitbox") {
        if (data.target.nameTag === "peter_hitbox") {
            const player = data.player
        }
    }
});