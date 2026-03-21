import { Ship } from "./ship";
class Tile {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.ship = null;
    this.hit = false;
  }
}

export {Tile};