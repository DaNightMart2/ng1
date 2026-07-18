import { world, system, EntityComponentTypes, } from "@minecraft/server";
import { getGlobalVariables } from "../../../../../helpers/global/global_functions";
import { theentity_dialog_sequence } from "../../../../../dialogues/theentity_dialogs";

enum sectionConcatValues {
    ReadyToAppear = 103,
    StartBattle = 106,
    BattleIsSetUp = 107,
}

enum AttackCooldownSpecialValues {
    SetWithoutAttacking = -1,
    DisableSet = -2,
}

let AttackCooldowns: Record<string, number> = {};

system.runInterval(() => {
    const dimension = world.getDimension("overworld");
    const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});
    const { globalVariables, sectionConcat, } = getGlobalVariables();

    if (sectionConcat === sectionConcatValues.StartBattle) {
        for (const theentity of theentities) {
            theentity.teleport({x: 150.0, y: 9.0, z: 51.0}, {"rotation": {x: 0, y: 90}});
        }

        globalVariables.setScore("sectionConcat", sectionConcatValues.BattleIsSetUp);
    }

    for (const theentity of theentities) {
        if (!(theentity.id in AttackCooldowns)) {
            AttackCooldowns[theentity.id] = AttackCooldownSpecialValues.SetWithoutAttacking;
        }
    }

    if (sectionConcat === sectionConcatValues.BattleIsSetUp) {
        for (const theentity of theentities) {
            let AttackCooldown = AttackCooldowns[theentity.id];

            if (AttackCooldown > 0) {
                AttackCooldown--;
            }
            else {
                if (!(AttackCooldown === AttackCooldownSpecialValues.SetWithoutAttacking)) {
                    const randomPlayer = Math.round(Math.random() * (world.getAllPlayers().length-1));
                    const player = world.getAllPlayers()[randomPlayer];

                    const Health = player.getComponent(EntityComponentTypes.Health)?.currentValue;
                    if (typeof Health === "number" && Health > 5) {
                        dimension.spawnEntity("minecraft:lightning_bolt", player.location);
                    } else {
                        AttackCooldown = AttackCooldownSpecialValues.DisableSet;
                    }
                }

                if (AttackCooldown !== AttackCooldownSpecialValues.DisableSet) {
                    AttackCooldown = (Math.round(Math.random() * 6) + 4) * 20;
                }
            }
        }
    }
});

let theEntitiesAnimationCooldown: Record<string, number> = {};
system.runInterval(() => {
    const sectionConcat = getGlobalVariables().sectionConcat;
    if (sectionConcat >= sectionConcatValues.ReadyToAppear) {
        const dimension = world.getDimension("overworld");
        const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});

        for (const theentity of theentities) {
            if (!(theentity.id in theEntitiesAnimationCooldown) || theEntitiesAnimationCooldown[theentity.id] === 0) {
                theEntitiesAnimationCooldown[theentity.id] = 25;
            } else {
                theEntitiesAnimationCooldown[theentity.id]--;
            }
            if (theEntitiesAnimationCooldown[theentity.id] <= 0) {
                theentity.playAnimation("animation.theentity.idle");
            }
        }
    }
});

// theentity.playAnimation("animation.theentity.summon_thunder");