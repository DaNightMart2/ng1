import { world, system } from "@minecraft/server";
import { positionInAreCheck } from "../helpers/global_functions";
import { teleportInfo } from "../helpers/teleport/teleport_helper";
// Import teleport arrays
// Define handling functions
function handleActions(player, tagIndex) {
    if (world.scoreboard.getObjective("teleportTickCount")?.getScore(player) === 0) {
        // If player just started teleport
        player.camera.fade({
            "fadeTime": { "fadeInTime": 1.0, "holdTime": 4.0, "fadeOutTime": 1.0 },
            "fadeColor": { "red": 1, "green": 1, "blue": 1 }
        });
    }
    else if (world.scoreboard.getObjective("teleportTickCount")?.getScore(player) === 20) {
        // If player has been teleporting for one second
        player.teleport(// Teleport the player
        teleportInfo, { "rotation": toCoordinates[tagIndex][1] });
    }
    // Titling
    player.runCommand("title @s times 10 100 20"); // Set title timing
    const level = world.scoreboard.getObjective("info")?.getScore("level") || 0;
    // Save current level
    if (level >= 1 && level <= 5) { // If level is 1..5
        player.runCommand(// Show level number
        "titleraw @s subtitle {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:level\"}," +
            "{\"text\": \"§o§l§h" + level + "\"}]}");
    }
    else if (level <= 0) {
        player.runCommand(// Show tutorial level
        "titleraw @s subtitle {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:level\"}, {\"text\": \"§o§l§hTutorial\"}]}");
    }
    else if (level >= 6) {
        player.runCommand(// Show finished event label
        "titleraw @s subtitle {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:finished_event\"}]}");
    }
    // Execute title
    if (world.scoreboard.getObjective("teleportTickCount")?.getScore(player) === 15) {
        // If payer has been teleporting for one and a half seconds
        player.runCommand(// Show title
        "titleraw @s title {\"rawtext\": [" +
            "{\"translate\": \"teleport.ng1:" +
            teleportTags[tagIndex].substring(2, teleportTags[tagIndex].length - 2) + "\"}]}");
    }
    world.scoreboard.getObjective("teleportTickCount")?.addScore(player, 1);
    // Add one tick
}
function handleTags() {
    // Adding teleport to eveyone
    if (!world.scoreboard.getObjective("teleportTickCount")) { // If scoreboard doesn't exist
        world.scoreboard.addObjective("teleportTickCount"); // Create scoreboard
    }
    const notAddedPlayers = world.getPlayers({ "scoreOptions": [{
                "exclude": true,
                "objective": "teleportTickCount",
                "minScore": 0,
                "maxScore": 150
            }
        ] });
    if (notAddedPlayers.length > 0) {
        world.scoreboard.getObjective("teleportTickCount")?.setScore(notAddedPlayers[0], 0);
        // Add players to scoreboard
    }
    // Adding specific teleport tags
    const allPlayers = world.getAllPlayers(); // Get all players
    for (let players of allPlayers) {
        const timeTeleporting = world.scoreboard.getObjective(// Save time teleporting
        "teleportTickCount")
            ?.getScore(players);
        for ( // Do for all teleports
        let teleports_index = 0; teleports_index < teleportTags.length; teleports_index++) {
            if (players.hasTag(teleportTags[teleports_index])) {
                handleActions(players, teleports_index);
                // Call actions handler function to player, tag index
            }
            if (positionInAreCheck(// If player in teleport area
            players.location, fromCoordinates[teleports_index][0], fromCoordinates[teleports_index][1])) {
                players.addTag(teleportTags[teleports_index]);
            }
            else if (typeof timeTeleporting === "number" && timeTeleporting >= 150) {
                players.removeTag(teleportTags[teleports_index]);
            }
        }
    }
}
// Load evey tick
system.runInterval(() => {
    handleTags();
});
// Interacting with helm
world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:interact_hitbox") { // If interacted with interact_hitbox
        if (data.target.nameTag === "ToPort01") { // If interacted with ToPort01 interact_hitbox
            const currentLevel = world.scoreboard.getObjective("info")?.getScore("level");
            // Store current level
            if (typeof currentLevel === "number" && currentLevel >= 5) {
                // If level is numbe and >= 5
                data.player.addTag("ToPort01");
            }
        }
        else if (data.target.nameTag === "ToIsles02") { // If interacted with ToIsles02 interact_hitbox
            data.player.addTag("ToIsles02"); // Add ToIses02 teleport
        }
    }
});
