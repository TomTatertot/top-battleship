import { Ship } from "./ship";
// import { Tile } from "./tile";

class Gameboard {
  constructor(){
    this.size = 10;
    this.grid = this.#constructGrid(this.size);
    this.missedCoordinates = [];
  }

  #constructGrid(size){
    const gridArray = new Array(size);
    for (let i = 0; i < gridArray.length; i++){
      gridArray[i] = new Array(size).fill(null);
    }
    // const charCode = 65;
    for (let i = 0; i < size; i++){
      for(let j = 0; j < size; j++){
        // let tileCharacter = String.fromCharCode(charCode + j)
        gridArray[i][j] = null;
      }
    }
    return gridArray;
  }

  placeShipVertical(xPos, yPos, shipLength){
    //pivot point of the ship will be the top end / left end before adjusting for grid overflow.
    //check for any collisions
    for (let i = 0; i < shipLength; i++){
      let currTile = this.grid[xPos][yPos + i];
      if (currTile && currTile !== null)
      {
        console.log("Ship collision!")
        return;
      }
    }

    const newShip = new Ship(shipLength);
    let overflow = 0;
    for (let i = 0; i < shipLength; i++){
      if (yPos + i < this.size)
      {
        this.grid[xPos][yPos + i] = newShip;
      }
      else {
        overflow++;
        this.grid[xPos][yPos - overflow] = newShip;
      }
    }
  }

  placeShipHorizontal(xPos, yPos, shipLength){
    //pivot point of the ship will be the top end / left end before adjusting for grid overflow.
    //check for any collisions
    for (let i = 0; i < shipLength; i++){
      let currTile = this.grid[xPos + i][yPos];
      if (currTile && currTile !== null)
      {
        console.log("Ship collision!")
        return;
      }
    }

    const newShip = new Ship(shipLength);
    let overflow = 0;
    for (let i = 0; i < shipLength; i++){
      if (xPos + i < this.size)
      {
        this.grid[xPos + i][yPos] = newShip;
      }
      else {
        overflow++;
        this.grid[xPos - overflow][yPos] = newShip;
      }
    }
  }

  
}

export {Gameboard};