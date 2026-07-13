import { world, system, } from "@minecraft/server";
import { positionInAreaCheck, } from "../../helpers/global/global_functions";
import { musicInfo, } from "../../helpers/music/music_helper";

system.runInterval(() => {
    const allPlayers = world.getAllPlayers();
    for (let player of allPlayers) {
        for (let music of musicInfo) {
            if (positionInAreaCheck(
                player.location,
                music.coordinates[0],
                music.coordinates[1],
            )) {
                if (!player.hasTag(music.track)) {
                    player.playMusic(music.track, {"loop": true, fade: 1.0, "volume": 1.0});
                }
                player.addTag(music.track);

            } else {
                player.removeTag(music.track);
            }

            if (!player.hasTag(music.track)) {
                player.runCommand("stopsound @s " + music.track);
                // player.stopMusic() stops ALL music from playing.
            }
        }
    }
});

world.afterEvents.playerSpawn.subscribe(data => {
    if (data.initialSpawn) {
        system.runTimeout(() => {
            for (const music of musicInfo) {
                data.player.removeTag(music.track);
            }
        }, 300);
    }
});