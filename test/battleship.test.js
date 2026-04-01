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
    expect(tile.ship).toBe(null);
  });
});

describe("Gameboard placement validity", () => {
  let gameboard = new Gameboard();
  test("isHorizontalPlacementValid() should return false when coordinates are out of bounds.", ()=> {
    expect(gameboard.isHorizontalPlacementValid(-1,-1, 1)).toBe(false);
    expect(gameboard.isHorizontalPlacementValid(1,-1, 1)).toBe(false);
    expect(gameboard.isHorizontalPlacementValid(-1,-1, 1)).toBe(false);
    expect(gameboard.isHorizontalPlacementValid(7, 1, 3)).toBe(false);
  })
  test("isHorizontalPlacementValid() should return true for valid coordinates", ()=> {
    expect(gameboard.isHorizontalPlacementValid(0,0, 1)).toBe(true);
    expect(gameboard.isHorizontalPlacementValid(8,9, 1)).toBe(true);
    expect(gameboard.isHorizontalPlacementValid(0,9, 1)).toBe(true);
    expect(gameboard.isHorizontalPlacementValid(8, 0, 1)).toBe(true);
  }) 
  test("isVerticalPlacementValid() should return false when coordinates are out of bounds.", ()=> {
    expect(gameboard.isVerticalPlacementValid(-1,-1, 1)).toBe(false);
    expect(gameboard.isVerticalPlacementValid(1,-1, 1)).toBe(false);
    expect(gameboard.isVerticalPlacementValid(-1,-1, 1)).toBe(false);
    expect(gameboard.isVerticalPlacementValid(1, 7, 3)).toBe(false);
  })
  test("isHorizontalPlacementValid() should return true for valid coordinates", ()=> {
    expect(gameboard.isVerticalPlacementValid(0,0, 1)).toBe(true);
    expect(gameboard.isVerticalPlacementValid(9,8, 1)).toBe(true);
    expect(gameboard.isVerticalPlacementValid(9,0, 1)).toBe(true);
    expect(gameboard.isVerticalPlacementValid(0, 8, 1)).toBe(true);
  }) 
})
describe("Gameboard placeShipVertical", () => {
  let gameboard = new Gameboard();
  let grid = gameboard.grid;
  let x = 1;
  let y = 2;
  let shipLength = 3;
  gameboard.placeShipVertical(x, y, shipLength);
  test("tile at (x,y) should be set to a ship object once a ship is placed", () => {
    expect(grid[y][x].ship).toBeInstanceOf(Ship);
  });
  test("both ends of ship should be null", () => {
    expect(grid[y-1][x].ship).toBe(null);
    expect(grid[y + shipLength][x].ship).toBe(null);
  });
  test("corresponding tiles are set to Ship object", () => {
    let tiles = [];
    for (let i = 0; i < shipLength; i++) {
      tiles.push(grid[y + i][x].ship);
    }
    expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
  });
});

describe("Gameboard placeShipHorizontal", () => {
  let gameboard = new Gameboard();
  let grid = gameboard.grid;
  let x = 1;
  let y = 2;
  let shipLength = 3;
  gameboard.placeShipHorizontal(x, y, shipLength);
  test("tile at (x,y) should be set to a ship object once a ship is placed", () => {
    expect(grid[y][x].ship).toBeInstanceOf(Ship);
  });
  test("both ends of ship should be null", () => {
    expect(grid[y][x-1].ship).toBe(null);
    expect(grid[y][x + shipLength].ship).toBe(null);
  });
  test("corresponding tiles are set to Ship object", () => {
    let tiles = [];
    for (let i = 0; i < shipLength; i++) {
      tiles.push(grid[y][x + i].ship);
    }
    expect(tiles).toEqual(expect.arrayOf(expect.any(Ship)));
  });
});

describe("Ship placement collisions", () => {
  let gameboard = new Gameboard();
  gameboard.placeShipHorizontal(1, 1, 3);
  gameboard.placeShipHorizontal(6, 8, 3);
  test("placeShipHorizontal() does nothing if ship would collide with another ship.", () => {
    const before = structuredClone(gameboard);
    gameboard.placeShipHorizontal(0, 1, 3);
    gameboard.placeShipHorizontal(9, 8, 3);
    expect(before).toEqual(gameboard);
  });
  test("placeShipVertical() does nothing if ship would collide with another ship.", () => {
    const before = structuredClone(gameboard);
    gameboard.placeShipVertical(1, 0, 3);
    expect(before).toEqual(gameboard);
  });
});

describe("Gameboard receiveAttack()", () => {
  let gameboard = new Gameboard();
  let grid = gameboard.grid;
  gameboard.placeShipHorizontal(1, 1, 3);
  test("Hits the correct ship", () => {
    gameboard.receiveAttack(1, 1);
    let ship = grid[1][1].ship;
    expect(ship.numHits).toBe(1);
  });
  test("Cannot hit the same position twice", () => {
    gameboard.receiveAttack(1, 1);
    let ship = grid[1][1].ship;
    expect(ship.numHits).toBe(1);
  });
  test("Records missed shots", () => {
    gameboard.receiveAttack(3, 3);
    let misses = gameboard.missedAttacks();
    expect(
      misses.some((coordinates) => {
        return coordinates[0] === 3 && coordinates[1] === 3;
      }),
    ).toBe(true);
  });
});

describe("Gameboard gameOver()", () => {
  let gameboard = new Gameboard();
  gameboard.placeShipHorizontal(1, 1, 3);
  gameboard.placeShipHorizontal(1, 2, 3);
  test("False if a ship still stands", () => {
    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(2, 1);
    expect(gameboard.gameOver()).toBe(false);
  });
  test("True if all ships on the board are sunk", () => {
    let ships = gameboard.ships;
    ships.forEach((ship) => {
      ship.numHits = ship.length;
    });
    expect(gameboard.gameOver()).toBe(true);
  });
});
