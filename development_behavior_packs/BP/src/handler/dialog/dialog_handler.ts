import { InputPermissionCategory, Player, system, } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, } from "@minecraft/server-ui";
import { splitText, } from "../../helpers/dialog/dialog_helper";

export { traverseTree, dialogueTree, dialoguePackage, };

/**
 * Package to send a dialog with.
 * @param payload text or options to show in the dialog box.
 * Of type string (for text) or two element string array (for options).
 * @param characterName the name of the character to show in the dialog box. 
 * Of type string.
 * @param characterImagePath texture file path for the character's image to show
 * in the dialog box. Of type string.
 * @param soundName sound name reference to play when showing the dialogue. Of type string.
 */
type dialoguePackage = {
    payload: string | string[],
    characterName: string,
    characterImagePath: string,
    soundName: string,
}

/**
 * Dialogue tree to be proccessed.
 * @param dialogList the full list of dialogues to show (in tree order).
 * Of type dialoguePackage.
 * @param next the list of (possible) continuations from each dialogue. Of type array
 * of arrays of numbers. The numbers array can either:
 * - Have no numbers (end the sequence).
 * - Have one number (shows the nth dialogue).
 * - Have two numbers (show the nth or yth dialogue ased on response; if exited,
 * it reopens the dialogue).
 * - Have three numbers (show the nth or yth dialogue based on response, and show
 * the zth dialogue if exited).
 */
type dialogueTree = {
    dialogueList: dialoguePackage[],
    next: number[][],
}

/**
 * Handles showing dialogues, playing SFX and enabling/disabling movement.
 * @param player player to show the dialogue to.
 * @param dialoguePackage dialogue package to show. Of type dialoguePackage
 * @param playAnimation if to play the open animation or not. Of type boolean.
 * Defaults to false.
 */
function showDialogue (
    player: Player,
    dialoguePackage: dialoguePackage,
    playAnimation: boolean = false,
): Promise<ActionFormResponse> {
    setMovement(player, false);

    const {
        payload,
        characterName,
        characterImagePath,
        soundName,
    } = dialoguePackage;

    if (typeof payload === "string" || (typeof payload !== "string" && playAnimation)) {
        let soundPlayingIndex = 0;
        const dialogueSound = system.runInterval(() => {
            if (soundPlayingIndex < 3) {
                player.playSound(soundName);
                soundPlayingIndex++;
            } else {
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

enum Response {
    FIRST = 0,
    SECOND = 1,
    CANCEL = 2,
};

let buttonFirst = true;
/**
 * Adds a dialogue tree to be rendered when available.
 * @param player player ID to add the tree to.
 * @param dialogueTree dialogue tree to be proccessed. Of type dialogueTree.
 * -1 on next means it's the last dialogue, therefore it stops the chain.
 * @param index index of the dialogue in the dialogue list. Of type number.
 */
async function traverseTree (
    player: Player,
    dialogueTree: dialogueTree,
    index: number,
 ) {

    let playAnimation = false;
    if (typeof dialogueTree.dialogueList[index].payload === "string") {
        if (index === 0) {
            playAnimation = true;
        }
    } else {
        if (buttonFirst) {
            playAnimation = true;
        }
    }

    const responsePromise = (await showDialogue(player, dialogueTree.dialogueList[index], playAnimation));
        let response = Response.CANCEL;
        if (responsePromise.selection) {
            player.playSound("block.click");
            response = responsePromise.selection-1; // Buttons are not zero-based,
                                                    // arrays are, therefore, -1.
        } else {
            if (dialogueTree.next[index].length === 1) { // If only text
                response = Response.FIRST;
            }
        }

        if (dialogueTree.next[index][response] !== -1) { // Dialogue -1 means there're no dialogues left.
            if (response !== Response.CANCEL || (
                response === Response.CANCEL && dialogueTree.next[index].length === 3
                // If there's an exit message.
            )) {
                buttonFirst = true;
                traverseTree(player, dialogueTree, dialogueTree.next[index][response]);
            } else {
                buttonFirst = false;
                traverseTree(player, dialogueTree, index);
            }
        } else {
            setMovement(player, true);
        }
}

function setMovement(player: Player, enable: boolean) {
    player.inputPermissions.setPermissionCategory(
        InputPermissionCategory.Movement,
        enable
    );
    player.inputPermissions.setPermissionCategory(
        InputPermissionCategory.Camera,
        enable
    );
}