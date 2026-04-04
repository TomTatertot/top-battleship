// index.js
import "./styles.css";
import "./reset.css";
import { Player } from "./player";
import {
  createPlayerBoard,
  createShip,
  highlightHorizontalPlacement,
  highlightVerticalPlacement,
  removeHighlights,
} from "./dom";

const MODES = {
  TWO_PLAYER: "TWO_PLAYER",
  EASY_CPU: "EASY_CPU",
  HARD_CPU: "HARD_CPU",
};

const main = document.querySelector("main");
const fleetHTML = document.querySelector(".fleet");
const battlefieldOneHTML = document.querySelector(".battlefield-one");
const battlefieldTwoHTML = document.querySelector(".battlefield-two");
const randomizeButton = document.querySelector(".random");

const shipLengths = [5, 4, 4, 3, 2];
const gamemode = MODES.HARD_CPU;
const playerOne = new Player("one");
const playerTwo = new Player("two");
const currentPlayerTurn = playerOne;
let cpuLastHitPos = null;
let cpuHitAxis = null;

// shipLengths.forEach((shipLength) => {
//   fleetHTML.append("afterbegin",createShip(shipLength));
// });

for (let i = shipLengths.length - 1; i >= 0; i--) {
  fleetHTML.insertAdjacentElement("afterbegin", createShip(shipLengths[i]));
}

const ships = document.querySelectorAll(".ship");
const battlefields = document.querySelectorAll(".battlefield-container");
let offsetX;
let offsetY;
const PLACEMENT_MODE = {
  HORIZONTAL: {
    id: "HORIZONTAL",
    isValid: function (x, y, shipSize, gameboard) {
      return gameboard.isHorizontalPlacementValid(x, y, shipSize);
    },
    highlightPlacement: function (x, y, shipSize, valid) {
      highlightHorizontalPlacement(x, y, shipSize, valid);
    },
    placeShip: function (x, y, shipSize, gameboard) {
      gameboard.placeShipHorizontal(x, y, shipSize);
    },
  },
  VERTICAL: {
    id: "VERTICAL",
    isValid: function (x, y, shipSize, gameboard) {
      return gameboard.isVerticalPlacementValid(x, y, shipSize);
    },
    highlightPlacement: function (x, y, shipSize, valid) {
      highlightVerticalPlacement(x, y, shipSize, valid);
    },
    placeShip: function (x, y, shipSize, gameboard) {
      gameboard.placeShipVertical(x, y, shipSize);
    },
  },
};
let placementMode = PLACEMENT_MODE.HORIZONTAL;
ships.forEach((ship) => {
  ship.addEventListener("dragstart", (e) => {
    let ship = e.target;
    let rect = ship.getBoundingClientRect();
    let shipSize = parseInt(ship.dataset.size);
    offsetX = e.clientX - rect.left - rect.width / 2 / shipSize;
    offsetY = e.clientY - rect.top - rect.height / 2;
    ship.classList.add("dragging");
  });

  ship.addEventListener("drag", (e) => {
    const ship = e.target;
    let tile;
    if (placementMode.id === "VERTICAL") {
      tile = document.elementFromPoint(e.clientX, e.clientY);
    } else {
      tile = document.elementFromPoint(
        e.clientX - offsetX,
        e.clientY - offsetY,
      );
    }
    removeHighlights();
    if (tile === null || tile.tagName != "TD") return;

    let x = parseInt(tile.dataset.x);
    let y = parseInt(tile.dataset.y);
    let shipSize = parseInt(ship.dataset.size);
    let valid = placementMode.isValid(x, y, shipSize, currentPlayerTurn.board);
    placementMode.highlightPlacement(x, y, shipSize, valid);
  });

  ship.addEventListener("dragend", (e) => {
    const ship = e.target;
    ship.classList.remove("dragging");
    const tile = document.elementFromPoint(
      e.clientX - offsetX,
      e.clientY - offsetY,
    );
    if (tile === null || tile.tagName != "TD") return;
    let x = parseInt(tile.dataset.x);
    let y = parseInt(tile.dataset.y);
    let shipSize = parseInt(ship.dataset.size);
    let table = document.querySelector(
      `.battlefield-${currentPlayerTurn.name} table`,
    );
    console.log(table);
    let valid = placementMode.isValid(x, y, shipSize, currentPlayerTurn.board);
    placementMode.placeShip(x, y, shipSize, currentPlayerTurn.board);

    if (valid) {
      ship.style.visibility = "hidden";
    }
    table.replaceWith(createPlayerBoard(currentPlayerTurn));
  });
});

randomizeButton.addEventListener("click", () => {
  const board = currentPlayerTurn.board;
  board.clear();
  let tableHTML = document.querySelector(
    `.battlefield-${currentPlayerTurn.name} table`,
  );

  for (let i = 0; i < shipLengths.length; i++) {
    let placementMode;
    let randomNum = getRandomInt(2);
    let invalidPlacement = true;
    if (randomNum === 0) placementMode = PLACEMENT_MODE.HORIZONTAL;
    else placementMode = PLACEMENT_MODE.VERTICAL;

    while (invalidPlacement) {
      let x = getRandomInt(board.size);
      let y = getRandomInt(board.size);
      if (placementMode.isValid(x, y, shipLengths[i], board)) {
        placementMode.placeShip(x, y, shipLengths[i], board);
        invalidPlacement = false;
      }
    }
  }

  ships.forEach(ship => {
    ship.style.visibility = 'hidden';
  })

  tableHTML.replaceWith(createPlayerBoard(currentPlayerTurn));
});

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
  let randomPos = getRandomPos(gameboardOne.grid);
  gameboardOne.receiveAttack(randomPos[0], randomPos[1]);
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
      validPosition = getAdjacentHorizontalPos(lastX, lastY, gridOne);
    } else {
      validPosition = getAdjacentVerticalPos(lastX, lastY, gridOne);
    }
  }
  if (validPosition) {
    let x = validPosition[0];
    let y = validPosition[1];
    gameboardOne.receiveAttack(x, y);
    //if a ship is struck, assign it to last position hit.
    if (gridOne[y][x].ship !== null) {
      cpuHitAxis = getRelativeAxis(x, y, lastX, lastY);
      cpuLastHitPos = [x, y];
    }
  } else {
    //if all adjacent tiles have been struck and no ship has been hit, hit a random position
    validPosition = getRandomPos(gridOne);
    let x = validPosition[0];
    let y = validPosition[1];
    gameboardOne.receiveAttack(x, y);
    cpuHitAxis = null;
    if (gridOne[y][x].ship !== null) cpuLastHitPos = [x, y];
    else cpuLastHitPos = null;
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
  //iterate through tiles above (x,y) until you reach a tile that hasnt been hit. if you reach an empty hit tile,
  //check below (x,y) and repeat.
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
  // battlefieldTwoHTML.append(createPlayerBoard(player2));
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
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
