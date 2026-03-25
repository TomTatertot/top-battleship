import { Gameboard } from "./gameboard";
class Player {
  constructor(name){
    this.name = name;
    this.board = new Gameboard();
  }
}

export {Player};