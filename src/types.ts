export {};

export const MAX_NUMBER = 9;
export const CELLS_NUMBER = MAX_NUMBER * MAX_NUMBER;
const CHAR_FOR_EMPTY_CELL = '.';

function assertIndexInRange(value: number, desc: string): void {
  if (!Number.isInteger(value) || value < 0 || value >= MAX_NUMBER) {
    throw new RangeError(`Invalid ${desc}: ${value}`);
  }
}

function assertCellValueInRange(value: number): void {
  if (!Number.isInteger(value) || value < 1 || value > MAX_NUMBER) {
    throw new RangeError(`Invalid cell value: ${value}`);
  }
}

class CellValueSet {
  readonly bitmap: Array<boolean>;

  constructor(initValue = false) {
    this.bitmap = new Array<boolean>(MAX_NUMBER + 1).fill(initValue);
  }

  add(value: number): CellValueSet {
    this.bitmap[value] = true;
    return this;
  }
  delete(value: number): boolean {
    const ret = this.bitmap[value];
    this.bitmap[value] = false;
    return ret;
  }
  has(value: number): boolean {
    return this.bitmap[value];
  }

  clear(): void {
    this.bitmap.fill(false);
  }

  addAll(): void {
    this.bitmap.fill(true);
  }
  hasAll(): boolean {
    for (let i = 1; i <= MAX_NUMBER; i++) {
      if (!this.bitmap[i]) return false;
    }
    return true;
  }
  getUnique(): number | null {
    let ret = null;
    for (let i = 1; i <= MAX_NUMBER; i++) {
      if (!this.bitmap[i]) continue;
      if (ret === null) {
        ret = i;
      } else {
        return null;
      }
    }
    return ret;
  }
  toString(): string {
    let ret = '';
    for (let i = 1; i <= MAX_NUMBER; i++) {
      if (this.bitmap[i]) ret += `${i} `;
    }
    return ret + `: ${this.getUnique()}`;
  }
}

export class Coordinates {
  readonly x: number;
  readonly y: number;
  readonly linearIndex: number;
  readonly squareIndex: number;

  constructor(x: number, y: number) {
    assertIndexInRange(x, 'x');
    assertIndexInRange(y, 'y');
    this.x = x;
    this.y = y;
    this.linearIndex = x + y * MAX_NUMBER;
    this.squareIndex = Math.floor(x / 3) + Math.floor(y / 3) * 3;
  }

  static fromLinearIndex(i: number): Coordinates {
    return new Coordinates(i % MAX_NUMBER, Math.floor(i / MAX_NUMBER));
  }

  toString(): string {
    return `(x: ${this.x}, y: ${this.y}, square: ${this.squareIndex})`;
  }
}

export class Cell {
  readonly coordinate: Coordinates;
  value: number | null;

  constructor(coordinate: Coordinates, value: number | null) {
    if (value !== null) {
      assertCellValueInRange(value);
    }
    this.coordinate = coordinate;
    this.value = value;
  }

  toChar(): string {
    return this.value === null ? CHAR_FOR_EMPTY_CELL : this.value.toString();
  }

  static fromChar(coordinate: Coordinates, char: string): Cell {
    if (char === CHAR_FOR_EMPTY_CELL) {
      return new Cell(coordinate, null);
    }
    return new Cell(coordinate, parseInt(char));
  }
}

export function printCells(cells: ReadonlyArray<Cell>): string {
  return cells.map(cell => cell.toChar()).join('');
}

export function validateCells(
  cells: ReadonlyArray<Cell>,
  strict = false,
): boolean {
  if (cells.length !== MAX_NUMBER) {
    throw new Error(`Got cell size ${cells.length}, want ${MAX_NUMBER}`);
  }

  const values = new CellValueSet();
  for (const cell of cells) {
    if (cell.value === null) {
      continue;
    }
    if (values.has(cell.value)) {
      return false;
    }
  }

  return !strict || values.hasAll();
}

export enum ResolvingCellState {
  PREFILLED = 'Prefilled',
  RESOLVING = 'Resolving',
  RESOLVED = 'Resolved',
}

