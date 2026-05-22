import { Player, } from "@minecraft/server";
import { playersOnDialogueExt, } from "../../helpers/dialog/dialog_helper";
import { setMovement, } from "../../helpers/global/global_functions";
import { showDialogue, } from "../../helpers/dialog/showDialogue";

export { queueDialogue, dialoguePackage, dialogueText, dialogueOptions, };

let dialogQueue: Record<string, dialogueTree[]> = {}
/**
 * Adds a dialogue tree to the queue of dialogues.
 * @param player player to add the tree to. Of type player.
 * @param dialogueTrue tree to add to the queue. Of type dialogueTree.
 */
function queueDialogue(player: Player, dialogueTree: dialogueTree) {
    if (!Object.keys(dialogQueue).includes(player.id)) dialogQueue[player.id] = [];

    dialogQueue[player.id].push(dialogueTree);
    if (dialogQueue[player.id].length === 1) {
        traverseTree(player, 0);
    }
}

type dialogueText = {
    type: "text",
    payload: string,
};

type dialogueOptions = {
    type: "options",
    payload: string[],
}

/**
 * Single dialogue node from the dialogue tree.
 * @param name the name of the node, which represents the dialogue. Of type string.
 * @param dialoguePackage the dialogue package it shows. Of type dialoguePackage.
 * @param next the list of possible continuations from each dialogue. Of type array of strings. The array can either:
 * - Have no items (end the sequence).
 * - Have one item (shows the indicated dialogue).
 * - Have two items (show one of the indicated dialogues based on response; if exited, it reopens the dialogue).
 * - Have three items (show one of the first two indicated dialogues based on response, and show the third indicated dialogue if exited).
 * @param tags the tags too add or remove when a certain action occurs. Of type array of arrays of strings. It follows the same format as next, only that each value can have more than one element. If the tag start with a +, it will be added, if it starts with a -, it will be removed, if it start with none, it will default to a +.
 */
type dialogueNode = {
    name: string,
    dialoguePackage: dialoguePackage,
    next: string[],
    tags?: string[][],
};

type dialogueTree = dialogueNode[];

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
 * Adds a dialogue tree to be rendered when available.
 * @param player player to add the tree to.
 * @param index index of the dialogue in the dialogue list. Of type number.
 */
async function traverseTree(
    player: Player,
    index: number,
    firstTimeShown: boolean = true,
) {
    const dialogueTree = dialogQueue[player.id][0];

    if (!player.isValid) return; // Return if player left the game

    if (index === 0) setMovement(player, false);

    const dialogueNode = dialogueTree[index];
    let playAnimation = (dialogueNode.dialoguePackage.dialogue.type === "text" && index === 0) ||
    (dialogueNode.dialoguePackage.dialogue.type === "options" && firstTimeShown);

    try {
        const selection = await showDialogue(
            player,
            dialogueNode.dialoguePackage,
            playAnimation,
            dialogueNode.tags
        );

        if (dialogueNode.next[selection] === "") { // Empty dialogue means there're no dialogues left.
            setMovement(player, true);
            playersOnDialogueExt(false);
            dialogQueue[player.id].splice(0, 1);
            if (dialogQueue[player.id].length > 0) {
                traverseTree(player, 0);
            }
            return;
        }

        if (selection < dialogueNode.next.length) {
            for (let i = 0; i < dialogueTree.length; i++) {
                if (dialogueTree[i].name === dialogueNode.next[selection]) {
                    traverseTree(player, i);
                }
            }
        } else {
            traverseTree(player, index, false);
        }
    } catch (_) {
        playersOnDialogueExt(false);
    }
}