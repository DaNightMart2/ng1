import { world } from "@minecraft/server";
function restartLang() {
    const player = world.getAllPlayers()[0];
    player.runCommand("tag @a remove es_ar");
    player.runCommand("tag @a remove en_us");
    player.runCommand("tag @a remove es_mx");
    player.runCommand("tag @a remove en_uk");
}
function restartPosition() {
    world.getAllPlayers()[0].runCommand("tp @a -12.5 45.0 7.5 0 0");
}
function restartScoreboard() {
    const player = world.getAllPlayers()[0];
    player.runCommand("scoreboard players set @a teleportTickCount 0");
    player.runCommand("scoreboard players set level info -1");
}
function setScore(score, value, objective = "restart") {
    world.scoreboard.getObjective(objective)?.setScore(score, value);
}
function resetStructures() {
    const restartScores = world.scoreboard.getObjective("restart")?.getScores();
}
