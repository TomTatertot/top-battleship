class Ship {
  constructor(length){
    this.length = length;
    this.numHits = 0;
  }

  hit(){
    this.numHits++;
  }

  isSunk(){
    if (this.numHits >= this.length) 
      return true;
    return false;
  }
}

export {Ship};