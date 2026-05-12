import { world, system, Player, Vector3, Vector2 } from "@minecraft/server";
import { positionInAreCheck } from "../../helpers/global/global_functions";
import { teleportInfo } from "../../helpers/teleport/teleport_helper";

function handleActions(player: Player, teleport: {
    tag: string,
    fromCoordinates: Vector3[],
    toCoordinates: Vector3,
    rotation: Vector2,
}) {
    if (world.scoreboard.getObjective("teleportTickCount")?.getScore(player) === 0) {
        player.camera.fade({
            "fadeTime": {"fadeInTime": 1.0, "holdTime": 4.0, "fadeOutTime": 1.0},
            "fadeColor": {"red": 1, "green": 1, "blue": 1}
        })
    }

    else if (world.scoreboard.getObjective("teleportTickCount")?.getScore(player) === 20) {
        player.teleport(teleport.toCoordinates,
            {"rotation": teleport.rotation}
        );
    }

    player.runCommand("title @s times 10 100 20");

    const level = world.scoreboard.getObjective("info")?.getScore("level") || 0;

    if (level >= 1 && level <= 5) {
        player.runCommand(
            "titleraw @s subtitle {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:level\"}," +
            "{\"text\": \"§o§l§h" + level + "\"}]}"
        )
    } else if (level <= 0) {
        player.runCommand(
            "titleraw @s subtitle {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:level\"}, {\"text\": \"§o§l§hTutorial\"}]}"
        )

    } else if (level >= 6) {
        player.runCommand(
            "titleraw @s subtitle {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:finished_event\"}]}"
        )
    }

    if (world.scoreboard.getObjective("teleportTickCount")?.getScore(player) === 15) {

        player.runCommand(
            "titleraw @s title {\"rawtext\": [" + 
            "{\"translate\": \"teleport.ng1:" +
            teleport.tag.substring(
                2, teleport.tag.length - 2) + "\"}]}"
        );
    }

    world.scoreboard.getObjective("teleportTickCount")?.addScore(player, 1);
}

function handleTags() {
    if (!world.scoreboard.getObjective("teleportTickCount")) {
        world.scoreboard.addObjective("teleportTickCount");
    }

    for (const player of world.getAllPlayers()) {
        const scoreboardIdentity = player.scoreboardIdentity
        if (!scoreboardIdentity) {
            world.scoreboard.getObjective("teleportTickCount")?.setScore(player, 0);
        }
    }

    for (let player of world.getAllPlayers()) {
        const timeTeleporting = world.scoreboard.
        getObjective("teleportTickCount")?.getScore(player);

        for (const teleport of teleportInfo) {
            if (player.hasTag(teleport.tag)) {
                handleActions(player, teleport);
            }

            if (positionInAreCheck (
                player.location,
                teleport.fromCoordinates[0],
                teleport.fromCoordinates[1]
            )) {
                player.addTag(teleport.tag);
            } else if (typeof timeTeleporting === "number" && timeTeleporting >= 150) {
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