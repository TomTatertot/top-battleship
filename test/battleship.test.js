import { Ship } from "../src/ship";
import { Gameboard } from "../src/gameboard";
import { before } from "node:test";

describe('Ship class', () => {
  test('increments numHits by one', () => {
    const ship = new Ship(2);
    ship.hit()
    expect(ship.numHits).toBe(1);
  })
  test('isSunk is false when numHits < ship length', () => {
    const ship = new Ship(2);
    expect(ship.isSunk()).toBe(false);
  })
  test('isSunk is true when numHits >= ship length', () => {
    const ship = new Ship(2);
    for (let i = 0; i < ship.length; i++){
      ship.hit();
    }
    expect(ship.isSunk()).toBe(true);
  })
})

describe('Gameboard class', () => {
  beforeEach(() => {
    const gameboard = new Gameboard();
    const tile = gameboard.getTile(0,0);
  })
  // const gameboard = new Gameboard();
  // const tile = gameboard.getTile(0,0);
  test('tile.x at (2,0) equals 2 ', () => {
    const gameboard = new Gameboard();
    const tile = gameboard.getTile(2,0);
    expect(tile.x).toBe(2);
  })
})