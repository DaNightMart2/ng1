import { InputPermissionCategory, system, } from "@minecraft/server";
import { ActionFormData, } from "@minecraft/server-ui";
import { splitText, } from "../../helpers/dialog/dialog_helper";
export { traverseTree, };
let stopSound = false;
/**
 * Handles showing dialogues, playing SFX and enabling/disabling movement.
 * @param player player to show the dialogue to.
 * @param dialoguePackage dialogue package to show. Of type dialoguePackage
 * @param playAnimation if to play the open animation or not. Of type boolean.
 * Defaults to false.
 */
function showDialogue(player, dialoguePackage, playAnimation = false) {
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
    }
    else {
        dialogueForm.button(dialogue.payload[0]); // Button 1
        dialogueForm.button(dialogue.payload[1]); // Button 2
    }
    let responsePromise = dialogueForm.show(player);
    return responsePromise.then((response) => {
        stopSound = true;
        if (dialogue.type === "text")
            return 0;
        if (!response.selection)
            return 2;
        player.playSound("block.click");
        return response.selection - 1;
    });
}
/**
 * Adds a dialogue tree to be rendered when available.
 * @param player player ID to add the tree to.
 * @param dialogueTree dialogue tree to be proccessed. Of type dialogueTree.
 * -1 on next means it's the last dialogue, therefore it stops the chain.
 * @param index index of the dialogue in the dialogue list. Of type number.
 */
async function traverseTree(player, dialogueTree, index, firstTimeShown = true) {
    if (index === 0)
        setMovement(player, false);
    const dialoguePackage = dialogueTree.dialogueList[index];
    let playAnimation = (dialoguePackage.dialogue.type === "text" && index === 0) ||
        (dialoguePackage.dialogue.type === "options" && firstTimeShown);
    const selection = await showDialogue(player, dialoguePackage, playAnimation);
    if (dialogueTree.next[index][selection] === -1) { // Dialogue -1 means there're no dialogues left.
        setMovement(player, true);
        return;
    }
    if (selection < dialogueTree.next[index].length) {
        traverseTree(player, dialogueTree, dialogueTree.next[index][selection]);
    }
    else {
        traverseTree(player, dialogueTree, index, false);
    }
}
function playSound(player, soundName) {
    let soundPlayingIndex = 0;
    const dialogueSound = system.runInterval(() => {
        if (stopSound)
            system.clearRun(dialogueSound);
        if (soundPlayingIndex < 3) {
            player.playSound(soundName);
            soundPlayingIndex++;
        }
        else {
            system.clearRun(dialogueSound);
        }
    }, 3);
}
function setMovement(player, enable) {
    player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, enable);
    player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, enable);
}
