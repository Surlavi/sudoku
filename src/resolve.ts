import * as types from './types.js';

import {
  ResolvingCell,
  CELLS_NUMBER,
  MAX_NUMBER,
  ResolvingCellState,
} from './types.js';

export class ResolvingBoard extends types.GenericBoard<ResolvingCell> {
  static createFromBoard(board: Readonly<types.Board>): ResolvingBoard {
    const cells = new Array<ResolvingCell>();
    for (const cell of board.cells) {
      if (cell.value === null) {
        cells.push(ResolvingCell.newResolving(cell.coordinate));
      } else {
        cells.push(ResolvingCell.newPrefilled(cell.coordinate, cell.value));
      }
    }
    return new ResolvingBoard(cells);
  }

  getEmptyCellsCount(): number {
    return this.cells.filter(
      cell => cell.state === ResolvingCellState.RESOLVING,
    ).length;
  }

  takeAction(action: Action) {
    console.log(actionToString(action));
    const cell = this.getCellByCoord(action.coordinate);
    switch (action.type) {
      case ActionType.REMOVE_DRAFT_NUMBER:
        // console.log(`before ${cell.possibleValues.toString()}`)
        cell.removePossibleValue(action.value);
        // console.log(`after ${cell.possibleValues.toString()}`)
        break;
      case ActionType.FILL_IN_NUMBER:
        cell.resolve(action.value);
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

interface PartialResolver {
  resolve(board: ResolvingBoard): Array<Action>;
}

function eliminatePossibleStates(board: ResolvingBoard): Array<Action> {
  const ret = new Array<Action>();
  const addAction = function (
    targetCell: ResolvingCell,
    value: number,
    sourceCell: ResolvingCell,
  ) {
    if (
      targetCell.state === ResolvingCellState.RESOLVING &&
      targetCell.possibleValues.has(value)
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
    if (cell.state === ResolvingCellState.RESOLVING) {
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

function uniqueValueSetter(board: ResolvingBoard): Array<Action> {
  const ret = new Array<Action>();
  const addAction = function (cell: ResolvingCell, value: number) {
    ret.push({
      coordinate: cell.coordinate,
      type: ActionType.FILL_IN_NUMBER,
      value: value,
      reasonString: null,
    });
  };

  for (let i = 0; i < CELLS_NUMBER; i++) {
    const cell = board.cells[i];
    if (cell.state !== ResolvingCellState.RESOLVING) {
      continue;
    }
    const value = cell.possibleValues.getUnique();
    if (value !== null) {
      addAction(cell, value);
    }
  }

  return ret;
}

export function resolve(board: types.Board) {
  const resolvingBoard = ResolvingBoard.createFromBoard(board);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const resolvers: Array<PartialResolver> = [
      {resolve: eliminatePossibleStates},
      {resolve: uniqueValueSetter},
    ];

    const before = resolvingBoard.getEmptyCellsCount();
    for (const resolver of resolvers) {
      const actions = resolver.resolve(resolvingBoard);
      console.log(actions.length);
      resolvingBoard.takeActions(actions);
    }
    const after = resolvingBoard.getEmptyCellsCount();

    console.log(resolvingBoard.printBoard());
    if (before === after) {
      break;
    }
  }

  // console.log(resolvingBoard.printBoard());
  // for (const cell of resolvingBoard.cells){
  // console.log(cell.possibleValues.toString());}
}
