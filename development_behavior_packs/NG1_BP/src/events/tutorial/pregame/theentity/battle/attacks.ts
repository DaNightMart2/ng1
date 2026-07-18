import { world, system, EntityComponentTypes, } from "@minecraft/server";
import { getGlobalVariables } from "../../../../../helpers/global/global_functions";

enum sectionConcatValues {
    ReadyToAppear = 103,
    StartBattle = 106,
    BattleIsSetUp = 107,
}

let AttackCooldown = -1;
// -1 is used to make the variable be set without actually attacking.

system.runInterval(() => {
    const dimension = world.getDimension("overworld");
    const { globalVariables, sectionConcat, } = getGlobalVariables();

    if (sectionConcat === sectionConcatValues.StartBattle) {
        const theentities = dimension.getEntities({"type": "ng1:theentity", "tags": ["ng1:theentity"]});

        for (const theentity of theentities) {
            theentity.teleport({x: 150.0, y: 9.0, z: 51.0}, {"rotation": {x: 0, y: 90}});
        }

        globalVariables.setScore("sectionConcat", sectionConcatValues.BattleIsSetUp);
    }

    if (sectionConcat === sectionConcatValues.BattleIsSetUp) {
        if (AttackCooldown > 0) {
            AttackCooldown--;
        }
        else {
            if (!(AttackCooldown < 0)) {
                const randomPlayer = Math.round(Math.random() * (world.getAllPlayers().length-1));
                const player = world.getAllPlayers()[randomPlayer];

                const HealthRef = player.getComponent(EntityComponentTypes.Health) as any;
                const Health = HealthRef?.currentValue;
                if (typeof Health === "number" && Health > 5) {
                    dimension.spawnEntity("minecraft:lightning_bolt", player.location);
                } else {
                    dimension.spawnEntity("minecraft:lightning_bolt", {x: 136.0, y: 21.0, z: 51.0});
                }
            }

            AttackCooldown = (Math.round(Math.random() * 6) + 4) * 20;
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