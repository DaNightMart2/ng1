import { Player, world, } from "@minecraft/server";
import { queueDialogue, dialoguePackage, dialogueOptions, dialogueText, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, nameTranslations, } from "./saul_translations";

/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param textIdentifier text to show or number to get the text translation to show. Of type string or number.
 */
function saul_dialog_package (
    player: Player,
    textIdentifier: number | string,
    expression: string,
): dialoguePackage {
    let dialogue: dialogueText | dialogueOptions;

    let text: string | string[];
    if (typeof textIdentifier === "number") {
        text = payloadTranslations[textIdentifier][lang(player)];
    } else {
        text = textIdentifier;
    }

    if (typeof text === "string")
        dialogue = {type: "text", payload: text}
    else
        dialogue = {type: "options", payload: text}

    return {
        dialogue: dialogue,
        characterName: nameTranslations.saul[lang(player)],
        characterImagePath: "textures/ui/faces/saul/" + expression ,
        soundName: "mob.pig.say",
    };
}

enum Expression {
    DISSAPOINTED = "dissapointed",
    EMBARASSED = "embarassed",
    EXCITED_QUESTIONING = "excited-questioning",
    EXCITED = "excited",
    EXTREMELY_SCARED_QUESTIONING = "extremely_scared-questioning",
    EXTREMELY_SCARED = "extremely_scared",
    INHALING = "inhaling",
    NEUTRAL = "neutral",
    PLEASED = "pleased",
    SET = "set",
}

world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:interact_hitbox") {
        if (data.target.nameTag === "saul_hitbox") {
            const player = data.player
        }
    }
});