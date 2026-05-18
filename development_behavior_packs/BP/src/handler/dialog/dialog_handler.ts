import { InputPermissionCategory, Player, system, } from "@minecraft/server";
import { ActionFormData, } from "@minecraft/server-ui";
import { splitText, } from "../../helpers/dialog/dialog_helper";

export { traverseTree, dialoguePackage, dialogueText, dialogueOptions, };

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
        if (dialogue.payload.length >= 1) {
            dialogueForm.button(dialogue.payload[0]); // Button 1
            if (dialogue.payload.length >= 2) {
                dialogueForm.button(dialogue.payload[1]); // Button 2
            }
            if (dialogue.payload.length >= 3) {
                dialogueForm.button(dialogue.payload[2]); // Button 3
            }
            if (dialogue.payload.length >= 4) {
                dialogueForm.button(dialogue.payload[3]); // Button 4
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

/**
 * Adds a dialogue tree to be rendered when available.
 * @param player player to add the tree to.
 * @param dialogueTree dialogue tree to be proccessed. Of type dialogueTree.
 * -1 on next means it's the last dialogue, therefore it stops the chain.
 * @param index index of the dialogue in the dialogue list. Of type number.
 */
async function traverseTree(
    player: Player,
    dialogueTree: dialogueNode[],
    index: number,
    firstTimeShown: boolean = true,
) {
    if (index === 0) setMovement(player, false);

    const dialogueNode = dialogueTree[index];
    let playAnimation = (dialogueNode.dialoguePackage.dialogue.type === "text" && index === 0) ||
        (dialogueNode.dialoguePackage.dialogue.type === "options" && firstTimeShown);

    const selection = await showDialogue(player, dialogueNode.dialoguePackage, playAnimation, dialogueNode.tags);

    if (dialogueNode.next[selection] === "") { // Empty dialogue means there're no dialogues left.
        setMovement(player, true);
        return;
    }

    if (selection < dialogueNode.next.length) {
        for (let i = 0; i < dialogueTree.length; i++) {
            if (dialogueTree[i].name === dialogueNode.next[selection]) {
                traverseTree(player, dialogueTree, i);
            }
        }
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

function tagDetection(player: Player, tag: string) {
    if (tag[0] === "-") {
        player.removeTag(tag.substring(1, tag.length));
    } else {
        if (tag[0] === "+") {
            player.addTag(tag.substring(1, tag.length));
        } else {
            player.addTag(tag);
        }
    }
}