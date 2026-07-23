import { Vector3, Player, world, ScoreboardObjective, } from "@minecraft/server";

export { positionInAreaCheck, setMovement, getGlobalVariables, };

/**
 * Checks if a position is inside a certain area.
 * @param position position for the check.
 * @param firstPoint beginning of area, must be the minimum of each axis.
 * @param secondPoint end of area, must be the maximum number of each axis.
 */
function positionInAreaCheck(
    position: Vector3,
    firstPoint: Vector3,
    secondPoint: Vector3,
): boolean {
    if (
        // +1 and -1 is used to ensure full block detection
        position.x >= firstPoint.x - 1 && position.x <= secondPoint.x + 1 &&
        position.y >= firstPoint.y - 1 && position.y <= secondPoint.y + 1 &&
        position.z >= firstPoint.z - 1 && position.z <= secondPoint.z + 1
    ) {
        return true;
    }
    return false;
}

/**
 * Sets a players movement as enabled or disabled.
 * @param player player to modify movement of. Of type player.
 * @param enable if to enable or disable input. Of type boolean.
 */
function setMovement(player: Player, enable: boolean) {
    for (let i = 0; i <= 12; i++) {
        player.inputPermissions.setPermissionCategory(i, enable);
    }
}

/** 
 * Gets the globalVariables and sectionConcat and timer from it and returns all that in an array. Returns JSON object.
 */
function getGlobalVariables(): {
    globalVariables: ScoreboardObjective,
    sectionConcat: number,
    timer: number,
    mission: number,
} {
    let globalVariables: ScoreboardObjective;
    let sectionConcat: number;
    let timer: number;
    let mission: number;

    const globalVariablesTemp = world.scoreboard.getObjective("globalVariables");
    if (!globalVariablesTemp) {
        globalVariables = world.scoreboard.addObjective("globalVariables");
        sectionConcat = globalVariables.addScore("sectionConcat", 100);
        timer = globalVariables.addScore("timer", 1200);
        mission = globalVariables.addScore("mission", 0);
    } else {
        globalVariables = globalVariablesTemp;
        mission = globalVariables.addScore("mission", 0);

        try {
            sectionConcat = globalVariables.getScore("sectionConcat") ?? 100;
        } catch (_) {
            sectionConcat = globalVariables.addScore("sectionConcat", 100);
        }
        try {
            timer = globalVariables.getScore("timer") ?? 1200;
        } catch (_) {
            timer = globalVariables.addScore("timer", 1200);
        }
    }

    return {
        globalVariables: globalVariables,
        sectionConcat: sectionConcat,
        timer: timer,
        mission: mission,
    };
}