export class ResolvingCell extends Cell {
  state: ResolvingCellState;
  readonly possibleValues: CellValueSet;

  static newPrefilled(coordinate: Coordinates, value: number): ResolvingCell {
    return new ResolvingCell(coordinate, ResolvingCellState.PREFILLED, value);
  }

  static newResolving(coordinate: Coordinates): ResolvingCell {
    return new ResolvingCell(coordinate, ResolvingCellState.RESOLVING, null);
  }

  private constructor(
    coordinate: Coordinates,
    state: ResolvingCellState,
    value: number | null,
  ) {
    super(coordinate, value);
    this.state = state;
    this.possibleValues = new CellValueSet(true);
    if (state === ResolvingCellState.PREFILLED) {
      return;
    }
    for (let i = 1; i <= MAX_NUMBER; i++) {
      this.possibleValues.add(i);
    }
  }

  removePossibleValue(value: number): void {
    this.possibleValues.delete(value);
  }

  resolve(value: number): void {
    assertCellValueInRange(value);
    this.value = value;
    this.possibleValues.clear();
    this.state = ResolvingCellState.RESOLVED;
  }

  toString(): string {
    return `${this.coordinate} state: ${this.state}, possibleValues: ${this.possibleValues}`;
  }
}

export class GenericBoard<T extends Cell> {
  readonly cells: Array<T>;

  constructor(cells: Array<T>) {
    for (let i = 0; i < CELLS_NUMBER; i++) {
      if (cells[i].coordinate.linearIndex !== i) {
        throw new Error(`Invalid cell ${cells[i]}`);
      }
    }
    this.cells = cells;
  }

  static createBoardFromString(chars: string): GenericBoard<Cell> {
    // Drop all empty chars.
    chars = chars.replace(/\s/g, '');
    if (chars.length !== CELLS_NUMBER) {
      throw new Error(
        `Input char length ${chars.length}, want ${CELLS_NUMBER}`,
      );
    }

    const cells = new Array<Cell>();
    for (let i = 0; i < CELLS_NUMBER; i++) {
      cells.push(Cell.fromChar(Coordinates.fromLinearIndex(i), chars[i]));
    }

    return new GenericBoard(cells);
  }

  printBoard(): string {
    let ret = '';
    for (let i = 0; i < CELLS_NUMBER; i++) {
      ret += this.cells[i].toChar();
      if (i % MAX_NUMBER === MAX_NUMBER - 1) {
        ret += '\n';
      }
    }
    return ret;
  }

  getCellByCoord(coord: Coordinates): T {
    return this.cells[coord.linearIndex];
  }

  getCellsByRow(rowIndex: number): ReadonlyArray<T> {
    assertIndexInRange(rowIndex, 'rowIndex');
    const ret = new Array<T>();
    for (let i = 0; i < MAX_NUMBER; i++) {
      ret.push(this.cells[rowIndex * MAX_NUMBER + i]);
    }
    return ret;
  }

  getCellsByColumn(columnIndex: number): ReadonlyArray<T> {
    assertIndexInRange(columnIndex, 'columnIndex');
    const ret = new Array<T>();
    for (let i = 0; i < MAX_NUMBER; i++) {
      ret.push(this.cells[i * MAX_NUMBER + columnIndex]);
    }
    return ret;
  }

  getCellsBySquare(squareIndex: number): ReadonlyArray<T> {
    assertIndexInRange(squareIndex, 'squareIndex');
    return this.cells.filter(
      cell => cell.coordinate.squareIndex === squareIndex,
    );
  }

  validate(strict: boolean): boolean {
    for (let i = 0; i < MAX_NUMBER; i++) {
      if (!validateCells(this.getCellsByRow(i), strict)) return false;
      if (!validateCells(this.getCellsByColumn(i), strict)) return false;
      if (!validateCells(this.getCellsBySquare(i), strict)) return false;
    }
    return true;
  }
}

export type Board = GenericBoard<Cell>;
