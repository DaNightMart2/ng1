import { system, Player, } from "@minecraft/server";
import { ActionFormData, } from "@minecraft/server-ui";
import { tagDetection, splitText, playersOnDialogueExt, } from "../../helpers/dialog/dialog_helper";
import { dialoguePackage, } from "../../handler/dialog/dialog_handler";

export { showDialogue, };

let stopSound = false;
/**
 * Handles showing dialogues, playing SFX and enabling/disabling movement.
 * @param player player to show the dialogue to.
 * @param dialoguePackage dialogue package to show. Of type dialoguePackage.
 * @param tags tags to add to the player or remove from them. Of type array of arrays of strings. Optional parameter. If the value start with a -, it will be removed, if it start with a +, it will be added, if it start with none, it default to a +.
 * @param playAnimation if to play the open animation or not. Of type boolean.
 * Defaults to false.
 */
function showDialogue(
    player: Player,
    dialoguePackage: dialoguePackage,
    playAnimation: boolean,
    tags?: string[][],
): Promise<number> {
    playersOnDialogueExt(true);

    const { dialogue, characterName, characterImagePath, soundName } = dialoguePackage;

    if (dialogue.type === "text" || playAnimation) {
        stopSound = false;
        playSound(player, soundName);
    }

    const dialogueForm = new ActionFormData;
    dialogueForm.button(characterName, characterImagePath);

    if (playAnimation) {
        dialogueForm.title("true"); // Send playanimation commands (through .title,
        // as it is not necessary for anything else)
    }

    if (dialogue.type === "text") {
        dialogueForm.body(splitText(dialogue.payload, 40, 3));
        dialogueForm.button(""); // Empty buttons (otherwise it bugs)
        dialogueForm.button("");
        dialogueForm.button("");
        dialogueForm.button("");
    }

    else {
        const buttons = dialogue.payload;
        for (let i = 0; i < 4; i++) {
            if (i < buttons.length) {
                dialogueForm.button(buttons[i]);
            } else {
                dialogueForm.button(""); // Empty buttons (otherwise it bugs)
            }
        }
    }

    let responsePromise = dialogueForm.show(player);
    return responsePromise.then((response) => {
        stopSound = true;
        if (tags) {
            if (dialogue.type === "text") {
                for (const tag of tags[0]) {
                    tagDetection(player, tag);
                }
            } else {
                if (response.selection) {
                    for (const tag of tags[response.selection - 1]) {
                        tagDetection(player, tag);
                    }
                }
            }
        }
        if (dialogue.type === "text") return 0;
        if (response.selection) {
            player.playSound("block.click");
            return response.selection - 1;
        } else {
            return dialogue.payload.length;
        }
    })
}

function playSound(player: Player, soundName: string) {
    let soundPlayingIndex = 0;
    const dialogueSound = system.runInterval(() => {
        if (stopSound) system.clearRun(dialogueSound);
        if (soundPlayingIndex < 3) {
            player.playSound(soundName);
            soundPlayingIndex++;
        } else {
            system.clearRun(dialogueSound);
        }
    }, 3);
}