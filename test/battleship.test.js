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
  test("Function should do nothing when given negative coordinates or coordinates that are out of bounds.", ()=> {
    const before = structuredClone(gameboard);
    gameboard.placeShipVertical(1, -1)
    gameboard.placeShipVertical(-1, 1)
    gameboard.placeShipVertical(1, 11)
    gameboard.placeShipVertical(11,1);
    expect(before).toEqual(gameboard);
    console.log(before.ad === gameboard);
  })
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

  test("Function should do nothing when given negative coordinates or coordinates that are out of bounds.", ()=> {
    const before = structuredClone(gameboard);
    gameboard.placeShipHorizontal(-1, -1);
    gameboard.placeShipHorizontal(11,11);
    expect(before).toEqual(gameboard);
  })
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

describe("Gameboard overflow", () => {
  let x = 9;
  let y = 9;
  let shipLength = 3;
  let overflow = 2;
  describe("Vertical overflow", () => {
    let gameboard = new Gameboard();
    let grid = gameboard.grid;
    gameboard.placeShipVertical(x, y, shipLength);

    test("Ship is placed in correct tile coordinates after adjusting for overflow.", () => {
      let tiles = [];
      for (let i = 0; i < shipLength; i++) {
        tiles.push(grid[x][y - overflow + i]);
      }
      expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
    });
    test("Tile above ship is null", () => {
      expect(grid[x][y - overflow - 1]).toBe(null);
    });
  });

  describe("Horizontal overflow", () => {
    let gameboard = new Gameboard();
    let grid = gameboard.grid;
    gameboard.placeShipHorizontal(x, y, shipLength);

    test("Ship is placed in correct tile coordinates after adjusting for overflow.", () => {
      let tiles = [];
      for (let i = 0; i < shipLength; i++) {
        tiles.push(grid[x - overflow + i][y]);
      }
      expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
    });
    test("Tile left of ship is null", () => {
      expect(grid[x - overflow - 1][y]).toBe(null);
    });
  });
});

describe("Ship placement collisions", () => {
  let gameboard = new Gameboard();
  gameboard.placeShipHorizontal(1, 1, 3);
  test("placeShipHorizontal() does nothing if ship would collide with another ship.", ()=> {
    const before = structuredClone(gameboard);
    gameboard.placeShipHorizontal(0,1,3);
    expect(before).toEqual(gameboard);
  })
  test("placeShipVertical() does nothing if ship would collide with another ship.", ()=> {
    const before = structuredClone(gameboard);
    gameboard.placeShipVertical(1,0,3);
    expect(before).toEqual(gameboard);
  })
})
