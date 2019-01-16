const fs = require('fs'); // allows for file I/O
const gamePath = "games"; // the game path
const typePath = "types"; // the type path
let games = {}; // holds all the games, indexed by game name
let tabs = {}; // holds all the open tabs (DOM object)
let tabLevel = 1; // number of total tabs created
let selectedPlayer = null; // the selected player

function rollDice(numDice, range) {
    let output = "";
    for (let i = 0; i < numDice; i += 1) {
        output += Math.floor((Math.random() * range) + 1) + " ";
    }
    return output;
}
