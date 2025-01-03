import * as types from './types.js';
import {solve} from './solve.js';

const BOARD_EXAMPLE = `
. . 3 . 2 . 6 . .
9 . . 3 . 5 . . 1
. . 1 8 . 6 4 . .
. . 8 1 . 2 9 . .
7 . . . . . . . 8
. . 6 7 . 8 2 . .
. . 2 6 . 9 5 . .
8 . . 2 . 3 . . 9
. . 5 . 1 . 3 . .
`;

describe('Board test', () => {
  const board = types.GenericBoard.createBoardFromString(BOARD_EXAMPLE);

  it('get row', () => {
    expect(types.printCells(board.getCellsByRow(1))).toBe('9..3.5..1');
    expect(types.printCells(board.getCellsByRow(7))).toBe('8..2.3..9');
  });

  it('get column', () => {
    expect(types.printCells(board.getCellsByColumn(3))).toBe('.381.762.');
    expect(types.printCells(board.getCellsByColumn(8))).toBe('.1..8..9.');
  });

  it('get square', () => {
    expect(types.printCells(board.getCellsBySquare(2))).toBe('6....14..');
    expect(types.printCells(board.getCellsBySquare(6))).toBe('..28....5');
  });

  it('validate', () => {
    expect(board.validate(/*strict=*/ false)).toBe(true);
    expect(board.validate(/*strict=*/ true)).toBe(false);
  });

  it('solve', () => {
    solve(types.GenericBoard.createBoardFromString(BOARD_EXAMPLE));
  });
});
