import { system, world, } from "@minecraft/server";
import { TutorialDialogue, } from "../../dialogues/tutorial_dialogs";

let PlayersOnComputer: Record<string, string[]> = {};
let skipIteration = false;

/**
 * Handle players' interaction with the computer.
 */
world.afterEvents.playerInteractWithEntity.subscribe(data => {
    const computer = data.target;
    if (computer.typeId === "ng1:computer" && computer.hasTag("ng1:tutorial_computer")) {
        const player = data.player;

        if (!(PlayersOnComputer[computer.id])) {
            PlayersOnComputer[computer.id] = [];
        }

        if (PlayersOnComputer[computer.id].includes(player.id)) {
            const playerArrayPosition = PlayersOnComputer[computer.id].indexOf(player.id);
            PlayersOnComputer[computer.id].splice(playerArrayPosition, 1);

            if (PlayersOnComputer[computer.id].length === 0) {
                computer.playAnimation("animation.computer.close");
            }
        } else {
            player.addTag("dialog-computer_tutorial");
            PlayersOnComputer[computer.id].push(player.id);
            TutorialDialogue(player);

            if (PlayersOnComputer[computer.id].length === 1) {
                computer.playAnimation("animation.computer.open");
            }
        }
    }
});

/**
 * Remove players that left the world.
 */
system.runInterval(() => {
    const dimension = world.getDimension("overworld");
    const computersRef = dimension.getEntities({
        "type": "ng1:computer",
        "tags": ["ng1:tutorial_computer"]
    });

    for (const computerRef of computersRef) {
        const computerId = computerRef.id;

        //console.log(PlayersOnComputer[computerId]);

        if (!(PlayersOnComputer[computerId])) return;
        for (let i = 0; i < PlayersOnComputer[computerId].length; i++) {
            const allPlayersRef = world.getAllPlayers();

            for (const playerRef of allPlayersRef) {
                if (!(playerRef.hasTag("dialog-computer_tutorial"))) {
                    if (PlayersOnComputer[computerId].includes(playerRef.id)) {
                        PlayersOnComputer[computerId].splice(i, 1);

                        if (PlayersOnComputer[computerId].length === 0) {
                            computerRef.playAnimation("animation.computer.close");
                        }

                        skipIteration = true;
                    }
                }
            }

            if (skipIteration) {
                skipIteration = false;
                continue;
            }

            const allPlayersId = allPlayersRef.map(player => player.id);
            const playerId = PlayersOnComputer[computerId][i];
            if (!(allPlayersId.includes(playerId))) {
                PlayersOnComputer[computerId].splice(i, 1);

                if (PlayersOnComputer[computerId].length === 0) {
                    computerRef.playAnimation("animation.computer.close");
                }
            }
        }
    }
});