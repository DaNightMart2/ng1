import { system, world, } from "@minecraft/server";

system.runInterval(() => {
    const restartEntities = [
        "volley_ball",
        "wooden_doors",
        "screens",
        "screen",
        "path_to_farm",
        "path_to_outside",
        "path_to_limbo",
        "theentity",
        "tutorial_computer",
    ];

    let scoreboardTemp = world.scoreboard.getObjective("restartedEntities");
    let scoreboard;

    if (!scoreboardTemp) {
        scoreboard = world.scoreboard.addObjective("restartedEntities");
    } else {
        scoreboard = scoreboardTemp;
    }

    for (const restartEntity of restartEntities) {
        scoreboard.addScore(restartEntity, 0);
    }

    const dimension = world.getDimension("overworld");

    if (scoreboard.getScore("volley_ball") === 1) {
        for (const ball of dimension.getEntities({"type": "ng1:volley_ball"})) {
            ball.remove();
        }
        for (const player of world.getAllPlayers()) {
            player.runCommand("clear @s ng1:volley_ball_spawn_egg");
        }
        dimension.spawnEntity("ng1:volley_ball", {x: 43.0, y: 8, z: 12.5});
        scoreboard.setScore("volley_ball", 0);
    }

    if (scoreboard.getScore("wooden_doors") === 1) {
        for (const wooden_door of dimension.getEntities({"type": "ng1:wooden_door", "tags": ["ng1:wooden_door"]})) {
            wooden_door.remove();
        }
        scoreboard.setScore("wooden_doors", 0);
    }

    if (scoreboard.getScore("screens") === 1) {
        for (const screen of dimension.getEntities({"type": "ng1:screen", "tags": ["ng1:screen"]})) {
            screen.remove();
        }
        scoreboard.setScore("screens", 0);
    }

    if (scoreboard.getScore("screen") === 1) {
        try {
            const screen = dimension.spawnEntity("ng1:screen", {x: 129.0, y: 6.5, z: 51.0}, {"initialRotation": 90});
            screen.addTag("ng1:screen");
            scoreboard.setScore("screen", 0);
        } catch (_) {}
    }

    if (scoreboard.getScore("path_to_farm") === 1) {
        try {
            const wooden_door_farm = dimension.spawnEntity("ng1:wooden_door", {x: 47.5, y: 7.0, z: 48.5}, {"initialRotation": 180});
            wooden_door_farm.addTag("ng1:wooden_door_farm");
            wooden_door_farm.addTag("ng1:wooden_door");
            wooden_door_farm.triggerEvent("ng1:close_door");
            wooden_door_farm.setProperty("ng1:in_movement", false); // To disable sound
            scoreboard.setScore("path_to_farm", 0);
        } catch (_) {}
    }

    if (scoreboard.getScore("path_to_outside") === 1) {
        try {
            const wooden_door_outside = dimension.spawnEntity("ng1:wooden_door", {x: 188.5, y: 14.0, z: 142.5}, {"initialRotation": 180});
            wooden_door_outside.addTag("ng1:wooden_door_outside");
            wooden_door_outside.addTag("ng1:wooden_door");
            wooden_door_outside.triggerEvent("ng1:close_door");
            wooden_door_outside.setProperty("ng1:in_movement", false); // To disable sound
            scoreboard.setScore("path_to_outside", 0);
        } catch (_) {}
    }

    if (scoreboard.getScore("path_to_limbo") === 1) {
        try {
            const wooden_door_limbo = dimension.spawnEntity("ng1:wooden_door", {x: 187.5, y: 14.0, z: 110.5}, {"initialRotation": 0});
            wooden_door_limbo.addTag("ng1:wooden_door_limbo");
            wooden_door_limbo.addTag("ng1:wooden_door");
            wooden_door_limbo.triggerEvent("ng1:open_door");
            wooden_door_limbo.playAnimation("animation.wooden_door.is_open");
            wooden_door_limbo.setProperty("ng1:in_movement", false); // To disable sound
            scoreboard.setScore("path_to_limbo", 0);
        } catch (_) {}
    }

    if (scoreboard.getScore("theentity") === 1) {
        try {
            const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});
            for (const theentity of theentities) {
                theentity.remove();
            }

            const theentity = dimension.spawnEntity("ng1:theentity", {x: 115.2, y: 21.0, z: 51.0}, {"initialRotation": -90});
            theentity.addTag("ng1:theentity");

            scoreboard.setScore("theentity", 0);
        } catch (_) {}
    }

    if (scoreboard.getScore("tutorial_computer") === 1) {
        try {
            const tutorial_computers = dimension.getEntities({"type": "ng1:computer", "tags": ["ng1:tutorial_computer"]});
            for (const tutorial_computer of tutorial_computers) {
                tutorial_computer.remove();
            }

            const tutorial_computer_1 = dimension.spawnEntity("ng1:computer", {x: 38.5, y: 22.0, z: 24.0}, {"initialRotation": 90});
            tutorial_computer_1.addTag("ng1:tutorial_computer");

            const tutorial_computer_2 = dimension.spawnEntity("ng1:computer", {x: 31.5, y: 22.0, z: 24.0}, {"initialRotation": -90});
            tutorial_computer_2.addTag("ng1:tutorial_computer");
            scoreboard.setScore("tutorial_computer", 0);
        } catch (_) {}
    }
});