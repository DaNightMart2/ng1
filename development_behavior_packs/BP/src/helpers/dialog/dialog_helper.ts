import { Player, } from "@minecraft/server";

export { splitText, lang, };

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
        return "[UI][error]-dialog_helper.ts parameter 'text' is too long | Error code: waffle.";
    }

    return splitText.join("\n");
}

type language = "es_ar" | "en_us" | "es_mx" | "en_uk";
const languages: language[] = [
    "es_ar",
    "en_us",
    "es_mx",
    "en_uk"
]

function lang(player: Player) {
    for (const language of languages) {
        if (player.hasTag(language)) {
            return language;
        }
    }
    return languages[0];
}