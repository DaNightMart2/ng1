import { Player, InputPermissionCategory, } from "@minecraft/server";

export { splitText, lang, tagDetection, setMovement, showGlobalDialogue, playersOnDialogueExt, };

let playersOnDialogue = 0;

/**
 * Returns true if no players have a dialog open in their screens.
 */
function showGlobalDialogue(): boolean {
    if (playersOnDialogue <= 0) return true;
    return false;
}

function playersOnDialogueExt(increment?: number): number {
    if (increment) playersOnDialogue += increment;
    return playersOnDialogue;
}

/**
 * Cuts text and characterName so that they fit correctly in the UI.
 * @param text text to split.
 * @param maxLengthPerLine the maximum amount of characters each line can have (inclusive). Defaults to 40.
 * @param maxLines the maximum amount of lines the text can have (inclusive). Defaults to 3.
 */
function splitText(
    text: string,
    maxLengthPerLine = 40,
    maxLines = 3,
): string {
    let splitText: string[] = [];
    let line_progress = "";

    for (const word of text.split(" ")) {
        if (line_progress.length + word.length > maxLengthPerLine) {
            splitText.push(line_progress);
            line_progress = "";
        }

        if (line_progress.length > 0) {
            line_progress += " ";
        }
        line_progress += word;
    }
    splitText.push(line_progress);

    if (splitText.length > maxLines) {
        return "| [UI][error]-dialog_helper.ts.\n| Parameter 'text' is too long.\n| Error code: waffle.";
    }

    return splitText.join("\n");
}

type language = "es_ar" | "en" | "es_mx";
const languages: language[] = [
    "es_ar",
    "en",
    "es_mx",
]

function lang(player: Player): language {
    for (const language of languages) {
        if (player.hasTag(language)) {
            return language;
        }
    }
    return languages[0];
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