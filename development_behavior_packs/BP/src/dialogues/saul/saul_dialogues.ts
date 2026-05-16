import { world, } from "@minecraft/server";
import { traverseTree, dialoguePackage, dialogueOptions, dialogueText, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, } from "./saul_translations";

function saul_dialog_package (
    text: string | string[],
    expresion: string,
): dialoguePackage {
    let dialogue: dialogueText | dialogueOptions;
    if (typeof text === "string")
        dialogue = {type: "text", payload: text}
    else
        dialogue = {type: "options", payload: text}

    return {
        dialogue: dialogue,
        characterName: "Rey Saúl",
        characterImagePath: "textures/ui/faces/saul/" + expresion ,
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

            traverseTree(
                player,
                {
                    dialogueList: [
                        saul_dialog_package(
                            payloadTranslations[0][lang(player)],
                            Expression.EXTREMELY_SCARED,
                        ),
                    ],
                    next: [[-1]],
                },
                0,
            );

        }
    }
});