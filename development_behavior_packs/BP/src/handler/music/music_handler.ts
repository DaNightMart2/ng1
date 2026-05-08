import { world, system, Player } from "@minecraft/server";
import { positionInAreCheck } from "../helpers/global_functions";
import { musicInfo } from "../helpers/music/music_helper";

system.runInterval(() => {
    const allPlayers: Player[] = world.getAllPlayers();
    for (let player of allPlayers) {
        for (let music of musicInfo) {
            if (positionInAreCheck(
                player.location,
                music.coordinates[0],
                music.coordinates[1]
            )) {
                if (!player.hasTag(music.tag)) {
                    player.playMusic(music.track, {"loop": true, fade: 1.0});
                }
                player.addTag(music.tag);

            } else {
                player.removeTag(music.tag);
            }

            if (!player.hasTag(music.tag)) {
                player.runCommand("stopsound @s " + music.track);
            }
        }
    }
});