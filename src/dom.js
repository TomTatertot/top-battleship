import hitIcon from "../images/blast.png";
function createPlayerBoard(player) {
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
      if (player.name === "one" && tile.ship !== null) {
        tileHTML.classList.add("occupied");
      }
      if (tile.hit) {
        if (tile.ship !== null) {
          // const img = document.createElement("img");
          // img.src = hitIcon;
          tileHTML.classList.add("hit");
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

function clearMain() {
  const main = document.querySelector("main");
  main.innerHTML = "";
}

function createStartScreen() {}

function createPlacementScreen() {}

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
  highlightHorizontalPlacement,
  highlightVerticalPlacement,
  removeHighlights,
};
