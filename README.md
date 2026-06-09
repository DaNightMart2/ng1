# The official Night Games 1 Minecraft: Bedrock Edition resource pack, behavior pack and world.

## Important side notes:
- If the "/reload" command is used in-game, the dialog system will be reset. Therefore, if a player was mid-way through a dialogue sequence, all the dialogues that were scheduled to show after the current one would be removed.
- Some time based events (events that have wait times) work on system.runTimeout, so a "/reload" will stop them. Still, this only happens with some time based events.
- The "/reload all" command stops all animations, but they should play again
- If simple graphics is chosen in-game by a player, they may see some animations delayed or not see them at all. Based on my research, this happens because simple graphics only play animations that are visible by the player, so they may start delayed if the animated entity is not in the render distance of a player.

## State of the project
- The project is still in-development, so many things are unfinished.
- There hasn't been any thorugh testing yet, so you may encounter bugs.
