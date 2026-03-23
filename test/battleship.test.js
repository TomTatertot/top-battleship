import { Ship } from "../src/ship";
import { Gameboard } from "../src/gameboard";

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
  let tile = gameboard.grid[2][9];

  test("tile.ship (2,9) initially equals null", () => {
    expect(tile).toBe(null);
  });
});

describe("Gameboard placeShip", () => {
  let gameboard = new Gameboard();
  gameboard.placeShipVertical(1, 1, 3); 
  test("tile at (1,1) should be set to a ship object once a ship is placed", () => {
    let tile = gameboard.grid[1][1];
    expect(tile).toBeInstanceOf(Ship);
  });
  test("tile at (1,0) should be null if ship is placed at (1,1)", () => {
    let tile = gameboard.grid[1][0];
    expect(tile).toBe(null);
  });
  test("tile at (1,1), (1,2), and (1,3) should be a Ship object if a ship with a length of 3 is placed at (1,1)", () => {
    let tiles = [];
    for (let i = 0; i < 3; i++) {
      tiles.push(gameboard.grid[1][1 + i]);
    }
    expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
  });
});

describe("Gameboard placeShip overflow", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("Ship with length of 3 placed at (9,9) should be positioned at (9,7), (9,8), and (9,6)", () => {
    gameboard.placeShipVertical(9,9,3);
    let tiles = [];
    for (let i = 0; i < 3; i++){
      tiles.push(gameboard.grid[9][7+i])
    }
    expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
  });
});
