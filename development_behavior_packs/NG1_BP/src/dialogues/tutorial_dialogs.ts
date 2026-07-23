import { Player, } from "@minecraft/server";
import { queueDialogue, dialoguePackage, dialogueOptions, dialogueText, } from "../handler/dialog/dialog_handler";
import { lang, } from "../helpers/dialog/dialog_helper";
export { TutorialDialogue, };

const payloadTranslations = {
    "1_introduction": {
        "en": "* Welcome to the Night Games (1) tutorial. Here, you'll be taught the basics to proceed with the event.",
        "es": "* Bienvenido al tutorial de Night Games (1). Aquí, se te enseñará lo básico para proceder con el evento.",
    },
    "2_cutscenes": {
        "en": "* This event has various cutscenes. These play for all players simultaneously, and only play once all players are ready.",
        "es": "* Este evento tiene varias cinemáticas que se ejecutan para todos los jugadores simultáneamente cuando estén listos.",
    },
    "3_missions": {
        "en": "* In this event, you'll have to find out yourself how to proceed by solving mysteries and helping characters.",
        "es": "* En este evento, tendrás que descubrir tú mismo cómo proceder, resolviendo misterios y ayudando a los personajes.",
    },
    "4_see_mission": {
        "en": "* You can see your current mission by crouching for 3 seconds. Try it!",
        "es": "* Puedes ver tu misión actual agachándote por 3 segundos. ¡Pruébalo!",
    },
    "5_shared_mission": {
        "en": "* For teamwork purposes, all players see the same mission, even if one has already advanced to the next stage.",
        "es": "* Por motivos de trabajo en equipo, todos ven la misma misión, incluso si alguien avanzó a la siguiente etapa.",
    },
    "6_teamwork": {
        "en": "* Regarding teamwork, most of the event requires all players to be on the same stage, so don't worry about being behind.",
        "es": "* Casi todo el evento requiere que todos estén en la misma etapa. No te preocupes si te quedas atrás.",
    },
    "7_day_system": {
        "en": "* The event is divided into 5 levels, played over 5 different days. Each level has its own story and characters.",
        "es": "* El evento tiene 5 niveles jugados en 5 días. Cada nivel tiene su propia historia y personajes.",
    },
    "8_story": {
        "en": "* The event has one continuous story that joins all levels together, apart from each level's story.",
        "es": "* Este evento tiene una historia continua que une todos los niveles, aparte de la historia de cada nivel.",
    },
    "9_skipping_dialogue": {
        "en": "* Because of a bug, you can skip dialogue by having the chat or exit menu open. Use it if the story doesn't interest you.",
        "es": "* Debido a un error, puedes omitir los diálogos si tienes abierto el chat o menú de pausa. Úsalo si no te interesa la historia.",
    },
    "10_bugs": {
        "en": "* Keep in mind that there is a 100 percent chance of at least 10 bugs, so be patient with my little game.",
        "es": "* Ten en cuenta que hay un 100 por ciento de probabilidad de que haya al menos 10 errores, así que sé paciente con mi pequeño juego.",
    },
    "11_dialogues": {
        "en": "* All dialogues were written in English by Night, and translated to Spanish by him as well, so there are definitely typos.",
        "es": "* Los diálogos fueron escritos en inglés y traducidos al español por Night, así que definitivamente hay errores.",
    },
    "12_the_end": {
        "en": "* That is all. Remember, this event was made for you to have fun, so please see past the bugs and enjoy!",
        "es": "* Recuerda, este evento fue hecho para que tú te diviertas, así que por favor mira más allá de los errores y ¡disfruta!",
    },
}

const nameTranslations = {
    "1_introduction": {
        "en": "Introduction",
        "es": "Introducción",
    },
    "2_cutscenes": {
        "en": "Cutscenes",
        "es": "Cinemáticas",
    },
    "3_missions": {
        "en": "Missions",
        "es": "Misiones",
    },
    "4_see_mission": {
        "en": "See Mission",
        "es": "Ver misión",
    },
    "5_shared_mission": {
        "en": "Shared mission",
        "es": "Misión compartida",
    },
    "6_teamwork": {
        "en": "Teamwork",
        "es": "Trabajo en equipo",
    },
    "7_day_system": {
        "en": "Day System",
        "es": "Sistema de días",
    },
    "8_story": {
        "en": "Story",
        "es": "Historia",
    },
    "9_skipping_dialogue": {
        "en": "Skipping Dialogue",
        "es": "Omitir diálogo",
    },
    "10_bugs": {
        "en": "Bugs",
        "es": "Errores",
    },
    "11_dialogues": {
        "en": "Dialogues",
        "es": "Diálogos"
    },
    "12_the_end": {
        "en": "The End",
        "es": "El final"
    }
}

/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. Of type key of type of payload translations.
 */
function computer_dialog_package(
    player: Player,
    translationIdentifier: keyof typeof payloadTranslations,
): dialoguePackage {
    let dialogue: dialogueText | dialogueOptions;

    const text = payloadTranslations[translationIdentifier][lang(player)];

    if (typeof text === "string")
        dialogue = { type: "text", payload: text, }
    else
        dialogue = { type: "options", payload: text, }
    return {
        dialogue: dialogue,
        characterName: nameTranslations[translationIdentifier][lang(player)],
        characterImagePath: "textures/items/spawn_eggs/computer_spawn_egg",
        soundName: "click_on.metal_pressure_plate",
    };
}

/**
 * Calls tutorial computer dialogue.
 */
function TutorialDialogue(player: Player) {
    queueDialogue(
        player,
        [
            {
                name: "introduction",
                dialoguePackage: computer_dialog_package(
                    player,
                    "1_introduction",
                ),
                next: ["cutscenes"],
            },
            {
                name: "cutscenes",
                dialoguePackage: computer_dialog_package(
                    player,
                    "2_cutscenes",
                ),
                next: ["missions"],
            },
            {
                name: "missions",
                dialoguePackage: computer_dialog_package(
                    player,
                    "3_missions",
                ),
                next: ["see_mission"],
            },
            {
                name: "see_mission",
                dialoguePackage: computer_dialog_package(
                    player,
                    "4_see_mission",
                ),
                next: ["shared_mission"],
            },
            {
                name: "shared_mission",
                dialoguePackage: computer_dialog_package(
                    player,
                    "5_shared_mission",
                ),
                next: ["teamwork"],
            },
            {
                name: "teamwork",
                dialoguePackage: computer_dialog_package(
                    player,
                    "6_teamwork",
                ),
                next: ["day_system"],
            },
            {
                name: "day_system",
                dialoguePackage: computer_dialog_package(
                    player,
                    "7_day_system",
                ),
                next: ["story"],
            },
            {
                name: "story",
                dialoguePackage: computer_dialog_package(
                    player,
                    "8_story",
                ),
                next: ["skipping_dialogue"],
            },
            {
                name: "skipping_dialogue",
                dialoguePackage: computer_dialog_package(
                    player,
                    "9_skipping_dialogue",
                ),
                next: ["bugs"],
            },
            {
                name: "bugs",
                dialoguePackage: computer_dialog_package(
                    player,
                    "10_bugs",
                ),
                next: ["dialogues"],
            },
            {
                name: "dialogues",
                dialoguePackage: computer_dialog_package(
                    player,
                    "11_dialogues",
                ),
                next: ["the_end"],
            },
            {
                name: "the_end",
                dialoguePackage: computer_dialog_package(
                    player,
                    "12_the_end",
                ),
                next: [""],
                tags: [["-dialog-computer_tutorial"]],
            },
        ],
    );
};
