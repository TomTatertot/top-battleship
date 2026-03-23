import { Ship } from "./ship";
// import { Tile } from "./tile";

class Gameboard {
  constructor(){
    this.size = 10;
    this.board = this.#constructBoard(this.size);
  }

  #constructBoard(size){
    const boardArray = new Array(size);
    for (let i = 0; i < boardArray.length; i++){
      boardArray[i] = new Array(size).fill(null);
    }
    // const charCode = 65;
    for (let i = 0; i < size; i++){
      for(let j = 0; j < size; j++){
        // let tileCharacter = String.fromCharCode(charCode + j)
        boardArray[i][j] = null;
      }
    }
    return boardArray;
  }

  placeShipVertical(xPos, yPos, shipLength){
    //pivot point of the ship will be the top end / left end before adjusting for board overflow.
    //check for any collisions
    for (let i = 0; i < shipLength; i++){
      let currTile = this.board[xPos][yPos + i];
      if (currTile && currTile.ship !== null)
      {
        console.log("Ship collision!")
        return;
      }
    }
    const newShip = new Ship(shipLength);
    let overflow = 0;
    for (let i = 0; i < shipLength; i++){
      let currTile;
      if (this.board[xPos][yPos + i] !== undefined)
        currTile = this.board[xPos][yPos + i];
      else {
        overflow++;
        currTile = this.board[xPos][yPos - overflow];
      }
      console.log(currTile);
      currTile.ship = newShip;
    }
  }

  placeShipHorizontal(xPos, yPos, shipLength){
    //pivot point of the ship will be the top end / left end before adjusting for board overflow.
    //check for any collisions
    for (let i = 0; i < shipLength; i++){
      let currTile = this.board[xPos + i][yPos];
      if (currTile.ship !== null)
      {
        console.log("Ship collision!")
        return;
      }
    }
    const newShip = new Ship(shipLength);
    let overflow = 0;
    for (let i = 0; i < shipLength; i++){
      let currTile;
      if (this.board[xPos + i][yPos] !== undefined)
        currTile = this.board[xPos + i][yPos];
      else {
        overflow++;
        currTile = this.board[xPos + overflow][yPos];
      }
      currTile.ship = newShip;
    }
  }

  
}

export {Gameboard};