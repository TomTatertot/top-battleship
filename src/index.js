// index.js
import "./styles.css";
import "./reset.css";
import { Player } from "./player";
import {
  createPlayerBoard,
  createShip,
  createPlacementScreen,
  createBattleScreen,
  createPlayerSwapScreen,
  createHeader,
  createTitleScreen,
  createGamemodeSelectionScreen,
  highlightHorizontalPlacement,
  highlightVerticalPlacement,
  removeHighlights,
} from "./dom";

const MODES = {
  TWO_PLAYER: "TWO_PLAYER",
  EASY_CPU: "EASY_CPU",
  HARD_CPU: "HARD_CPU",
};

const body = document.querySelector("body");
const main = document.querySelector("main");
const shipLengths = [5, 4, 4, 3, 2, 1];
let gamemode = MODES.HARD_CPU;
let playerOne = new Player("one");
let playerTwo = new Player("two");
let currentPlayerTurn = playerOne;
let nextPlayer = playerTwo;
let cpuLastHitPos = null;
let cpuHitAxis = null;
let dragOffsetX;
let dragOffsetY;
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

loadTitleScreen();

function loadTitleScreen() {
  main.append(createTitleScreen());
  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", () => {loadGamemodeSelectionScreen()});
}

function loadGamemodeSelectionScreen(){
  main.innerHTML = "";
  main.append(createGamemodeSelectionScreen());
  const easyCPUButton = document.querySelector(".easy-cpu-button");
  const hardCPUButton = document.querySelector(".hard-cpu-button");
  const coopButton = document.querySelector(".coop-button");

  easyCPUButton.addEventListener("click", ()=> {
    gamemode = MODES.EASY_CPU;
    loadPlacementScreen();
  })
  hardCPUButton.addEventListener("click", ()=> {
    gamemode = MODES.HARD_CPU;
    loadPlacementScreen();
  })
  coopButton.addEventListener("click", ()=> {
    gamemode = MODES.TWO_PLAYER;
    loadPlacementScreen();
  })
}
function loadPlacementScreen() {
  main.innerHTML = "";
  main.append(createPlacementScreen(currentPlayerTurn.name));

  const battlefield = document.querySelector(".battlefield");
  battlefield.append(createPlayerBoard(currentPlayerTurn));

  const fleetHTML = document.querySelector(".fleet");
  const randomizeButton = document.querySelector(".random");
  const rotateButton = document.querySelector(".rotate");
  const resetButton = document.querySelector(".reset");
  const confirmButton = document.querySelector(".confirm");

  for (let i = shipLengths.length - 1; i >= 0; i--) {
    fleetHTML.insertAdjacentElement("afterbegin", createShip(shipLengths[i]));
  }
  const ships = document.querySelectorAll(".ship");
  ships.forEach((ship) => {
    ship.addEventListener("dragstart", (event) => onDragStart(event));
    ship.addEventListener("drag", (event) => onDrag(event));
    ship.addEventListener("dragend", (event) => onDragEnd(event));
  });
  rotateButton.addEventListener("click", () => onRotate());
  resetButton.addEventListener("click", () => onReset(ships));
  randomizeButton.addEventListener("click", () => onRandomize(ships));
  confirmButton.addEventListener("click", () => onConfirmPlacement());
}

function loadBattleScreen() {
  console.log(playerOne.board.ships);
  console.log(playerTwo.board.ships);

  const header = document.querySelector("header");
  if (header !== null)
    header.remove();
  body.insertAdjacentElement("afterbegin",createHeader());
  main.innerHTML = "";

  main.append(createBattleScreen(currentPlayerTurn.name, nextPlayer.name, gamemode));
  const alliedFleetHTML = document.querySelector(".battlefield-one");
  const enemyFleetHTML = document.querySelector(".battlefield-two");
  alliedFleetHTML.append(createPlayerBoard(currentPlayerTurn));
  enemyFleetHTML.append(createPlayerBoard(nextPlayer, true));

  enemyFleetHTML.addEventListener("click", (e) => {
    let enemyBoard = nextPlayer.board;
    let alliedTableHTML = document.querySelector(".battlefield-one table");
    let enemyTableHTML = document.querySelector(".battlefield-two table");
    let tileHTML = e.target.closest("td");
    if (!tileHTML) return;

    let x = tileHTML.dataset.x;
    let y = tileHTML.dataset.y;
    const hitTile = enemyBoard.grid[y][x];

    if (hitTile.hit) return;
    enemyBoard.receiveAttack(x, y);
    if (hitTile.ship !== null) {
      enemyTableHTML.replaceWith(createPlayerBoard(nextPlayer, true));
      return;
    }
    enemyTableHTML.replaceWith(createPlayerBoard(nextPlayer));
    if (gamemode === MODES.EASY_CPU) {
      easyCPUTurn();
      alliedTableHTML.replaceWith(createPlayerBoard(currentPlayerTurn));
    } else if (gamemode === MODES.HARD_CPU) {
      hardCPUTurn();
      alliedTableHTML.replaceWith(createPlayerBoard(currentPlayerTurn));
    } else {
      [currentPlayerTurn, nextPlayer] = [nextPlayer, currentPlayerTurn];
      loadSwapScreen(loadBattleScreen);
    }
  });
}

