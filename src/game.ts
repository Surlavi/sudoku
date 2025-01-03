import {Board, Coordinates} from './types.js';
import {eliminatePossibleStates, ResolvingBoard} from './resolve.js';

// Game contains the logic related to one round of game. It's supposed to be independent of UI.
export class Game {
  answerBoard: Board;
  puzzleBoard: ResolvingBoard;
  savedPuzzleBoard: ResolvingBoard | null = null;
  startTime: DOMHighResTimeStamp;
  endTime: DOMHighResTimeStamp | null = null;
  mistakes = 0;

  constructor(answer: Board, puzzle: Board) {
    this.answerBoard = answer;
    this.puzzleBoard = ResolvingBoard.createFromBoard(puzzle);
    this.startTime = performance.now();
  }

  fillInNumber(coord: Coordinates, value: number) {
    const cell = this.puzzleBoard.cells[coord.linearIndex];
    if (cell.hasNumber()) {
      console.log('%s already have number', coord);
      return;
    }

    // TODO: This part should be able to be controlled by rules.
    if (this.answerBoard.cells[coord.linearIndex].value !== value) {
      alert('Not correct :)');
      this.mistakes++;
      return;
    }

    cell.fillNumber(value);

    // Remove all unavailable draft numbers.
    const actions = eliminatePossibleStates(this.puzzleBoard);
    this.puzzleBoard.takeActions(actions);

    if (this.isAllCorrect()) {
      this.endTime = performance.now();
      alert('Congratulations!!!');
    }
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

  recalculateDraftNumbers() {
    for (const cell of this.puzzleBoard.cells) {
      if (!cell.hasNumber()) {
        cell.addAllDraftNumber();
      }
    }
    const actions = eliminatePossibleStates(this.puzzleBoard);
    this.puzzleBoard.takeActions(actions);
  }

  getEmptyCellsCount(): number {
    let cnt = 0;
    for (const cell of this.puzzleBoard.cells) {
      if (!cell.hasNumber()) {
        cnt++;
      }
    }
    return cnt;
  }

  getElapsedSeconds(): number {
    let end = performance.now();
    if (this.endTime !== null) {
      end = this.endTime;
    }
    return Math.round((end - this.startTime) / 1000);
  }

  private isAllCorrect(): boolean {
    for (let i = 0; i < 81; ++i) {
      if (this.puzzleBoard.cells[i].value !== this.answerBoard.cells[i].value) {
        return false;
      }
    }
    return true;
  }

  saveState() {
    this.savedPuzzleBoard = this.puzzleBoard.clone();
  }

  loadState() {
    if (this.savedPuzzleBoard === null) {
      console.error('No saved data');
      return;
    }
    this.puzzleBoard = this.savedPuzzleBoard;
    this.savedPuzzleBoard = null;
  }
}
