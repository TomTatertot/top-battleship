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
    if (!this.isVerticalPlacementValid(x, y, shipLength)) return;

    let ship = new Ship(shipLength);
    this.ships.push(ship);
    for (let i = 0; i < shipLength; i++) {
      this.grid[y + i][x].ship = ship;
    }
  }

  placeShipHorizontal(x, y, shipLength) {
    //pivot point of the ship will be the top end / left end
    if (!this.isHorizontalPlacementValid(x, y, shipLength)) return;

    let ship = new Ship(shipLength);
    this.ships.push(ship);
    for (let i = 0; i < shipLength; i++) {
      this.grid[y][x + i].ship = ship;
    }
  }

  isVerticalPlacementValid(x, y, shipLength) {
    //check out of bounds
    if (x >= this.size || x < 0) return false;
    if (y + shipLength >= this.size || y < 0) return false;

    //check for collisions
    for (let i = 0; i < shipLength; i++) {
      if (this.grid[y + i][x].ship !== null) return false;
    }
    //check for adjacent ships
    return true;
  }

  isHorizontalPlacementValid(x, y, shipLength) {
    if (y >= this.size || y < 0) return false;
    if (x + shipLength >= this.size || x < 0) return false;

    //check for collisions
    for (let i = 0; i < shipLength; i++) {
      if (this.grid[y][x + i].ship !== null) return false;
    }

    return true;
  }

  receiveAttack(x, y) {
    let tile = this.grid[y][x];
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
