import { EasingType, system, world, } from "@minecraft/server";
import { getGlobalVariables, setMovement, } from "../../../../../helpers/global/global_functions";

enum sectionConcatValues {
    BattleIsSetUp = 107,
    FirstOff = 108,
    SecondOff = 109,
    Disabled = 110,
    TheEntityFled = 111,
}

enum missionValues {
    BattleRegular = 3,
    BattleShutdown = 4,
    BattleEnding = 5,
}

let OnCutscene: Record<string, boolean> = {};
let ExecutedCutscenes: Record<string, {
    FirstCutscene: boolean,
    SecondCutscene: boolean,
    ThirdCutscene: boolean,
}> = {}

system.runInterval(() => {
    const { sectionConcat, } = getGlobalVariables();

    for (const player of world.getAllPlayers()) {
        if (world.getPlayers({"tags": ["dialog-on_restart"]}).length === 0) {
            if (!(player.id in OnCutscene)) {
                OnCutscene[player.id] = false;
            }

            if (!(player.id in ExecutedCutscenes)) {
                ExecutedCutscenes[player.id] = {
                    FirstCutscene: false,
                    SecondCutscene: false,
                    ThirdCutscene: false,
                }
            }

            if (OnCutscene[player.id] === false) {
                const globalVariables = getGlobalVariables().globalVariables;

                if (!ExecutedCutscenes[player.id].FirstCutscene && sectionConcat === sectionConcatValues.FirstOff) {
                    globalVariables.setScore("mission", missionValues.BattleShutdown);

                    OnCutscene[player.id] = true;
                    ExecutedCutscenes[player.id].FirstCutscene = true;
                    system.runTimeout(() => {
                        setMovement(player, false);
                        player.camera.setCamera("minecraft:free", { "location": { x: 142, y: 10.8, z: 51.0 }, "rotation": { x: 0, y: -90 } });
                        player.camera.setCamera("minecraft:free", { "location": { x: 147, y: 10.8, z: 51.0 }, "rotation": { x: 0, y: -90 }, "easeOptions": { "easeTime": 5, "easeType": EasingType.InOutCubic } });
                    }, 60);

                    system.runTimeout(() => {
                        player.camera.clear();
                        setMovement(player, true);
                        OnCutscene[player.id] = false;
                    }, 200);
                }

                if (!ExecutedCutscenes[player.id].SecondCutscene && sectionConcat === sectionConcatValues.SecondOff) {
                    globalVariables.setScore("mission", missionValues.BattleShutdown);

                    OnCutscene[player.id] = true;
                    ExecutedCutscenes[player.id].SecondCutscene = true;
                    system.runTimeout(() => {
                        setMovement(player, false);
                        player.camera.setCamera("minecraft:free", { "location": { x: 142, y: 10.8, z: 51.0 }, "rotation": { x: 0, y: -90 } });
                        player.camera.setCamera("minecraft:free", { "location": { x: 147, y: 10.8, z: 51.0 }, "rotation": { x: 0, y: -90 }, "easeOptions": { "easeTime": 5, "easeType": EasingType.InOutCubic } });
                    }, 60);

                    system.runTimeout(() => {
                        player.camera.clear();
                        setMovement(player, true);
                        OnCutscene[player.id] = false;
                    }, 200);
                }

                if (!ExecutedCutscenes[player.id].ThirdCutscene && sectionConcat === sectionConcatValues.Disabled) {
                    globalVariables.setScore("mission", missionValues.BattleShutdown);

                    OnCutscene[player.id] = true;
                    ExecutedCutscenes[player.id].ThirdCutscene = true;
                    system.runTimeout(() => {
                        setMovement(player, false);
                        player.camera.setCamera("minecraft:free", { "location": { x: 142, y: 10.8, z: 51.0 }, "rotation": { x: 0, y: -90 } });
                        player.camera.setCamera("minecraft:free", { "location": { x: 147, y: 10.8, z: 51.0 }, "rotation": { x: 0, y: -90 }, "easeOptions": { "easeTime": 5, "easeType": EasingType.InOutCubic } });
                    }, 60);

                    system.runTimeout(() => {
                        player.camera.clear();
                        setMovement(player, true);
                        OnCutscene[player.id] = false;
                    }, 200);
                }
            }
        }
    }
});

world.afterEvents.playerInteractWithEntity.subscribe(data => {
    const dimension = world.getDimension("overworld");
    const { globalVariables, sectionConcat, } = getGlobalVariables();
    let CutsceneLength = 50;

    if (sectionConcat >= sectionConcatValues.FirstOff && sectionConcat <= sectionConcatValues.Disabled) {
        if (data.target.typeId === "ng1:theentity" && data.target.hasTag("ng1:theentity")) {
            const playerActor = world.getAllPlayers()[0];
            playerActor.runCommand("spreadplayers 128 51 5 15 @a 3");

            for (const player of world.getAllPlayers()) {
                setMovement(player, false);

                player.camera.setCamera("minecraft:free", { "location": { x: 147, y: 10.8, z: 51.0 }, "rotation": { x: 0, y: -90 } });

                const theentities = dimension.getEntities({ "type": "ng1:theentity", "tags": ["ng1:theentity"] });
                for (const theentity of theentities) {
                    dimension.spawnParticle("minecraft:dragon_death_explosion_emitter", theentity.location);
                    dimension.playSound("random.explode", theentity.location, {"volume": 40.0});

                    if (sectionConcat === sectionConcatValues.Disabled) {
                        theentity.playAnimation("animation.theentity.flee");
                        CutsceneLength = 80;

                        system.runTimeout(() => {
                            theentity.setRotation({x: 0, y: -90});
                            const TheEntityFlee = system.runInterval(() => {
                                theentity.teleport({
                                    x: theentity.location.x + 0.2,
                                    y: theentity.location.y,
                                    z: theentity.location.z
                                });

                                if (theentity.location.x >= 156) {
                                    system.clearRun(TheEntityFlee);
                                    theentity.teleport({x: 161.0, y: 9.0, z: 51.0});
                                }
                            }, 2);

                            system.runTimeout(() => {
                                globalVariables.setScore("sectionConcat", sectionConcatValues.TheEntityFled);
                                world.structureManager.place(
                                    "ng1:exp_closed_exit/open",
                                    dimension,
                                    {x: 154, y: 9, z: 49},
                                );
                            }, 5);
                        }, 30);
                    } else {
                        theentity.playAnimation("animation.theentity.on");
                        CutsceneLength = 50;
                    }
                }

                system.runTimeout(() => {
                    player.camera.clear();
                    setMovement(player, true);
                    if (sectionConcat === sectionConcatValues.Disabled) {
                        globalVariables.setScore("mission", missionValues.BattleEnding);
                    } else {
                        globalVariables.setScore("sectionConcat", sectionConcatValues.BattleIsSetUp);
                        globalVariables.setScore("mission", missionValues.BattleRegular);
                    }
                }, CutsceneLength);
            }
        }
    }
});