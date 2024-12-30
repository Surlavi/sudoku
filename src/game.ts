import {Board, Coordinates} from './types.js';
import {ResolvingBoard} from './resolve.js';

// Game contains the logic related to one round of game. It's supposed to be independent of UI.
export class Game {
  answerBoard: Board;
  puzzleBoard: ResolvingBoard;

  constructor(answer: Board, puzzle: Board) {
    this.answerBoard = answer;
    this.puzzleBoard = ResolvingBoard.createFromBoard(puzzle);
  }

  fillInNumber(coord: Coordinates, value: number) {
    const cell = this.puzzleBoard.cells[coord.linearIndex];
    if (cell.hasNumber()) {
      console.log('%s already have number', coord);
      return;
    }

    // TODO: This part should be able to be controlled by rules.
    if (this.answerBoard.cells[coord.linearIndex].value !== value) {
      alert('Game over');
      return;
    }

    cell.fillNumber(value);
  }

  toggleDraftNumber(coord: Coordinates, value: number) {
    const cell = this.puzzleBoard.cells[coord.linearIndex];
    if (cell.hasNumber()) {
      console.log('%s already have number', coord);
      return;
    }

    if (cell.hasDraftNumber(value)) {
      cell.removeDraftNumber(value);
    } else {
      cell.addDraftNumber(value);
    }
  }
}
