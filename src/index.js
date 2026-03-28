// index.js
import "./styles.css";
import "./reset.css";
import { Player } from "./player";
import { createPlayerBoard } from "./dom";

const MODES = {
  TWO_PLAYER: "TWO_PLAYER",
  EASY_CPU: "EASY_CPU",
  HARD_CPU: "HARD_CPU",
};
//initialize
// const MODES = {
//   TWO_PLAYER: {
//     name: "Player Two",
//     isCPU: false,
//   },
//   DUMB_CPU: {
//     label: "CPU",
//     isCPU: true,
//     takeTurn: () => cpuTurn("dumb")
//   },
//   HARD_CPU: {
//     label: "CPU",
//     isCPU: true,
//     takeTurn: () => cpuTurn("smart")
//   }

// }
const main = document.querySelector(".main");
const battlefieldOneHTML = document.querySelector(".battlefield-one");
const battlefieldTwoHTML = document.querySelector(".battlefield-two");

const gamemode = MODES.HARD_CPU;
const playerOne = new Player("one");
const playerTwo = new Player("two");
let cpuLastHitPos = null;
let cpuHitAxis = null;

populateBoard(playerOne.board);
populateBoard(playerTwo.board);
startGame(playerOne, playerTwo);

battlefieldTwoHTML.addEventListener("click", (e) => {
  let gameboardTwo = playerTwo.board;
  let tableOneHTML = document.querySelector(".battlefield-one table");
  let tableTwoHTML = document.querySelector(".battlefield-two table");
  let tileHTML = e.target.closest("td");
  if (!tileHTML) return;

  let x = tileHTML.dataset.x;
  let y = tileHTML.dataset.y;
  if (gameboardTwo.grid[y][x].hit) return;
  gameboardTwo.receiveAttack(x, y);
  tableTwoHTML.replaceWith(createPlayerBoard(playerTwo));

  if (gamemode === MODES.EASY_CPU) {
    easyCPUTurn();
  } else if (gamemode === MODES.HARD_CPU) {
    hardCPUTurn();
  } else {
    //indicate it is player Two's turn
    //enable clicking on Player One's board
    //disable clicking on player Two's board
  }
  tableOneHTML.replaceWith(createPlayerBoard(playerOne));
});

//dumb CPU strikes a random valid position.
function easyCPUTurn() {
  let gameboardOne = playerOne.board;
  let invalidAttack = true;
  while (invalidAttack) {
    let x = getRandomInt(gameboardOne.size - 1);
    let y = getRandomInt(gameboardOne.size - 1);
    let tile = gameboardOne.grid[y][x];
    if (tile.hit === false) {
      invalidAttack = false;
      gameboardOne.receiveAttack(x, y);
    }
  }
}

function hardCPUTurn() {
  let gameboardOne = playerOne.board;
  let gridOne = gameboardOne.grid;
  let validPosition;
  //if ship misses, strike another random tile
  if (cpuLastHitPos === null) {
    validPosition = getRandomPos(gridOne);
    let x = validPosition[0];
    let y = validPosition[1];
    gameboardOne.receiveAttack(x, y);
    if (gridOne[y][x].ship !== null) {
      cpuLastHitPos = [x, y];
    }
    return;
  } // if last hit was a ship, strike the next available adjacent tile

  let lastX = cpuLastHitPos[0];
  let lastY = cpuLastHitPos[1];
  if (!cpuHitAxis) validPosition = getAdjacentPos(lastX, lastY, gridOne);
  else {
    if (cpuHitAxis === "X") {
      validPosition = getAdjacentHorizontalPos(
        cpuLastHitPos[0],
        cpuLastHitPos[1],
        gridOne,
      );
    } else {
      validPosition = getAdjacentVerticalPos(
        cpuLastHitPos[0],
        cpuLastHitPos[1],
        gridOne,
      );
    }
  }
  if (validPosition) {
    let x = validPosition[0];
    let y = validPosition[1];
    gameboardOne.receiveAttack(x, y);
    //if a ship is struck, assign it to last position hit.
    if (gridOne[y][x].ship !== null) {
      cpuHitAxis = getRelativeAxis(x, y, cpuLastHitPos[0], cpuLastHitPos[1]);
      cpuLastHitPos = [x, y];
    }
  } else {
    //if all adjacent tiles have been struck and no ship has been hit, hit a random position
    validPosition = getRandomPos(gridOne);
    let x = validPosition[0];
    let y = validPosition[1];
    gameboardOne.receiveAttack(x, y); 
    cpuHitAxis = null;
    if (gridOne[y][x].ship !== null)
      cpuLastHitPos = [x,y];
    else
      cpuLastHitPos = null;
  }
}
function getAdjacentPos(x, y, grid) {
  const adjacentTiles = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  let validPosition = adjacentTiles.find((pos) => {
    let posX = pos[0];
    let posY = pos[1];
    if (posX >= grid.length || posY >= grid.length) return;
    if (posX < 0 || posY < 0) return;

    if (grid[posY][posX].hit) return false;
    else return true;
  });
  return validPosition;
}