function loadSwapScreen(nextScreenFunction) {
  main.innerHTML = "";
  main.append(createPlayerSwapScreen(currentPlayerTurn.name));
  const startTurnButton = document.querySelector(".player-swap button");
  startTurnButton.addEventListener("click", () => {
    nextScreenFunction();
  });
}

function onConfirmPlacement() {
  const numShips = currentPlayerTurn.board.ships.length;
  if (numShips < shipLengths.length) return;
  if (nextPlayer === playerOne) {
    currentPlayerTurn = playerOne;
    nextPlayer = playerTwo;
    loadBattleScreen();
  } else if (gamemode === MODES.TWO_PLAYER) {
    currentPlayerTurn = playerTwo;
    nextPlayer = playerOne;
    loadSwapScreen(loadPlacementScreen);
    // loadPlacementScreen();
  } else {
    loadSwapScreen(loadBattleScreen);
  }
}

function onReset(ships) {
  const board = currentPlayerTurn.board;
  let tableHTML = document.querySelector(`.battlefield table`);
  board.clear();
  ships.forEach((ship) => {
    ship.style.visibility = "visible";
  });
  tableHTML.replaceWith(createPlayerBoard(currentPlayerTurn));
}
function onRotate() {
  placementMode === PLACEMENT_MODE.VERTICAL
    ? (placementMode = PLACEMENT_MODE.HORIZONTAL)
    : (placementMode = PLACEMENT_MODE.VERTICAL);
}
function onRandomize(ships) {
  const board = currentPlayerTurn.board;
  board.clear();
  let tableHTML = document.querySelector(`.battlefield table`);

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

  ships.forEach((ship) => {
    ship.style.visibility = "hidden";
  });

  tableHTML.replaceWith(createPlayerBoard(currentPlayerTurn));
}
function onDragStart(e) {
  let ship = e.target;
  let rect = ship.getBoundingClientRect();
  let shipSize = parseInt(ship.dataset.size);
  dragOffsetX = e.clientX - rect.left - rect.width / 2 / shipSize;
  dragOffsetY = e.clientY - rect.top - rect.height / 2;
  ship.classList.add("dragging");
}

function onDrag(e) {
  const ship = e.target;
  let tile;
  if (placementMode.id === "VERTICAL") {
    tile = document.elementFromPoint(e.clientX, e.clientY);
    console.log(tile);
  } else {
    tile = document.elementFromPoint(
      e.clientX - dragOffsetX,
      e.clientY - dragOffsetY,
    );
  }
  removeHighlights();
  if (tile === null || tile.tagName != "TD") return;

  let x = parseInt(tile.dataset.x);
  let y = parseInt(tile.dataset.y);
  let shipSize = parseInt(ship.dataset.size);
  let valid = placementMode.isValid(x, y, shipSize, currentPlayerTurn.board);
  placementMode.highlightPlacement(x, y, shipSize, valid);
}

function onDragEnd(e) {
  const ship = e.target;
  ship.classList.remove("dragging");
  let tile;
  if (placementMode.id === "VERTICAL") {
    tile = document.elementFromPoint(e.clientX, e.clientY);
    console.log(tile);
  } else {
    tile = document.elementFromPoint(
      e.clientX - dragOffsetX,
      e.clientY - dragOffsetY,
    );
  }
  if (tile === null || tile.tagName != "TD") return;
  let x = parseInt(tile.dataset.x);
  let y = parseInt(tile.dataset.y);
  let shipSize = parseInt(ship.dataset.size);
  let table = document.querySelector(`.battlefield table`);
  let valid = placementMode.isValid(x, y, shipSize, currentPlayerTurn.board);
  placementMode.placeShip(x, y, shipSize, currentPlayerTurn.board);

  if (valid) {
    ship.style.visibility = "hidden";
  }
  table.replaceWith(createPlayerBoard(currentPlayerTurn));
}

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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
