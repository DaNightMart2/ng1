# The official Night Games 1 Minecraft: Bedrock Edition resource and behavior pack.

## Side Note -
- This is a passion project made by an intermediate programmer. Therefore, the code, writing, etc. may not be the greatest.

## State of the Project -
- The project is still in-development, so many things are unfinished.

- There has not been any thorough testing yet, so you may encounter bugs. Testing should start on november 2026.

## Credits -
* Full credits are given in-game.

- All maps and most textures were made by a friend of mine, @FeeerLAT (on YouTube).

- All the code, UI and some textures were made by me.

- All music is taken from UNDERTALE, DELTARUNE or Dream Productions.

## How to Use It Yourself -
* This may be obvious, but you must have Minecraft: Bedrock Edition installed for this to work. On Android, the process is a little different, as there is no %AppData% folder, but once you reach the com.mojang folder the process is the same.

* You must have version 1.21.60 or higher for the add-on to work properly.

* The world was made in version 1.21.111 (if I am not mistaken), so you must be in that version or higher for the world to load properly.

* It is not required to use the world for everything to work, but the event is made to work with this specific world and its coordinates for everything, so I recommend it is used.

* Last update to the world: Thursday 09/07/2026.

- Download the behavior and resource packs from this repository, and if you want everything to work as expected also download the world (I will continue the guide supposing you have downloaded the world as well).

- Place the behavior pack folder inside ```%AppData%/Minecraft Bedrock/Users/Shared/games/com.mojang/development_behavior_packs```.

- Place the resource pack folder inside ```%AppData%/Minecraft Bedrock/Users/Shared/games/com.mojang/development_resource_packs```.

- If needed, rename the folders "BP" and "RP" to whatever you want, it does not matter.

- Open the world file (.mcworld) with Minecraft: Bedrock Edition or open the game and go to Play > Import world and select the world file.

- In the game, go to Settings > Storage and check that the resource and behavior pack are installed, as well as the world.

- Open the world and make sure that both resource and behavior packs enabled.

- Remember to set all players to "Visitor", including yourself if you plan to play.

## Issues -
- If the "/reload" command is used in-game, the dialog system will be reset. Therefore, if a player was mid-way through a dialogue sequence, all the dialogues that were scheduled to show after the current one would be removed.

- If simple graphics is chosen in-game by a player, some animations may play with a small delay for them, or not be played at all. This also happens with others graphic types but very occasionally.

- If a player has the chat or exit menu open, dialogues do not play. This could be considered as a way to skip dialogues rather than a bug, but I am adding it here because I do not want to people to believe it is on purpose, as if I ever find a fix to this I will add it.

- Cutscenes work on system.runTimeouts, which work on runTime, so the "/reload" command will stop all cutscenes from continuing.

## For Testers -
- All cutscenes and most events work with various checks, so manually changing a scoreboard value may break some things, as that was not intended to happen.

- If you want to have the "admin" role, write the following command in chat: ```tag @s add admin```. This will add a tag to yourself that I used, while coding, to give myself some admin priviliges, the main one being that when an admin uses the command "/reload" in chat they can choose wether to reset the event, reset the language choosing and teleport everyone back to the start.