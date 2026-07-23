import { world, system, } from "@minecraft/server";
import { getGlobalVariables, } from "../../../../../helpers/global/global_functions";
import { AttackCooldownsGlobal, } from "../battle/attacks";

enum sectionConcatValues {
    FallingAnimationStart = 105,
    BattleIsSetUp = 107,
    FirstOff = 108,
}

let theEntitiesAnimationCooldown: Record<string, number> = {};
let WaitingToPlayOffAnimation: Record<string, boolean> = {};
let PlayingOffAnimation: Record<string, boolean> = {};

system.runInterval(() => {
    const dimension = world.getDimension("overworld");
    const theentities = dimension.getEntities({ "type": "ng1:theentity", "tags": ["ng1:theentity"] });
    const { sectionConcat, } = getGlobalVariables();
    for (const theentity of theentities) {
        if (!theentity.isValid) return;
        if (sectionConcat >= sectionConcatValues.FallingAnimationStart) {
            if (PlayingOffAnimation[theentity.id] !== true) {
                if (!(theentity.id in theEntitiesAnimationCooldown) || theEntitiesAnimationCooldown[theentity.id] === 0) {
                    theEntitiesAnimationCooldown[theentity.id] = 25;
                } else {
                    theEntitiesAnimationCooldown[theentity.id]--;
                }
                if (theEntitiesAnimationCooldown[theentity.id] <= 0) {
                    if (AttackCooldownsGlobal(theentity.id) < 100) {
                        theentity.playAnimation("animation.theentity.summon_thunder");
                        AttackCooldownsGlobal(theentity.id, 18);
                        theEntitiesAnimationCooldown[theentity.id] = 45
                    } else {
                        theentity.playAnimation("animation.theentity.idle");
                    }
                }
            }
        }
        
        if (sectionConcat === sectionConcatValues.BattleIsSetUp) {
            PlayingOffAnimation[theentity.id] = false;
            WaitingToPlayOffAnimation[theentity.id] = false;
        }
        if (sectionConcat >= sectionConcatValues.FirstOff && WaitingToPlayOffAnimation[theentity.id] !== true) {
            WaitingToPlayOffAnimation[theentity.id] = true;
            system.runTimeout(() => {
                if (!theentity.isValid) return;
                theentity.playAnimation("animation.theentity.off");
                PlayingOffAnimation[theentity.id] = true;
            }, 60);
        }
    }
});