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

function clearMain(){
  const main = document.querySelector("main");
  main.innerHTML = '';
}

function createStartScreen(){

}

function createPlacementScreen(){

}

function updateBoard(gameboard) {
  // let grid = gameboard.grid;
  // for (let i = 0; i < grid.length; i++) {
  //   for (let j = 0; j < grid.length; j++) {
  //     let ship = grid[i][j].ship;
  //     if (ship !== null) {
  //       let tileHTML = document.querySelector(
  //         `td[data-x="${i}"][data-y="${j}"]`,
  //       );
  //       tileHTML.classList.add("occupied");
  //     }
  //   }
  // }
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
    let shipWidth = (shipSize * shipTileWidthREM * 16) + ((shipSize-1) * shipFlexGapPixels);

    ship.dataset.size = shipSize;
    ship.style.width = shipWidth + "px";

    ship.append(shipTile);
  }
  return ship;
}
export { createPlayerBoard, updateBoard, createShip };
