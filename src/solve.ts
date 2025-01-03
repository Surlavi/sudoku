import * as types from './types.js';

import {SolvingCell, CELLS_NUMBER, SolvingCellState} from './types.js';

export class SolvingBoard extends types.GenericBoard<SolvingCell> {
  static createFromBoard(board: Readonly<types.Board>): SolvingBoard {
    const cells = new Array<SolvingCell>();
    for (const cell of board.cells) {
      if (cell.value === null) {
        cells.push(SolvingCell.newSolving(cell.coordinate));
      } else {
        cells.push(SolvingCell.newPrefilled(cell.coordinate, cell.value));
      }
    }
    return new SolvingBoard(cells);
  }

  clone(): SolvingBoard {
    return new SolvingBoard(this.cells.map(c => c.clone()));
  }

  getEmptyCellsCount(): number {
    return this.cells.filter(cell => cell.state === SolvingCellState.SOLVING)
      .length;
  }

  getAvailableNumbersForCell(coord: types.Coordinates): ReadonlySet<number> {
    const cell = this.cells[coord.linearIndex];
    if (cell.hasNumber()) {
      return new Set();
    }

    const neighColors = new Set<number>();
    this.getCellsByNeighborToCoord(coord).forEach(x => {
      if (x.value) {
        neighColors.add(x.value);
      }
    });
    const ret = new Set<number>();
    for (let i = 1; i <= 9; ++i) {
      if (!neighColors.has(i)) {
        ret.add(i);
      }
    }
    return ret;
  }

  takeAction(action: Action) {
    console.log(actionToString(action));
    const cell = this.getCellByCoord(action.coordinate);
    switch (action.type) {
      case ActionType.REMOVE_DRAFT_NUMBER:
        // console.log(`before ${cell.possibleValues.toString()}`)
        cell.removeDraftNumber(action.value);
        // console.log(`after ${cell.possibleValues.toString()}`)
        break;
      case ActionType.FILL_IN_NUMBER:
        cell.fillNumber(action.value);
        break;
    }
  }

  takeActions(actions: Array<Action>) {
    for (const action of actions) {
      this.takeAction(action);
    }
  }
}

enum ActionType {
  REMOVE_DRAFT_NUMBER = 'remove draft number',
  FILL_IN_NUMBER = 'fill in number',
}

interface Action {
  readonly coordinate: types.Coordinates;
  readonly type: ActionType;
  readonly value: number;
  readonly reasonString: string | null;
}

function actionToString(a: Action): string {
  return `${a.coordinate.toString()}: ${a.type} value ${a.value}, reason: ${a.reasonString}`;
}

interface PartialSolver {
  solve(board: SolvingBoard): Array<Action>;
}

export function eliminatePossibleStates(board: SolvingBoard): Array<Action> {
  const ret = new Array<Action>();
  const addAction = function (
    targetCell: SolvingCell,
    value: number,
    sourceCell: SolvingCell,
  ) {
    if (
      targetCell.state === SolvingCellState.SOLVING &&
      targetCell.draftNumbers.has(value)
    ) {
      ret.push({
        coordinate: targetCell.coordinate,
        type: ActionType.REMOVE_DRAFT_NUMBER,
        value: value,
        reasonString: `Conflict with ${sourceCell.toString()}`,
      });
    }
  };
  for (let i = 0; i < CELLS_NUMBER; i++) {
    const coord = types.Coordinates.fromLinearIndex(i);
    const cell = board.cells[i];
    if (cell.state === SolvingCellState.SOLVING) {
      continue;
    }
    if (cell.value === null) {
      throw new Error('Invalid state');
    }
    const valueToRemove = cell.value;
    for (const targetCell of board.getCellsByColumn(coord.x)) {
      addAction(targetCell, valueToRemove, cell);
    }
    for (const targetCell of board.getCellsByRow(coord.y)) {
      addAction(targetCell, valueToRemove, cell);
    }
    for (const targetCell of board.getCellsBySquare(coord.squareIndex)) {
      addAction(targetCell, valueToRemove, cell);
    }
  }
  return ret;
}

function uniqueValueSetter(board: SolvingBoard): Array<Action> {
  const ret = new Array<Action>();
  const addAction = function (cell: SolvingCell, value: number) {
    ret.push({
      coordinate: cell.coordinate,
      type: ActionType.FILL_IN_NUMBER,
      value: value,
      reasonString: null,
    });
  };

  for (let i = 0; i < CELLS_NUMBER; i++) {
    const cell = board.cells[i];
    if (cell.state !== SolvingCellState.SOLVING) {
      continue;
    }
    const value = cell.draftNumbers.getUnique();
    if (value !== null) {
      addAction(cell, value);
    }
  }

  return ret;
}

export function solve(board: types.Board) {
  const solvingBoard = SolvingBoard.createFromBoard(board);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const solvers: Array<PartialSolver> = [
      {solve: eliminatePossibleStates},
      {solve: uniqueValueSetter},
    ];

    const before = solvingBoard.getEmptyCellsCount();
    for (const solver of solvers) {
      const actions = solver.solve(solvingBoard);
      console.log(actions.length);
      solvingBoard.takeActions(actions);
    }
    const after = solvingBoard.getEmptyCellsCount();

    console.log(solvingBoard.printBoard());
    if (before === after) {
      break;
    }
  }
}
