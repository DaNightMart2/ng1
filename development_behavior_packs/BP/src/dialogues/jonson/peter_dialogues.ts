import { world, } from "@minecraft/server";
import { traverseTree, dialoguePackage, dialogueText, dialogueOptions, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, } from "./peter_translations";

function peter_dialog_package (
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
        characterName: "Peter Jonson",
        characterImagePath: "textures/ui/faces/jonson/" + expresion ,
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

            traverseTree(
                player,
                {
                    dialogueList: [
                        peter_dialog_package(
                            payloadTranslations[0][lang(player)],
                            Expression.NEUTRAL
                        ),
                    ],
                    next: [[-1]],
                },
                0,
            );

        }
    }
});