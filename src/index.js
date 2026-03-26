// index.js
import "./styles.css";
import "./reset.css";
import { Gameboard } from "./gameboard";
import { Player } from "./player";
import { Ship } from "./ship";

import { createPlayerBoard, updateBoard } from "./dom";

//initialize

const main = document.querySelector(".main");
const battlefieldOneHTML = document.querySelector(".battlefield-one");
const playerOne = new Player("one");
const gameBoardOne = playerOne.board;
gameBoardOne.placeShipHorizontal(5,0,1);
gameBoardOne.placeShipVertical(7,0,2);
gameBoardOne.placeShipVertical(1,1,4);
gameBoardOne.placeShipVertical(4,2,2);
gameBoardOne.placeShipHorizontal(8,3,1);
gameBoardOne.placeShipHorizontal(7,5,3);
gameBoardOne.placeShipHorizontal(0,6,1);
gameBoardOne.placeShipHorizontal(3,7,3);
gameBoardOne.placeShipVertical(7,9,1);
gameBoardOne.placeShipVertical(9,8,2);
battlefieldOneHTML.append(createPlayerBoard(playerOne));

const battlefieldTwoHTML = document.querySelector(".battlefield-two");
const playerTwo = new Player("two");
const gameBoardTwo = playerTwo.board;
gameBoardTwo.placeShipHorizontal(5,0,1);
gameBoardTwo.placeShipVertical(7,0,2);
gameBoardTwo.placeShipVertical(1,1,4);
gameBoardTwo.placeShipVertical(4,2,2);
gameBoardTwo.placeShipHorizontal(8,3,1);
gameBoardTwo.placeShipHorizontal(7,5,3);
gameBoardTwo.placeShipHorizontal(0,6,1);
gameBoardTwo.placeShipHorizontal(3,7,3);
gameBoardTwo.placeShipVertical(7,9,1);
gameBoardTwo.placeShipVertical(9,8,2);
battlefieldTwoHTML.append(createPlayerBoard(playerTwo));

// console.log(document.querySelector(`td[data-x="0"][data-y="1"]`));
updateBoard(gameBoardOne);


