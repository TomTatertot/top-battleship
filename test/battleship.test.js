import { Ship } from "../src/ship";

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