import { BoardUi,MoveDirection } from "./board_ui.js";
import { Game } from "./game.js";


function secondsToHumanReadable(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

const HTML_CONTENT = `
<div id="board-banner">
  <span style="text-align: left;">Timer:&nbsp;<span id="value-timer">0:00</span>
  </span><span style="text-align: center;">Mistakes:&nbsp;<span id="value-mistakes">0</span>&nbsp;
  </span><span style="text-align: right;">Remaining:&nbsp;<span id="value-remaining">0</span>&nbsp;
  </span>
</div>
<div id="board" style="position: relative;">
</div>`;

export class GameController {
  game: Game;
  pageDom: HTMLElement;
  boardUi: BoardUi;

  constructor(game: Game, pageDom: HTMLElement) {
    this.game = game;
    this.pageDom = pageDom;

    // Update internal html.
    this.pageDom.setHTMLUnsafe(HTML_CONTENT);

    const boardDom = document.getElementById('board')!;
    this.boardUi = new BoardUi(boardDom, game.puzzleBoard, {
      size: boardDom.clientWidth,
      highlightCursorNeighbors: true,
      highlightNumber: true,
      highlightNumberNeighbors: true,
    });

    this.refreshBanner();
  }

  handleKeyDownEvent(ev: KeyboardEvent) {
    let direction: MoveDirection | null = null;
    let value: number | null = null;

    console.log(ev);

    switch (ev.code) {
      case 'ArrowUp':
        direction = MoveDirection.UP;
        break;
      case 'ArrowDown':
        direction = MoveDirection.DOWN;
        break;
      case 'ArrowLeft':
        direction = MoveDirection.LEFT;
        break;
      case 'ArrowRight':
        direction = MoveDirection.RIGHT;
        break;
      case 'Digit1':
      case 'Digit2':
      case 'Digit3':
      case 'Digit4':
      case 'Digit5':
      case 'Digit6':
      case 'Digit7':
      case 'Digit8':
      case 'Digit9':
        value = parseInt(ev.code.charAt(5));
        break;
      case 'KeyD':
        this.game.recalculateDraftNumbers();
        this.boardUi.updateBoard();
        break;
      default:
        // Do nothing now.
        break;
    }
    if (direction !== null) {
      this.boardUi.moveCursor(direction);
      ev.preventDefault();
    }
    if (value !== null && this.boardUi.cursorCoord !== null) {
      console.log('hit %d', value);
      if (ev.shiftKey) {
        this.game.fillInNumber(this.boardUi.cursorCoord, value);
      } else {
        this.game.toggleDraftNumber(this.boardUi.cursorCoord, value);
      }
      this.boardUi.updateBoard();
      this.refreshBanner(true);
    }
  }

  refreshBanner(once = false) {
    console.log('called');

    const timerDom = document.getElementById('value-timer')!;
    const mistakesDom = document.getElementById('value-mistakes')!;
    const remainingDom = document.getElementById('value-remaining')!;

    timerDom.textContent = `${secondsToHumanReadable(this.game.getElapsedSeconds())}`;
    mistakesDom.textContent = `${this.game.mistakes}`;
    remainingDom.textContent = `${this.game.getEmptyCellsCount()}`;

    // TODO: Add stop condition.
    if (!once) {
      setTimeout(this.refreshBanner, 1000);
    }
  }
}
