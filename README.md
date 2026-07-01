# The official Night Games 1 Minecraft: Bedrock Edition resource and behavior pack.

## Side note:
- This is a passion project. Therefore, the code, writing, etc. may not be the greatest.

## Known issues:
- If the "/reload" command is used in-game, the dialog system will be reset. Therefore, if a player was mid-way through a dialogue sequence, all the dialogues that were scheduled to show after the current one would be removed. I do not plan to fix this as it would require some form of server, which I am not planning to add.
- Some time based events (events that have wait times) work on system.runTimeout, so a "/reload" will stop them. Still, this only happens with some time based events. I am not planning on fixing this, as it would take a long time because there are many occurences of this along many different files.
- If simple graphics is chosen in-game by a player, they may see some animations delayed or not see them at all. Based on my research, this happens because simple graphics only plays animations that are visible by the player, so they may start delayed if the animated entity is not in the render distance of a player.
- If a player has the chat or exit menu open, dialogues do not play. As far as I know, there is no fix to this, as it is a Minecraft issue.

## State of the project
- The project is still in-development, so many things are unfinished.
- There hasn't been any thorugh testing yet, so you may encounter bugs. Testing starts on november 2026.