import { world, } from "@minecraft/server";
import { traverseTree, dialoguePackage, dialogueOptions, dialogueText, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, } from "./lang_translations";

function lang_dialog_package (
    text: string | string[],
): dialoguePackage {
    let dialogue: dialogueText | dialogueOptions;
    if (typeof text === "string")
        dialogue = {type: "text", payload: text}
    else
        dialogue = {type: "options", payload: text}
    return {
        dialogue: dialogue,
        characterName: "§o§lSystem",
        characterImagePath: "textures/ui/faces/system/others/console",
        soundName: "click_on.metal_pressure_plate",
    };
}

world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:interact_hitbox") {
        if (data.target.nameTag === "lang_hitbox") {
            const player = data.player

            traverseTree(
                player,
                {
                    dialogueList: [
                        lang_dialog_package(
                            payloadTranslations[0][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[1][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[2][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[3][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[4][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[5][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[6][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[7][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[8][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[9][lang(player)]
                        ),
                        lang_dialog_package(
                            payloadTranslations[10][lang(player)]
                        ),
                        
                    ],
                    next: [[1], [2], [3, 4], [5, 6], [7, 8], [9], [9], [9], [9], [10], [-1]],
                },
                0,
            );

        }
    }
});