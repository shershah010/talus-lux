# Talis Lux
## Overview
Talis Lux is a little program that helps people play the table top rpg called `Tales From The Loop`. Once you start the application you should see three panels. One with the title `games`, another with a welcome tab, and the last with a textbox. The `+` sign on the left panel is used to create new games. Currently there is only support for `Tales From The Loop`, but I'll try to get DnD in there. Once a game is made, you can then click on the game name in the left panel. This should open a new tab with the game. In this tab, there is another `+` sign which you can use to create new players. Clicking on this will open up a create player tab. Just fill in the information and click `Create` to make a new player. Careful, the checkboxes have a bug that makes them hard to change their values. When you go back to the game tab, you will see your player there (You may need to reclick on the game name to see the player). Now, you can see some of the player's stats. If you double click on the player you will be able to edit the player. On the right panel you can roll dice. Here are examples of some inputs: `1d3` for one 3 sided die, `7d5` for seven 5 sided dice. If you single click on a player then you can use inputs such as `body` or `force` to roll a player's body or force. You can also do `tinker 2` to add a modifier of 2 or any other number you want. Rolling attributes or skills will return the number of successes or sixes that were rolled.
## Requirements
This package is build off of electron you will need that and the electron builder, both which you can get from npm. Also the compiled version is only for windows OS, but there is a way for it to run on any OS that electron supports.
## Start
To start the program, please do the following:
```
git clone "this package"
cd "folder (probably called talis lux)"
npm install
npm run package-win
```
Now there should be a folder called talis lux-win32-x64. In that folder, there should be an executable called `talus lux.exe`. Just run that and enjoy.
## Run on any OS
To run on any OS, you will need to change the `global.js` file. The `gamePath` and `typePath` currently have `../` in them. Remove these and you should be good. Now, do the following:
```
npm install
npm start
```
Now, if you want to run talis lux, you are going to have to use the terminal. Sorry about that, I'll try and get that fixed.
## Bugs
* The tabs might not always work as expected. Sometimes they don't get in focus when they are supposed to.
* The main content window might not always show updated information, especially when creating a new character. If this occurs, just click on the game name on the left hand screen. It should update the values.
* The DnD game type does not work. I still need to program that.
* The checkboxes take a few clicks to change.
