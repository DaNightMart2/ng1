import { Player, world, } from "@minecraft/server";
import { queueDialogue, dialoguePackage, dialogueOptions, dialogueText, } from "../handler/dialog/dialog_handler";
import { lang, } from "../helpers/dialog/dialog_helper";

const payloadTranslations = {
    "1_no": {
        "en": "> NOOOOOOOOOOO!",
        "es": "> ¡NOOOOOOOOOOO!",
    },
    "2_wondering": {
        "en": "> ?",
        "es": "> ¿?",
    },
    "3_wondering_why_not_exploded": {
        "en": "(This little pig questions why he has not exploded)",
        "es": "(Este cerdito se pregunta por qué no ha explotado)",
    },

    "1_2_3_happy_not_exploded": {
        "en": "(This little pig is happy not to have exploded)",
        "es": "(Este cerdito está contento de no haber explotado)",
    },

    "4_noticed_you": {
        "en": "(He just noticed your presence and got scared)",
        "es": "(Acaba de notar tu presencia y se asustó)",
    },
    "5_happy": {
        "en": "(Now he is happy)",
        "es": "(Ahora está feliz)",
    },
    "6_why_happy": {
        "en": "(He does not know why he is happy, maybe you have a trustworthy face?)",
        "es": "(No sabe por qué está feliz, quizás tienes cara de persona confiable?)",
    },

    "7_greeting": {
        "en": "> H- Hello! My name is Saul, oink. I cannot believe you can see me, it has been years since someone last saw me, oink.",
        "es": "> ¡H- Hola! Soy Saúl, oink. No puedo creer que me puedas ver, fueron años desde que alguien me vio por última vez, oink.",
    },
    "8_explanation": {
        "en": "> Let me explain:",
        "es": "> Te explico:",
    },

    // TO ADD

    "10_return_leingire": {
        "en": "> I would like, now that I am alive, oink, to return to my city, Leingire, oink. Would you like to help me?",
        "es": "> Me gustaría, ahora que estoy vivo, oink, volver a mi ciudad, Leingire, oink. ¿Me podrías ayudar?",
    },
    "11_thank_you": {
        "en": "> Thank you so much, oink! I know just who can help us: Peter, the farmer, oink!",
        "es": "> ¡Muchas gracias, oink! Sé quién nos puede ayudar: Peter, el granjero, oink!",
    },
    "12_farm_half_hour": {
        "en": "> Though he will open his farm in half an hour, so we must wait to ask him, oink...",
        "es": "> Aunque él va a abrir su granja en media hora, así que tenemos que esperar para preguntarle, oink...",
    },
    "13_explore": {
        "en": "> Meanwhile, we can explore this place, oink!",
        "es": "> Mientras tanto, ¡podemos explorar este lugar, oink!",
    },
    "14_interesting": {
        "en": "> It must have something interesting to see, oink...",
        "es": "> Debe tener algo interesante para ver, oink...",
    },

    "15_explore_trauma": {
        "en": "> Explore.. yeah, last time I did that it did not end well, oink, so I better stay right here, oink!",
        "es": "> Explorar... sí, la última vez que hice eso no terminó bien, oink, ¡así que mejor me quedo aquí mismo, oink!",
    },
};

const nameTranslations = {
    saul: {
        "en": "King Saul",
        "es": "Rey Saúl",
    },
}

/**
 * Automatically defines the dialog package using the characters information and the provided text.
 * @param player player to check the language from. Of type player.
 * @param translationIdentifier key of the translation to get the text from. Of type key of type of payload translations.
 */
function saul_dialog_package(
    player: Player,
    translationIdentifier: keyof typeof payloadTranslations,
    expression: string,
): dialoguePackage {
    let dialogue: dialogueText | dialogueOptions;

    const text = payloadTranslations[translationIdentifier][lang(player)];

    if (typeof text === "string")
        dialogue = { type: "text", payload: text, }
    else
        dialogue = { type: "options", payload: text, }
    return {
        dialogue: dialogue,
        characterName: nameTranslations.saul[lang(player)],
        characterImagePath: "textures/ui/faces/saul/" + expression,
        soundName: "mob.pig.say",
    };
}

enum Expression {
    DISAPPOINTED = "disappointed",
    EMBARRASSED = "embarrassed",
    EXCITED_QUESTIONING = "excited-questioning",
    EXCITED = "excited",
    EXTREMELY_SCARED_QUESTIONING = "extremely_scared-questioning",
    EXTREMELY_SCARED = "extremely_scared",
    INHALING = "inhaling",
    NEUTRAL = "neutral",
    PLEASED = "pleased",
    SET = "set",
}

/**
 * Call king Saúl's dialogs.
 */
world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:interact_hitbox") {
        if (data.target.nameTag === "saul_hitbox") {
            const player = data.player
        }
    }
});
