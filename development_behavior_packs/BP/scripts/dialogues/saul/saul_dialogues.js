import { world } from "@minecraft/server";
import { queueDialog } from "../../handler/dialog/dialog_handler";
function saul_dialog_package(text, expresion, requiredPreviousResponse = 0, firstOfPackage = false) {
    return [
        text,
        "Rey Saúl",
        "textures/ui/faces/saul/" + expresion,
        "mob.pig.say",
        requiredPreviousResponse,
        firstOfPackage
    ];
}
world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.typeId === "ng1:interact_hitbox") {
        if (data.target.nameTag === "saul_hitbox") {
            queueDialog(data.player, saul_dialog_package("Chose an option:", "neutral", 0, true));
        }
    }
});
