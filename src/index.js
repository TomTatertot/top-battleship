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
const battlefieldTwoHTML = document.querySelector(".battlefield-two");

const playerOne = new Player("one");
const playerTwo = new Player("two");
const gameboardOne = playerOne.board;
const gameboardTwo = playerTwo.board;


populateBoard(gameboardOne);
populateBoard(gameboardTwo);
startGame(playerOne, playerTwo);

battlefieldTwoHTML.addEventListener("click", (e) => {
  let tableHTML = e.target.closest("table");
  let tileHTML = e.target.closest("td");
  if (!tileHTML) return;

  let x = tileHTML.dataset.x;
  let y = tileHTML.dataset.y;
  gameboardTwo.receiveAttack(x, y);
  tableHTML.replaceWith(createPlayerBoard(playerTwo));
});

function startGame(player1, player2) {
  battlefieldOneHTML.append(createPlayerBoard(player1));
  battlefieldTwoHTML.append(createPlayerBoard(player2));
}

function populateBoard(gameboard) {
  gameboard.placeShipHorizontal(5, 0, 1);
  gameboard.placeShipVertical(7, 0, 2);
  gameboard.placeShipVertical(1, 1, 4);
  gameboard.placeShipVertical(4, 2, 2);
  gameboard.placeShipHorizontal(8, 3, 1);
  gameboard.placeShipHorizontal(7, 5, 3);
  gameboard.placeShipHorizontal(0, 6, 1);
  gameboard.placeShipHorizontal(3, 7, 3);
  gameboard.placeShipVertical(7, 9, 1);
  gameboard.placeShipVertical(9, 8, 2);
}
