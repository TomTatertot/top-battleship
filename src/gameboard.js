import { Ship } from "./ship";
// import { Tile } from "./tile";

class Gameboard {
  constructor() {
    this.size = 10;
    this.grid = this.#constructGrid(this.size);
    this.ships = [];
    this.missedCoordinates = [];
  }

  #constructGrid(size) {
    const gridArray = new Array(size);
    for (let i = 0; i < gridArray.length; i++) {
      gridArray[i] = new Array(size).fill(null);
    }
    return gridArray;
  }

  placeShipVertical(x, y, shipLength) {
    //pivot point of the ship will be the top end / left end
    if (x >= this.size || x < 0) return;
    if (y + shipLength >= this.size || y < 0) return;

    //check for collisions
    for (let i = 0; i < shipLength; i++) {
      if (this.grid[x][y + i] !== null) return;
    }

    console.log(x, y);
    let ship = new Ship(shipLength);
    this.ships.push(ship);
    for (let i = 0; i < shipLength; i++) {
      this.grid[x][y + i] = ship;
    }
  }

  placeShipHorizontal(x, y, shipLength) {
    //pivot point of the ship will be the top end / left end
    if (y >= this.size || y < 0) return;
    if (x + shipLength >= this.size || x < 0) return;

    //check for collisions
    for (let i = 0; i < shipLength; i++) {
      if (this.grid[x + i][y] !== null) return;
    }

    let ship = new Ship(shipLength);
    this.ships.push(ship);
    for (let i = 0; i < shipLength; i++) {
      this.grid[x + i][y] = ship;
    }
  }
  receiveAttack(x, y) {
    let tile = this.grid[x][y];
    if (tile !== null) tile.hit();
    else this.missedCoordinates.push([x, y]);
  }

  gameOver() {
    if (this.ships.some((ship) => !ship.isSunk())) {
      return false;
    }

    return true;
  }
}
export { Gameboard };
