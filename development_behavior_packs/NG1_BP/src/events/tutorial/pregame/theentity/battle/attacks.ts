import { world, system, EntityComponentTypes, } from "@minecraft/server";
import { getGlobalVariables, } from "../../../../../helpers/global/global_functions";
export { AttackCooldownsGlobal, };

enum sectionConcatValues {
    ReadyToAppear = 103,
    StartBattle = 106,
    BattleIsSetUp = 107,
    FirstOff = 108,
    SecondOff = 109,
    Disabled = 110,
}

enum AttackCooldownSpecialValues {
    SetWithoutAttacking = -1,
    SetDisabled = -2,
    SetEnabled = -3,
}

let AttackCooldowns: Record<string, number> = {};
let AttackCounter = 0;

/**
 * Returns the value of AttackCooldowns. Has an optional parameter to set the value.
 * @param id id to get the value from.
 * @param value value to set to the given id.
 */
function AttackCooldownsGlobal(id: string, value?: number): number {
    if (value) AttackCooldowns[id] = value;
    return AttackCooldowns[id];
}

system.runInterval(() => {
    if (world.getPlayers({"tags": ["dialog-on_restart"]}).length === 0) {
        const dimension = world.getDimension("overworld");
        const theentities = dimension.getEntities({ "type": "ng1:theentity", "tags": ["ng1:theentity"] });
        const { globalVariables, sectionConcat, } = getGlobalVariables();

        if (sectionConcat === sectionConcatValues.StartBattle) {
            for (const theentity of theentities) {
                theentity.teleport({ x: 150.0, y: 9.0, z: 51.0 }, { "rotation": { x: 0, y: 90 } });
            }

            globalVariables.setScore("sectionConcat", sectionConcatValues.BattleIsSetUp);
        }

        if (sectionConcat === sectionConcatValues.BattleIsSetUp) {
            for (const theentity of theentities) {
                if (!(theentity.id in AttackCooldowns)) {
                    AttackCooldowns[theentity.id] = AttackCooldownSpecialValues.SetWithoutAttacking;
                }

                for (const theentity of theentities) {
                    if (AttackCooldowns[theentity.id] > 0) {
                        AttackCooldowns[theentity.id]--;
                    } else {
                        if (!(AttackCooldowns[theentity.id] === AttackCooldownSpecialValues.SetWithoutAttacking)) {
                            const randomPlayer = Math.round(Math.random() * (world.getAllPlayers().length - 1));
                            const player = world.getAllPlayers()[randomPlayer];

                            const HealthRef = player.getComponent(EntityComponentTypes.Health) as any;
                            const Health = HealthRef?.currentValue;
                            if (typeof Health === "number" && Health > 5) {
                                dimension.spawnEntity("minecraft:lightning_bolt", player.location);
                                AttackCooldowns[theentity.id] = AttackCooldownSpecialValues.SetEnabled;
                                AttackCounter++;

                                const AttackCalculated = Math.ceil(world.getAllPlayers().length / 3);
                                if (AttackCounter >= AttackCalculated * 3) {
                                    globalVariables.setScore("sectionConcat", sectionConcatValues.Disabled);
                                } else if (AttackCounter >= AttackCalculated * 2) {
                                    globalVariables.setScore("sectionConcat", sectionConcatValues.SecondOff);
                                } else if (AttackCounter >= AttackCalculated) {
                                    globalVariables.setScore("sectionConcat", sectionConcatValues.FirstOff);
                                }
                            } else {
                                AttackCooldowns[theentity.id] = AttackCooldownSpecialValues.SetDisabled;
                            }
                        }

                        if (!(AttackCooldowns[theentity.id] === AttackCooldownSpecialValues.SetDisabled)) {
                            AttackCooldowns[theentity.id] = (Math.round(Math.random() * 10) + 10) * 20;
                        }
                    }
                }
            }
        }
    }
});