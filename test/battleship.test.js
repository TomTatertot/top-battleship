import { Ship } from "../src/ship";
import { Gameboard } from "../src/gameboard";
import { before } from "node:test";

describe("Ship class", () => {
  test("increments numHits by one", () => {
    const ship = new Ship(2);
    ship.hit();
    expect(ship.numHits).toBe(1);
  });
  test("isSunk is false when numHits < ship length", () => {
    const ship = new Ship(2);
    expect(ship.isSunk()).toBe(false);
  });
  test("isSunk is true when numHits >= ship length", () => {
    const ship = new Ship(2);
    for (let i = 0; i < ship.length; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBe(true);
  });
});

describe("Gameboard class", () => {
  let gameboard = new Gameboard();
  let tile = gameboard.board[2][9];

  test("tile.x at (2,9) equals 2 ", () => {
    expect(tile.x).toBe(2);
  });
  test("tile.y at (2,9) equals 9", () => {
    expect(tile.y).toBe(9);
  });
  test("tile.ship (2,9) initially equals null", () => {
    expect(tile.ship).toBe(null);
  });
  // test("tile.ship at (2,9) should be set to a ship object once a ship is placed", () => {
  //   gameboard.placeShip(2, 9, 2);
  //   expect(tile.ship).toBeInstanceOf(Ship);
  // });
  // test("tile.ship at (2,9) should be set to a ship object once a ship is placed", () => {
  //   gameboard.placeShip(2, 9, 2);
  //   expect(tile.ship).toBeInstanceOf(Ship);
  // });
});

describe("Gameboard placeShip", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("tile.ship at (1,1) should be set to a ship object once a ship is placed", () => {
    gameboard.placeShip(1, 1, 3);
    let tile = gameboard.board[1][1];
    expect(tile.ship).toBeInstanceOf(Ship);
  });
  test("tile.ship at (1,0) should be null if ship is placed at (1,1)", () => {
    gameboard.placeShip(1, 1, 3);
    let tile = gameboard.board[1][0];
    expect(tile.ship).toBe(null);
  });
  test("tile.ship at (1,1), (1,2), and (1,3) should be a Ship object if a ship with a length of 3 is placed at (1,1)", () => {
    gameboard.placeShip(1, 1, 3);
    let tiles = [];
    for (let i = 0; i < 3; i++) {
      tiles.push(gameboard.board[1][1 + i].ship);
    }
    expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
  });
});
