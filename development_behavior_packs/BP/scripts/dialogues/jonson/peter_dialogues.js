import { world, } from "@minecraft/server";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, } from "./peter_translations";
/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param textIdentifier text to show or number to get the text translation to show. Of type string or number.
 */
function peter_dialog_package(player, textIdentifier, expression) {
    let dialogue;
    let text;
    if (typeof textIdentifier === "number") {
        text = payloadTranslations[textIdentifier][lang(player)];
    }
    else {
        text = textIdentifier;
    }
    if (typeof text === "string")
        dialogue = { type: "text", payload: text };
    else
        dialogue = { type: "options", payload: text };
    return {
        dialogue: dialogue,
        characterName: "Peter Jonson",
        characterImagePath: "textures/ui/faces/jonson/" + expression,
        soundName: "mob.villager.talk",
    };
}
var Expression;
(function (Expression) {
    Expression["ANGRY"] = "angry";
    Expression["BLUFFING"] = "bluffing";
    Expression["EXCITEDLY_WONDERING"] = "excitedly_wondering";
    Expression["HAPPILY_EVIL"] = "happily_evil";
    Expression["NEUTRAL"] = "neutral";
    Expression["REALLY_ANGRY"] = "really_angry";
})(Expression || (Expression = {}));
world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:interact_hitbox") {
        if (data.target.nameTag === "peter_hitbox") {
            const player = data.player;
        }
    }
});
