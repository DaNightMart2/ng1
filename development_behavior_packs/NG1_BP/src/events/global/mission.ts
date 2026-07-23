import { system, world, } from "@minecraft/server";
import { getGlobalVariables, positionInAreaCheck, } from "../../helpers/global/global_functions";
import { lang, } from "../../helpers/dialog/dialog_helper";

const MissionTranslations = {
    "explore": {
        "en": "§eExplore",
        "es": "§eExplora",
    },
    "enter_trapdoors": {
        "en": "§eEnter the hidden room",
        "es": "§eEntra a la habitación oculta",
    },
    "investigate": {
        "en": "§eInvestigate the screen",
        "es": "§eInvestiga la pantalla",
    },
    "theentity_battle_regular": {
        "en": "§eSurvive!",
        "es": "§e¡Sobrevive!",
    },
    "theentity_battle_shutdown": {
        "en": "§eQuick! Attack TheEntity",
        "es": "§e¡Rápido! Ataca a TheEntity",
    },
    "theentity_battle_ending": {
        "en": "§eFollow TheEntity",
        "es": "§eSigue a TheEntity"
    }
}

enum missionValues {
    WaitingForPlayersLimbo = 0,
    OpenedTrapdoors = 1,
    SpawnedTheEntity = 2,
    TheEntityBattleRegular = 3,
    TheEntityBattleShutdown = 4,
    TheEntityBattleEnding = 5,
}

let IdleSneakingPlayerCounter: Record<string, number> = {};

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (!(player.id in IdleSneakingPlayerCounter)) {
            IdleSneakingPlayerCounter[player.id] = 0;
        }

        if (player.isSneaking) {
            IdleSneakingPlayerCounter[player.id]++;
        } else {
            IdleSneakingPlayerCounter[player.id] = 0;
        }

        if (IdleSneakingPlayerCounter[player.id] >= 60) {
            const mission = getGlobalVariables().mission;

            if (mission === missionValues.WaitingForPlayersLimbo &&
                positionInAreaCheck(
                    player.location,
                    {x: 10, y: 3, z: -2},
                    {x: 63, y: 45, z: 53},
                )) {
                player.onScreenDisplay.setActionBar(
                    MissionTranslations.explore[lang(player)]
                );
            } else if (mission === missionValues.OpenedTrapdoors) {
                if (positionInAreaCheck(
                    player.location,
                    { x: 102, y: 3, z: 27 },
                    { x: 156, y: 18, z: 74 },
                )) {
                    player.onScreenDisplay.setActionBar(
                        MissionTranslations.explore[lang(player)]
                    );
                } else {
                    player.onScreenDisplay.setActionBar(
                        MissionTranslations.enter_trapdoors[lang(player)]
                    );
                }
            } else if (mission === missionValues.SpawnedTheEntity) {
                player.onScreenDisplay.setActionBar(
                    MissionTranslations.investigate[lang(player)]
                );
            } else if (mission === missionValues.TheEntityBattleRegular) {
                player.onScreenDisplay.setActionBar(
                    MissionTranslations.theentity_battle_regular[lang(player)]
                );
            } else if (mission === missionValues.TheEntityBattleShutdown) {
                player.onScreenDisplay.setActionBar(
                    MissionTranslations.theentity_battle_shutdown[lang(player)]
                );
            } else if (mission === missionValues.TheEntityBattleEnding) {
                if (!positionInAreaCheck(
                    player.location,
                    { x: 102, y: 3, z: 27 },
                    { x: 156, y: 18, z: 74 },
                )) {
                    player.onScreenDisplay.setActionBar(
                        MissionTranslations.explore[lang(player)]
                    );
                } else {
                    player.onScreenDisplay.setActionBar(
                        MissionTranslations.theentity_battle_ending[lang(player)]
                    );
                }
            }
        }
    }
});