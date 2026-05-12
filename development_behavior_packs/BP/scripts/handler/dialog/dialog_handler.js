import { InputPermissionCategory, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { splitText } from "../../helpers/dialog/dialog_helper";
let dialogQueue = {};
export { queueDialog };
/**
 * Adds a dialog package to be rendered when available.
 * @param player player ID to add the package to.
 * @param dialogPackage package to be added, is of type dialogPackage.
 */
function queueDialog(player, dialogPackage) {
    if (!Object.keys(dialogQueue).includes(player.id)) {
        dialogQueue[player.id] = [];
    }
    dialogQueue[player.id].push(dialogPackage);
    if (dialogPackage[5]) {
        showDialog(player, 0);
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false);
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, false);
    }
}
/**
 * Shows first queue dialog package.
 * @param player player ID to get package from.
 * @param response the response to the last option package. Cancelled or none is zero, buttons are one and two.
 */
function showDialog(player, response = 0) {
    if (dialogQueue[player.id][0][4] && dialogQueue[player.id][0][4] !== response) {
        dialogQueue[player.id].splice(0, 1);
        if (dialogQueue[player.id].length > 0) {
            showDialog(player, response);
        }
        else {
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true);
        }
        return;
    }
    let soundPlayingIndex = 0;
    const sound = dialogQueue[player.id][0][3];
    const dialogSound = system.runInterval(() => {
        if (soundPlayingIndex < 3) {
            player.playSound(sound);
            soundPlayingIndex++;
        }
        else {
            system.clearRun(dialogSound);
        }
    }, 3);
    const dialogForm = new ActionFormData;
    dialogForm.button(dialogQueue[player.id][0][1], // characterName
    dialogQueue[player.id][0][2] // characterImage
    );
    if (dialogQueue[player.id][0][5] || typeof dialogQueue[player.id][0][5] !== "string") {
        dialogForm.title("true"); // Send playanimation commands (through .title,
        // as it is not necessary for anything else)
    }
    let dialogPackage = dialogQueue[player.id][0];
    if (typeof dialogPackage[0] === "string") {
        dialogForm.body(splitText(dialogPackage[0], 40, 3));
        dialogForm.button(""); // Empty buttons (otherwise it bugs)
        dialogForm.button("");
        dialogQueue[player.id].splice(0, 1);
    }
    else {
        dialogForm.button(dialogPackage[0][0]); // Button 1
        dialogForm.button(dialogPackage[0][1]); // Button 2
    }
    dialogForm.show(player).then(response => {
        system.clearRun(dialogSound);
        if (dialogQueue[player.id].length > 0) {
            if (response.canceled) {
                showDialog(player, 1);
            }
            else if (response.selection) {
                if (typeof dialogPackage[0] !== "string") {
                    dialogQueue[player.id].splice(0, 1);
                }
                showDialog(player, response.selection);
            }
        }
        else {
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true);
        }
    });
}
