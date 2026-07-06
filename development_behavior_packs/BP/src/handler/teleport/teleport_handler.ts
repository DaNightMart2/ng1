import { world, system, Player, Vector3, Vector2, ScoreboardObjective, } from "@minecraft/server";
import { positionInAreCheck, } from "../../helpers/global/global_functions";
import { teleportInfo, } from "../../helpers/teleport/teleport_helper";

function handleActions(player: Player, teleport: {
    tag: string,
    fromCoordinates: Vector3[],
    toCoordinates: Vector3,
    rotation: Vector2,
}, teleportTickObjective: ScoreboardObjective, infoObjective: ScoreboardObjective | undefined) {
    const teleportTickCount = teleportTickObjective.getScore(player) ?? 0;

    if (teleportTickCount === 0) {
        player.camera.fade({
            "fadeTime": {"fadeInTime": 1.0, "holdTime": 4.0, "fadeOutTime": 1.0},
            "fadeColor": {"red": 1, "green": 1, "blue": 1}
        });
    }

    else if (teleportTickCount === 20) {
        player.teleport(
            teleport.toCoordinates,
            {"rotation": teleport.rotation}
        );
    }

    player.runCommand("title @s times 10 100 20");

    const level = infoObjective?.getScore("level") || 0;

    if (level >= 1 && level <= 5) {
        player.runCommand(
            "titleraw @s subtitle {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:level\"}," +
            "{\"text\": \"§o§l§h" + level + "\"}]}"
        );

    } else if (level <= 0) {
        player.runCommand(
            "titleraw @s subtitle {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:level\"}, {\"text\": \"§o§l§hTutorial\"}]}"
        );

    } else if (level >= 6) {
        player.runCommand(
            "titleraw @s subtitle {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:finished_event\"}]}"
        );
    }

    if (teleportTickCount === 15) {

        player.runCommand(
            "titleraw @s title {\"rawtext\": [" + 
            "{\"translate\": \"teleport.ng1:" +
            teleport.tag.substring(
                2, teleport.tag.length - 2) + "\"}]}"
        );
    }

    teleportTickObjective.addScore(player, 1);
}

function handleTags() {
    const teleportTickObjective = world.scoreboard.getObjective("teleportTickCount") ?? world.scoreboard.addObjective("teleportTickCount");
    const infoObjective = world.scoreboard.getObjective("info");
    const allPlayers = world.getAllPlayers();

    for (const player of allPlayers) {
        const scoreboardIdentity = player.scoreboardIdentity;
        const playerScore = teleportTickObjective.getScore(player);
        if (!scoreboardIdentity || (typeof playerScore === "number" && playerScore > 150)) {
            teleportTickObjective.setScore(player, 0);
        }
    }

    for (const player of allPlayers) {
        const timeTeleporting = teleportTickObjective.getScore(player) ?? 0;

        for (const teleport of teleportInfo) {
            if (player.hasTag(teleport.tag)) {
                handleActions(player, teleport, teleportTickObjective, infoObjective);
            }

            if (positionInAreCheck (
                player.location,
                teleport.fromCoordinates[0],
                teleport.fromCoordinates[1],
            )) {
                player.addTag(teleport.tag);
            } else if (timeTeleporting >= 150) {
                player.removeTag(teleport.tag);
            }
        }
    }
}

system.runInterval(() => {
    handleTags();
});

world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:interact_hitbox") {
        if (data.target.nameTag === "ToPort01") {
            const currentLevel = world.scoreboard.getObjective("info")?.getScore("level");
            if (typeof currentLevel === "number" && currentLevel >= 5) {
                data.player.addTag("ToPort01");
            }
        } else if (data.target.nameTag === "ToIsles02") {
            data.player.addTag("ToIsles02");
        }
    }
});