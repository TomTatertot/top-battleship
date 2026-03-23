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

describe("Gameboard placeShipVertical", () => {
  let gameboard = new Gameboard();
  let grid = gameboard.grid;
  let x = 1;
  let y = 1;
  let shipLength = 3;
  gameboard.placeShipVertical(x, y, shipLength);

  test("tile at (x,y) should be set to a ship object once a ship is placed", () => {
    expect(grid[x][y]).toBeInstanceOf(Ship);
  });
  test("both ends of ship should be null", () => {
    expect(grid[x][y - 1]).toBe(null);
    expect(grid[x][y + shipLength]).toBe(null);
  });
  test("corresponding tiles are set to Ship object", () => {
    let tiles = [];
    for (let i = 0; i < shipLength; i++) {
      tiles.push(grid[x][y + i]);
    }
    expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
  });
});

describe("Gameboard placeShipHorizontal", () => {
  let gameboard = new Gameboard();
  let grid = gameboard.grid;
  let x = 1;
  let y = 1;
  let shipLength = 3;
  gameboard.placeShipHorizontal(x, y, shipLength);

  test("tile at (x,y) should be set to a ship object once a ship is placed", () => {
    expect(grid[x][y]).toBeInstanceOf(Ship);
  });
  test("both ends of ship should be null", () => {
    expect(grid[x - 1][y]).toBe(null);
    expect(grid[x + shipLength][y]).toBe(null);
  });
  test("corresponding tiles are set to Ship object", () => {
    let tiles = [];
    for (let i = 0; i < shipLength; i++) {
      tiles.push(grid[x + i][y]);
    }
    expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
  });
});

describe("Gameboard placeShipVertical overflow", () => {
  let gameboard = new Gameboard();
  let grid = gameboard.grid;
  let x = 9;
  let y = 9;
  let shipLength = 3;
  let overflow = 2;
  gameboard.placeShipVertical(x, y, shipLength);

  test("Ship is placed in correct tile coordinates after adjusting for overflow.", () => {
    let tiles = [];
    for (let i = 0; i < shipLength; i++) {
      tiles.push(grid[x][(y-overflow) + i]);
    }
    expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
  });
  test("Tile above ship is null", () => {
    expect(grid[x][(y-overflow-1)]).toBe(null);
  });
});

describe("Gameboard placeShipHorizontal overflow", () => {
  let gameboard = new Gameboard();
  let grid = gameboard.grid;
  let x = 9;
  let y = 9;
  let shipLength = 3;
  let overflow = 2;
  gameboard.placeShipHorizontal(x, y, shipLength);

  test("Ship is placed in correct tile coordinates after adjusting for overflow.", () => {
    let tiles = [];
    for (let i = 0; i < shipLength; i++) {
      tiles.push(grid[(x-overflow) + i][y]);
    }
    expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
  });
  test("Tile left of ship is null", () => {
    expect(grid[x-overflow-1][y]).toBe(null);
  });
});
