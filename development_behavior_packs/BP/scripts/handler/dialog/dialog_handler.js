import { InputPermissionCategory, system, } from "@minecraft/server";
import { ActionFormData, } from "@minecraft/server-ui";
import { splitText, } from "../../helpers/dialog/dialog_helper";
export { traverseTree, };
let stopSound = false;
/**
 * Handles showing dialogues, playing SFX and enabling/disabling movement.
 * @param player player to show the dialogue to.
 * @param dialoguePackage dialogue package to show. Of type dialoguePackage.
 * @param tags tags to add to the player or remove from them. Of type array of arrays of strings. Optional parameter. If the value start with a -, it will be removed, if it start with a +, it will be added, if it start with none, it default to a +.
 * @param playAnimation if to play the open animation or not. Of type boolean.
 * Defaults to false.
 */
function showDialogue(player, dialoguePackage, playAnimation, tags) {
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
            }
            else {
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
            }
            else {
                if (response.selection) {
                    for (const tag of tags[response.selection - 1]) {
                        tagDetection(player, tag);
                    }
                }
            }
        }
        if (dialogue.type === "text")
            return 0;
        if (response.selection) {
            player.playSound("block.click");
            return response.selection - 1;
        }
        else {
            return dialogue.payload.length;
        }
    });
}
let test = 0;
/**
 * Adds a dialogue tree to be rendered when available.
 * @param player player to add the tree to.
 * @param dialogueTree dialogue tree to be proccessed. Of type dialogueTree.
 * -1 on next means it's the last dialogue, therefore it stops the chain.
 * @param index index of the dialogue in the dialogue list. Of type number.
 */
async function traverseTree(player, dialogueTree, index, firstTimeShown = true) {
    // console.log(test);
    test = 1;
    if (!player.isValid)
        return; // Return if player left the game
    if (index === 0)
        setMovement(player, false);
    const dialogueNode = dialogueTree[index];
    let playAnimation = (dialogueNode.dialoguePackage.dialogue.type === "text" && index === 0) ||
        (dialogueNode.dialoguePackage.dialogue.type === "options" && firstTimeShown);
    const selection = await showDialogue(player, dialogueNode.dialoguePackage, playAnimation, dialogueNode.tags);
    if (dialogueNode.next[selection] === "") { // Empty dialogue means there're no dialogues left.
        setMovement(player, true);
        test = 0;
        return;
    }
    if (selection < dialogueNode.next.length) {
        for (let i = 0; i < dialogueTree.length; i++) {
            if (dialogueTree[i].name === dialogueNode.next[selection]) {
                traverseTree(player, dialogueTree, i);
            }
        }
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
function tagDetection(player, tag) {
    if (tag[0] === "-") {
        player.removeTag(tag.substring(1, tag.length));
    }
    else {
        if (tag[0] === "+") {
            player.addTag(tag.substring(1, tag.length));
        }
        else {
            player.addTag(tag);
        }
    }
}
