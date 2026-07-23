import { InputPermissionCategory, Player, system, world, } from "@minecraft/server";
import { dialoguePackage, dialogueText, dialogueOptions, queueDialogue, } from "../handler/dialog/dialog_handler";
import { lang, } from "../helpers/dialog/dialog_helper";
import { positionInAreaCheck, } from "../helpers/global/global_functions";

const payloadTranslations = {
    "1_blancuivre_tragedy": {
        "en": "* After all the tragedies that occurred in the Blancuivre Empire, many decided to flee to different parts of the world.",
        "es": "* Después de todas las tragedias ocurridas en el Imperio Blancuivre, muchos huyeron a diferentes partes del mundo.",
    },
    "2_enemy_city": {
        "en": "* Amongst all the people that fled, a group of humans travelled to the enemy empire of Blancuivre:",
        "es": "* Entre las personas que huyeron, un grupo de humanos viajó al imperio enemigo a Blancuivre:",
    },
    "3_noirefer": {
        "en": "* Noirefer.",
        "es": "* Noirefer.",
    },
    "4_limbo": {
        "en": "* This group arrived at Limbo, a middle point between all Noirefer locations.",
        "es": "* Este grupo llegó a Limbo, un punto medio entre todas las ubicaciones de Noirefer.",
    },
    "5_new_home": {
        "en": "* Not knowing where to go next, they took this place as their new home.",
        "es": "* Sin saber a dónde ir, tomaron este lugar como su nuevo hogar.",
    },
    "6_you": {
        "en": "* Amongst these humans is you, [PLAYERNAME].",
        "es": "* Entre estos humanos, estás tú, [PLAYERNAME].",
    },
    "7_long_day": {
        "en": "* I hope you are ready for a long, long day...",
        "es": "* Espero que estés listo para un largo, largo día...",
    },
}

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

/**
 * Calls prologue dialog to players who have not seen it and are on the prologue area.
 */
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (positionInAreaCheck(player.location, {x: -19, y: 4.1, z: 8}, {x: -7, y: 4.1, z: 18})) {
            if (!player.hasTag("dialog-prologue_end")) {
                player.teleport({x: player.location.x, y: 4.1, z: player.location.z});
                player.camera.fade({"fadeColor": {"red": 1, "green": 1, "blue": 1}, "fadeTime": {"fadeInTime": 1, "fadeOutTime": 1, "holdTime": 1}});
            } else {
                system.runTimeout(() => {
                    player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, true);
                }, 60);
            }
            if (!player.hasTag("dialog-prologue_start")) {
                player.addTag("dialog-prologue_start");
                player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, false);

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
