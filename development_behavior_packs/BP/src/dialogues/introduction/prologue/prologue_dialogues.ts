import { Player, system, world, } from "@minecraft/server";
import { dialoguePackage, dialogueText, dialogueOptions, queueDialogue, } from "../../../handler/dialog/dialog_handler";
import { lang, } from "../../../helpers/dialog/dialog_helper";
import { payloadTranslations, } from "./prologue_translations";
import { positionInAreCheck, } from "../../../helpers/global/global_functions";

/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. If started with ';', it will show the string itself. Of type key of type of payload translations or string.
 */
function prologue_dialog_package(
    player: Player,
    translationIdentifier: keyof typeof payloadTranslations,
): dialoguePackage {
    let dialogue: dialogueText | dialogueOptions;

    let text = payloadTranslations[translationIdentifier][lang(player)];
    text = text.replaceAll("[PLAYERNAME]", player.name);

    if (typeof text === "string")
        dialogue = { type: "text", payload: text }
    else
        dialogue = { type: "options", payload: text }
    return {
        dialogue: dialogue,
        characterName: "",
        characterImagePath: "",
        soundName: "block.click",
    };
}

let i = 0;
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (positionInAreCheck(player.location, {x: -19, y: 3, z: 8}, {x: -7, y: 8, z: 18})) {
            if (!player.hasTag("dialog-prologue_end")) {
                player.teleport({x: player.location.x, y: 8, z: player.location.z});
                player.camera.fade({"fadeColor": {"red": 0, "green": 0, "blue": 0}, "fadeTime": {"fadeInTime": 1, "fadeOutTime": 1, "holdTime": 1}});
                console.log(i)
                i++
            }
            if (!player.hasTag("dialog-prologue_start")) {
                player.addTag("dialog-prologue_start");

                queueDialogue(
                    player,
                    [
                        {
                            name: "blancuivre_tragedy",
                            dialoguePackage: prologue_dialog_package(
                                player,
                                "1_blancuivre_tragedy",
                            ),
                            next: ["enemy_city"],
                        },
                        {
                            name: "enemy_city",
                            dialoguePackage: prologue_dialog_package(
                                player,
                                "2_enemy_city",
                            ),
                            next: ["noirefer"],
                        },
                        {
                            name: "noirefer",
                            dialoguePackage: prologue_dialog_package(
                                player,
                                "3_noirefer",
                            ),
                            next: ["limbo"],
                        },
                        {
                            name: "limbo",
                            dialoguePackage: prologue_dialog_package(
                                player,
                                "4_limbo",
                            ),
                            next: ["new_home"],
                        },
                        {
                            name: "new_home",
                            dialoguePackage: prologue_dialog_package(
                                player,
                                "5_new_home",
                            ),
                            next: ["you"],
                        },
                        {
                            name: "you",
                            dialoguePackage: prologue_dialog_package(
                                player,
                                "6_you",
                            ),
                            next: ["long_day"],
                        },
                        {
                            name: "long_day",
                            dialoguePackage: prologue_dialog_package(
                                player,
                                "7_long_day",
                            ),
                            next: [""],
                            tags: [["dialog-prologue_end"]],
                        },
                    ],
                );
            }
        }
    }
});