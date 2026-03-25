import { Ship } from "./ship";
import { Tile } from "./tile";

class Gameboard {
  constructor() {
    this.size = 10;
    this.grid = this.#constructGrid();
    this.ships = [];
  }

  #constructGrid() {
    let gridArray = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      gridArray[i] = new Array(this.size);
    }
    for (let i = 0; i < gridArray.length; i++) {
      for (let j = 0; j < gridArray.length; j++) {
        gridArray[i][j] = new Tile();
      }
    }
    return gridArray;
  }

  placeShipVertical(x, y, shipLength) {
    //pivot point of the ship will be the top end / left end
    if (x >= this.size || x < 0) return;
    if (y + shipLength >= this.size || y < 0) return;

    //check for collisions
    for (let i = 0; i < shipLength; i++) {
      if (this.grid[x][y + i].ship !== null) return;
    }

    let ship = new Ship(shipLength);
    this.ships.push(ship);
    for (let i = 0; i < shipLength; i++) {
      this.grid[x][y + i].ship = ship;
    }
  }

  placeShipHorizontal(x, y, shipLength) {
    //pivot point of the ship will be the top end / left end
    if (y >= this.size || y < 0) return;
    if (x + shipLength >= this.size || x < 0) return;

    //check for collisions
    for (let i = 0; i < shipLength; i++) {
      if (this.grid[x + i][y].ship !== null) return;
    }

    let ship = new Ship(shipLength);
    this.ships.push(ship);
    for (let i = 0; i < shipLength; i++) {
      this.grid[x + i][y].ship = ship;
    }
  }
  receiveAttack(x, y) {
    let tile = this.grid[x][y];
    let ship = tile.ship;

    if (tile.hit) return;
    tile.hit = true;
    if (ship !== null) {
      ship.hit();
    }
  }

  gameOver() {
    if (this.ships.some((ship) => !ship.isSunk())) {
      return false;
    }

    return true;
  }

  missedAttacks() {
    let missedCoordinates = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let tile = this.grid[i][j];
        if (tile.ship === null && tile.hit) missedCoordinates.push([i, j]);
      }
    }
    return missedCoordinates;
  }
}
export { Gameboard };
