import { world, } from "@minecraft/server";
import { traverseTree, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, } from "./saul_translations";
function saul_dialog_package(text, expresion) {
    let dialogue;
    if (typeof text === "string")
        dialogue = { type: "text", payload: text };
    else
        dialogue = { type: "options", payload: text };
    return {
        dialogue: dialogue,
        characterName: "Rey Saúl",
        characterImagePath: "textures/ui/faces/saul/" + expresion,
        soundName: "mob.pig.say",
    };
}
var Expression;
(function (Expression) {
    Expression["DISSAPOINTED"] = "dissapointed";
    Expression["EMBARASSED"] = "embarassed";
    Expression["EXCITED_QUESTIONING"] = "excited-questioning";
    Expression["EXCITED"] = "excited";
    Expression["EXTREMELY_SCARED_QUESTIONING"] = "extremely_scared-questioning";
    Expression["EXTREMELY_SCARED"] = "extremely_scared";
    Expression["INHALING"] = "inhaling";
    Expression["NEUTRAL"] = "neutral";
    Expression["PLEASED"] = "pleased";
    Expression["SET"] = "set";
})(Expression || (Expression = {}));
world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:interact_hitbox") {
        if (data.target.nameTag === "saul_hitbox") {
            const player = data.player;
            traverseTree(player, {
                dialogueList: [
                    saul_dialog_package(payloadTranslations[0][lang(player)], Expression.EXTREMELY_SCARED),
                ],
                next: [[-1]],
            }, 0);
        }
    }
});
