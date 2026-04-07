import hitIcon from "../images/blast.png";
import logoSrc from "../images/logo.png";

function createPlayerBoard(player, hideShips = false) {
  let gameboard = player.board;
  const boardSize = gameboard.size;
  const table = document.createElement("table");
  const header = document.createElement("thead");
  const body = document.createElement("tbody");
  const headerRow = document.createElement("tr");

  for (let i = 0; i <= boardSize; i++) {
    const headerLetter = `${String.fromCharCode(64 + i)}`;
    const columnHeader = document.createElement("th");
    columnHeader.scope = "col";
    if (i > 0) {
      columnHeader.textContent = headerLetter;
    }

    headerRow.append(columnHeader);
  }

  for (let i = 0; i < boardSize; i++) {
    const row = document.createElement("tr");
    //create row header
    const rowHeader = document.createElement("th");
    rowHeader.scope = "row";
    rowHeader.textContent = `${i + 1}`;
    row.append(rowHeader);

    //create row cells
    for (let j = 0; j < boardSize; j++) {
      let tile = gameboard.grid[i][j];
      const tileHTML = document.createElement("td");
      tileHTML.dataset.y = i;
      tileHTML.dataset.x = j;
      if (!hideShips && tile.ship !== null) {
        tileHTML.classList.add("occupied");
      }
      if (tile.hit) {
        if (tile.ship !== null) {
          tileHTML.classList.add("hit");
          if (tile.ship.isSunk()) {
            tileHTML.classList.add("sunk");
          }
          tileHTML.innerHTML = `<img class= "hit-icon" src="${hitIcon}" alt="Ship hit icon">`;
        } else {
          tileHTML.innerHTML = `<div class="miss-icon"></div>`;
          tileHTML.classList.add("miss");
        }
      }
      row.append(tileHTML);
    }
    body.append(row);
  }
  header.append(headerRow);
  table.append(header, body);
  return table;
}

function createTitleScreen() {
  const titleScreen = document.createElement("div");
  titleScreen.classList.add("title-screen");
  titleScreen.innerHTML = `
    <img class="logo" src="${logoSrc}" alt="Battleship logo" />
    <p class="title-screen text">Locate and sink the enemy fleet</p>
    <button class="button start-button">Start Game</button>
    `;

  return titleScreen;
}

function createGamemodeSelectionScreen() {
  const selectionScreen = document.createElement("div");
  selectionScreen.classList.add("title-screen");
  selectionScreen.innerHTML = 
  `
    <img class= "logo" src="../images/logo.png" alt="" />
    <p class="title-screen text">Select your gamemode</p>
    <button class="button easy-cpu-button">Easy CPU</button> 
    <button class="button hard-cpu-button">Hard CPU</button> 
    <button class="button coop-button">Two Players</button> 
  `
  return selectionScreen;
}

function createEndScreen(winningPlayer){
  const endScreen = document.createElement("div");
  endScreen.classList.add("end-screen");
  endScreen.innerHTML = `
    <img class= "logo" src="../images/logo.png" alt="" />
    <p class="end-screen text">${winningPlayer.name} wins!</p>
    <button class="button rematch-button">Rematch</button>
    <button class="button menu-button">Main Menu</button>
  `
  return endScreen;
}

function createPlacementScreen(playerName) {
  const placementScreen = document.createElement("div");
  placementScreen.classList.add("battlefield-placeship");
  placementScreen.innerHTML = `
      <div class="fleet">
        <button class="button rotate">Rotate</button>
      </div>
      <div class="battlefield-container">
        <div class="battlefield-name">${playerName}</div>
        <div class="battlefield-text">Deploy your fleet</div>
        <div class="battlefield"></div>
        <div class="button-flex">
          <button class="button battlefield-button random">Randomize</button>
          <button class="button battlefield-button reset">Reset</button>
        </div>
          <button class="button battlefield-button confirm">Confirm</button>
      </div>`;

  return placementScreen;
}

function createPlayerSwapScreen(nextPlayerName) {
  const swapScreen = document.createElement("div");
  swapScreen.classList.add("player-swap");
  swapScreen.innerHTML = `
    <div class="player-swap">
      <p>${nextPlayerName}'s Turn </p>
      <button class="button">Start Turn</button>
    </div>
        `;
  return swapScreen;
}

function createBattleScreen(currentPlayerName, nextPlayerName, gamemode) {
  const battleScreen = document.createElement("div");
  battleScreen.classList.add("battlefields");

  let allyBattlefieldName;
  let enemyBattlefieldName;
  if (gamemode === "TWO_PLAYER") {
    allyBattlefieldName = `${currentPlayerName}'s Fleet`;
    enemyBattlefieldName = `${nextPlayerName}'s Fleet`;
  } else {
    allyBattlefieldName = "Your Fleet";
    enemyBattlefieldName = "CPU's Fleet";
  }
  battleScreen.innerHTML = `
      <div class="battlefield-container">
        <div class="battlefield-name">${allyBattlefieldName}</div>
        <div class="battlefield battlefield-one"></div>
      </div>
      <div class="battlefield-container">
        <div class="battlefield-name enemy">${enemyBattlefieldName}</div>
        <div class="battlefield battlefield-two"></div>
      </div>`;
  return battleScreen;
}

function createHeader() {
  const header = document.createElement("header");
  const logo = document.createElement("img");
  logo.classList.add("logo");
  logo.src = logoSrc;

  header.append(logo);
  return header;
}

function createShip(shipSize) {
  const ship = document.createElement("div");
  ship.classList.add("ship");
  ship.draggable = true;

  for (let i = 0; i < shipSize; i++) {
    const shipTile = document.createElement("div");
    shipTile.classList.add("ship-tile");

    let shipTileWidthREM = 2.5;
    let shipFlexGapPixels = 2;
    let shipWidth =
      shipSize * shipTileWidthREM * 16 + (shipSize - 1) * shipFlexGapPixels;

    ship.dataset.size = shipSize;
    ship.style.width = shipWidth + "px";

    ship.append(shipTile);
  }
  return ship;
}

function highlightHorizontalPlacement(x, y, shipSize, placementValid) {
  for (let i = 0; i < shipSize; i++) {
    let currTile = document.querySelector(
      `td[data-x="${x + i}"][data-y="${y}"]`,
    );
    if (currTile === null) return;

    currTile.classList.add("highlight");

    if (placementValid) {
      currTile.classList.add("highlight-valid");
    } else {
      currTile.classList.add("highlight-invalid");
    }
  }
}

function highlightVerticalPlacement(x, y, shipSize, placementValid) {
  for (let i = 0; i < shipSize; i++) {
    let currTile = document.querySelector(
      `td[data-x="${x}"][data-y="${y + i}"]`,
    );

    if (currTile === null) return;

    currTile.classList.add("highlight");

    if (placementValid) {
      currTile.classList.add("highlight-valid");
    } else {
      currTile.classList.add("highlight-invalid");
    }
  }
}

function removeHighlights() {
  const tiles = [...document.querySelectorAll(".highlight")];
  tiles.forEach((tile) => {
    tile.classList.remove("highlight");
    tile.classList.remove("highlight-invalid");
    tile.classList.remove("highlight-valid");
  });
}

export {
  createPlayerBoard,
  createShip,
  createPlacementScreen,
  createBattleScreen,
  createPlayerSwapScreen,
  createHeader,
  createTitleScreen,
  createEndScreen,
  createGamemodeSelectionScreen,
  highlightHorizontalPlacement,
  highlightVerticalPlacement,
  removeHighlights,
};
