import { system, world, } from "@minecraft/server";
import { getGlobalVariables, } from "../../../helpers/global/global_functions";

let theEntitiesAnimationCooldown: Record<string, number> = {};
system.runInterval(() => {
    const sectionConcat = getGlobalVariables().sectionConcat;
    if (sectionConcat >= 110) {
        const dimension = world.getDimension("overworld");
        const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});

        for (const theentity of theentities) {
            console.log("A")
            if (!(theEntitiesAnimationCooldown[theentity.id] <= 0)) return;
            theEntitiesAnimationCooldown[theentity.id]--;
            if (!Object.keys(theEntitiesAnimationCooldown).includes(theentity.id)) {
                theEntitiesAnimationCooldown[theentity.id] = 26;
            }
            theentity.playAnimation("animation.theentity.idle");
        }
    }
});