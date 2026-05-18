import { ButtonState, InputButton, system, world, } from "@minecraft/server";
import { traverseTree, } from "../../handler/dialog/dialog_handler";
import { lang, } from "../../helpers/dialog/dialog_helper";
import { payloadTranslations, } from "./config_translations";
/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param textIdentifier text to show or number to get the text translation to show. Of type string or number.
 */
function config_dialog_package(player, textIdentifier) {
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
        characterName: "§o§lConfig.",
        characterImagePath: "textures/ui/faces/system/others/console",
        soundName: "click_on.metal_pressure_plate",
    };
}
const restartCounterCooldown = 20;
let jumpCounter = {};
world.afterEvents.playerButtonInput.subscribe(data => {
    if (data.button === InputButton.Jump) {
        if (data.newButtonState === ButtonState.Released) {
            const player = data.player;
            if (!Object.keys(jumpCounter).includes(player.id)) {
                jumpCounter[player.id] = {
                    counter: 0,
                    restartCounterCooldown: restartCounterCooldown,
                };
            }
            jumpCounter[player.id].counter += 1;
            jumpCounter[player.id].restartCounterCooldown = restartCounterCooldown;
            if (jumpCounter[player.id].counter >= 5) {
                jumpCounter[player.id].counter = 0;
                traverseTree(player, [
                    {
                        name: "1",
                        dialoguePackage: config_dialog_package(player, 0),
                        next: ["a__b__c__d"],
                    },
                ], 0);
            }
        }
    }
});
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (Object.keys(jumpCounter).includes(player.id)) {
            if (jumpCounter[player.id].restartCounterCooldown <= 0) {
                jumpCounter[player.id].counter = 0;
                jumpCounter[player.id].restartCounterCooldown = restartCounterCooldown;
            }
            jumpCounter[player.id].restartCounterCooldown -= 1;
        }
    }
}, 1);
