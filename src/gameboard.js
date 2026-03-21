import { Ship } from "./ship";
import { Tile } from "./tile";

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
        boardArray[i][j] = new Tile(i, j);
      }
    }
    return boardArray;
  }
  
  getTile(x, y){
    return this.board[x][y];
  }
}

export {Gameboard};