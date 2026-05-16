import { InputPermissionCategory, ItemStopUseOnAfterEvent, Player, system, } from "@minecraft/server";
import { ActionFormData, } from "@minecraft/server-ui";
import { splitText, } from "../../helpers/dialog/dialog_helper";

export { traverseTree, dialogueTree, dialoguePackage, dialogueText, dialogueOptions, };

type dialogueText = {
    type: "text",
    payload: string,
};

type dialogueOptions = {
    type: "options",
    payload: string[],
}

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
    dialogue: dialogueText | dialogueOptions,
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

let stopSound = false;
/**
 * Handles showing dialogues, playing SFX and enabling/disabling movement.
 * @param player player to show the dialogue to.
 * @param dialoguePackage dialogue package to show. Of type dialoguePackage
 * @param playAnimation if to play the open animation or not. Of type boolean.
 * Defaults to false.
 */
function showDialogue(
    player: Player,
    dialoguePackage: dialoguePackage,
    playAnimation: boolean = false,
): Promise<number> {
    const {dialogue, characterName, characterImagePath, soundName} = dialoguePackage;

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
        if (dialogue.type === "text") return 0;
        if (!response.selection) return 2;
        player.playSound("block.click");
        return response.selection - 1;
    })
}

/**
 * Adds a dialogue tree to be rendered when available.
 * @param player player ID to add the tree to.
 * @param dialogueTree dialogue tree to be proccessed. Of type dialogueTree.
 * -1 on next means it's the last dialogue, therefore it stops the chain.
 * @param index index of the dialogue in the dialogue list. Of type number.
 */
async function traverseTree(
    player: Player,
    dialogueTree: dialogueTree,
    index: number,
    firstTimeShown: boolean = true,
) {
    if (index === 0) setMovement(player, false);

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
    } else {
        traverseTree(player, dialogueTree, index, false);
    }
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

function setMovement(player: Player, enable: boolean) {
    player.inputPermissions.setPermissionCategory(
        InputPermissionCategory.Movement,
        enable,
    );
    player.inputPermissions.setPermissionCategory(
        InputPermissionCategory.Camera,
        enable,
    );
}