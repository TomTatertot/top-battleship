import { Gameboard } from "./gameboard";
import { Player } from "./player";
import { Ship } from "./ship";

import { createPlayerBoard } from "./dom";

//initialize

const main = document.querySelector(".main");
const player1 = document.querySelector(".player-one-board");
console.log(player1);
player1.append(createPlayerBoard);
// main.append(createPlayerBoard());