import { InputPermissionCategory, system, } from "@minecraft/server";
import { ActionFormData, } from "@minecraft/server-ui";
import { splitText, } from "../../helpers/dialog/dialog_helper";
export { traverseTree, };
/**
 * Handles showing dialogues, playing SFX and enabling/disabling movement.
 * @param player player to show the dialogue to.
 * @param dialoguePackage dialogue package to show. Of type dialoguePackage
 * @param playAnimation if to play the open animation or not. Of type boolean.
 * Defaults to false.
 */
function showDialogue(player, dialoguePackage, playAnimation = false) {
    setMovement(player, false);
    const { payload, characterName, characterImagePath, soundName, } = dialoguePackage;
    if (typeof payload === "string" || (typeof payload !== "string" && playAnimation)) {
        let soundPlayingIndex = 0;
        const dialogueSound = system.runInterval(() => {
            if (soundPlayingIndex < 3) {
                player.playSound(soundName);
                soundPlayingIndex++;
            }
            else {
                system.clearRun(dialogueSound);
            }
        }, 3);
    }
    const dialogueForm = new ActionFormData;
    dialogueForm.button(characterName, characterImagePath);
    if (playAnimation) {
        dialogueForm.title("true"); // Send playanimation commands (through .title,
        // as it is not necessary for anything else)
    }
    if (typeof payload === "string") {
        dialogueForm.body(splitText(payload, 40, 3));
        dialogueForm.button(""); // Empty buttons (otherwise it bugs)
        dialogueForm.button("");
    }
    else {
        dialogueForm.button(payload[0]); // Button 1
        dialogueForm.button(payload[1]); // Button 2
    }
    return dialogueForm.show(player);
}
var Response;
(function (Response) {
    Response[Response["FIRST"] = 0] = "FIRST";
    Response[Response["SECOND"] = 1] = "SECOND";
    Response[Response["CANCEL"] = 2] = "CANCEL";
})(Response || (Response = {}));
;
let buttonFirst = true;
/**
 * Adds a dialogue tree to be rendered when available.
 * @param player player ID to add the tree to.
 * @param dialogueTree dialogue tree to be proccessed. Of type dialogueTree.
 * -1 on next means it's the last dialogue, therefore it stops the chain.
 * @param index index of the dialogue in the dialogue list. Of type number.
 */
async function traverseTree(player, dialogueTree, index) {
    let playAnimation = false;
    if (typeof dialogueTree.dialogueList[index].payload === "string") {
        if (index === 0) {
            playAnimation = true;
        }
    }
    else {
        if (buttonFirst) {
            playAnimation = true;
        }
    }
    const responsePromise = (await showDialogue(player, dialogueTree.dialogueList[index], playAnimation));
    let response = Response.CANCEL;
    if (responsePromise.selection) {
        player.playSound("block.click");
        response = responsePromise.selection - 1; // Buttons are not zero-based,
        // arrays are, therefore, -1.
    }
    else {
        if (dialogueTree.next[index].length === 1) { // If only text
            response = Response.FIRST;
        }
    }
    if (dialogueTree.next[index][response] !== -1) { // Dialogue -1 means there're no dialogues left.
        if (response !== Response.CANCEL || (response === Response.CANCEL && dialogueTree.next[index].length === 3
        // If there's an exit message.
        )) {
            buttonFirst = true;
            traverseTree(player, dialogueTree, dialogueTree.next[index][response]);
        }
        else {
            buttonFirst = false;
            traverseTree(player, dialogueTree, index);
        }
    }
    else {
        setMovement(player, true);
    }
}
function setMovement(player, enable) {
    player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, enable);
    player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, enable);
}
