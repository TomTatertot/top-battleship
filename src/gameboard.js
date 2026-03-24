import { Ship } from "./ship";
// import { Tile } from "./tile";

class Gameboard {
  constructor() {
    this.size = 10;
    this.grid = this.#constructGrid(this.size);
    this.missedCoordinates = [];
  }

  #constructGrid(size) {
    const gridArray = new Array(size);
    for (let i = 0; i < gridArray.length; i++) {
      gridArray[i] = new Array(size).fill(null);
    }
    // const charCode = 65;
    // for (let i = 0; i < size; i++){
    //   for(let j = 0; j < size; j++){
    //     // let tileCharacter = String.fromCharCode(charCode + j)
    //     gridArray[i][j] = null;
    //   }
    // }
    return gridArray;
  }

  placeShipVertical(x, y, shipLength) {
    //pivot point of the ship will be the top end / left end before adjusting for grid overflow.
    //check for any collisions
    for (let i = 0; i < shipLength; i++) {
      if (y + i < this.size) {
        let currTile = this.grid[x][y + i];
        if (currTile !== null) {
          return;
        }
      }
    }

    const newShip = new Ship(shipLength);
    let overflow = 0;
    for (let i = 0; i < shipLength; i++) {
      if (y + i < this.size) {
        this.grid[x][y + i] = newShip;
      } else {
        overflow++;
        this.grid[x][y - overflow] = newShip;
      }
    }
  }

  placeShipHorizontal(x, y, shipLength) {
    //pivot point of the ship will be the top end / left end before adjusting for grid overflow.
    //check for any collisions
    for (let i = 0; i < shipLength; i++) {
      if (x + i < this.size) {
        let currTile = this.grid[x + i][y];
        if (currTile !== null) {
          return;
        }
      }
    }

    const newShip = new Ship(shipLength);
    let overflow = 0;
    for (let i = 0; i < shipLength; i++) {
      if (x + i < this.size) {
        this.grid[x + i][y] = newShip;
      } else {
        overflow++;
        this.grid[x - overflow][y] = newShip;
      }
    }
  }
  receiveAttack(x,y){ 
    let tile = this.grid[x][y];
    if (tile !== null)
      tile.hit();
    else
      this.missedCoordinates.push([x,y]);
}

}
export { Gameboard };
