const MAX_NUMBER = 9;

class Value {
  readonly value: number;
  constructor(value: number) {
    if (!Number.isInteger(value) || value < 1 || value > MAX_NUMBER) {
      throw new RangeError(
        `value should be an integer between 1 and ${MAX_NUMBER}`,
      );
    }
    this.value = value;
  }
}

class Coordinate {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    if (!Number.isInteger(x) || x < 1 || x > MAX_NUMBER) {
      throw new RangeError(`Invalid x: ${x}`);
    }
    if (!Number.isInteger(y) || y < 1 || y > MAX_NUMBER) {
      throw new RangeError(`Invalid y: ${y}`);
    }
    this.x = x;
    this.y = y;
  }
}

interface Cell {
  readonly coordinate: Coordinate;
}

class PrefilledCell implements Cell {
  readonly coordinate: Coordinate;
  readonly value: Value;

  constructor(coordinate: Coordinate, value: Value) {
    this.coordinate = coordinate;
    this.value = value;
  }
}