function getAdjacentHorizontalPos(x, y, grid) {
  //keep going left of (x,y) until you reach a tile that hasnt been hit. if you reach an empty tile that has been hit,
  //check right and repeat.
  //if both sides have an empty tile that has been hit, return undefined
  let leftChecked = false;
  let currX = x;
  while (!leftChecked && currX >= 0) {
    let currTile = grid[y][currX];
    if (!currTile.hit) {
      return [currX, y];
    } else if (currTile.hit && currTile.ship === null) {
      leftChecked = true;
    }
    currX--;
  }
  currX = x;
  let rightChecked = false;
  while (!rightChecked && currX < grid.length) {
    let currTile = grid[y][currX];
    if (!currTile.hit) {
      return [currX, y];
    } else if (currTile.hit && currTile.ship === null) {
      rightChecked = true;
    }
    currX++;
  }
  return;
}

function getAdjacentVerticalPos(x, y, grid) {
  //keep going left of (x,y) until you reach a tile that hasnt been hit. if you reach an empty tile that has been hit,
  //check right and repeat.
  //if both sides have an empty tile that has been hit, return undefined
  let aboveChecked = false;
  let currY = y;
  while (!aboveChecked && currY >= 0) {
    let currTile = grid[currY][x];
    if (!currTile.hit) {
      return [x, currY];
    } else if (currTile.hit && currTile.ship === null) {
      aboveChecked = true;
    }
    currY--;
  }
  currY = y;
  let belowChecked = false;
  while (!belowChecked && currY < grid.length) {
    let currTile = grid[currY][x];
    if (!currTile.hit) {
      return [x, currY];
    } else if (currTile.hit && currTile.ship === null) {
      belowChecked = true;
    }
    currY++;
  }
  return;
}

//returns the axis that tiles (x,y) and (x2,y2) are both on
function getRelativeAxis(x, y, x2, y2) {
  if (x2 - x != 0) return "X";
  else if (y2 - y != 0) return "Y";
}

//returns a random valid tile
function getRandomPos(grid) {
  let invalidAttack = true;
  while (invalidAttack) {
    let x = getRandomInt(grid.length - 1);
    let y = getRandomInt(grid.length - 1);
    let tile = grid[y][x];
    if (tile.hit === false) {
      invalidAttack = false;
      return [x, y];
    }
  }
}

function startGame(player1, player2) {
  //indicate it is player One's turn
  //enable clicking on Player Two's board
  //disable clicking on player One's board
  battlefieldOneHTML.append(createPlayerBoard(player1));
  battlefieldTwoHTML.append(createPlayerBoard(player2));
}

function populateBoard(gameboard) {
  // gameboard.placeShipHorizontal(5, 0, 1);
  // gameboard.placeShipVertical(7, 0, 2);
  // gameboard.placeShipVertical(1, 1, 4);
  // gameboard.placeShipVertical(4, 2, 2);
  // gameboard.placeShipHorizontal(8, 3, 1);
  // gameboard.placeShipHorizontal(7, 5, 3);
  // gameboard.placeShipHorizontal(0, 6, 1);
  // gameboard.placeShipHorizontal(3, 7, 3);
  // gameboard.placeShipVertical(7, 9, 1);
  // gameboard.placeShipVertical(9, 8, 2);

  gameboard.placeShipVertical(5, 0, 1);
  gameboard.placeShipVertical(7, 0, 2);
  gameboard.placeShipVertical(1, 1, 4);
  gameboard.placeShipVertical(4, 2, 2);
  gameboard.placeShipVertical(8, 3, 1);
  gameboard.placeShipVertical(7, 5, 3);
  gameboard.placeShipVertical(0, 6, 1);
  gameboard.placeShipVertical(3, 7, 3);
  gameboard.placeShipVertical(7, 9, 1);
  gameboard.placeShipVertical(9, 8, 2);
  gameboard.placeShipVertical(5, 5, 2);
  gameboard.placeShipVertical(5, 8, 1);

  
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
