import { Player, } from "@minecraft/server";

export { splitText, lang, tagDetection, showGlobalDialogue, playersOnDialogueExt, };

let playersOnDialogue = 0;
/**
 * Returns true when no players have a dialog open in their screens.
 */
async function showGlobalDialogue(): Promise<boolean> {
    return new Promise((resolve) => {
        if (playersOnDialogue === 0) resolve(true);
    });
}
/**
 * Returns the playersOnDialogue function, and add or removes one from it.
 * @param addition defines if to adds or removes one from the variable. Of type boolean. Is optional.
 */
function playersOnDialogueExt(addition?: boolean): number {
    if (addition) {
        playersOnDialogue++;
    }
    else if (addition === false) {
        playersOnDialogue--;
    }
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
        return "| [UI][error]-dialog_helper.ts.\n| Parameter 'text' is too long.\n| Error code: 67.";
    }

    return splitText.join("\n");
}

type language = "en" | "es";
const languages: language[] = [
    "en",
    "es"
]

/**
 * Returns the language of the player based on their tags. Returns "es" or "en". Defaults to "en".
 */
function lang(player: Player): language {
    for (const language of languages) {
        if (player.hasTag(language)) {
            return language;
        }
    }
    return languages[0];
}

/**
 * Adds or removes a players tag.
 * @param player player to modify tags. Of type player.
 * @param tag tag to add to or remove from the player. Of type string. If string starts with '-', removes tag, otherwise adds it.
 */
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