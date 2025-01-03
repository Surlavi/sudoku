import {BoardUi, MoveDirection} from './board_ui.js';
import {Game} from './game.js';

function secondsToHumanReadable(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

function keyCodeToDirection(code: string): MoveDirection {
  switch (code) {
    case 'ArrowUp':
      return MoveDirection.UP;
    case 'ArrowDown':
      return MoveDirection.DOWN;
    case 'ArrowLeft':
      return MoveDirection.LEFT;
    case 'ArrowRight':
      return MoveDirection.RIGHT;
    default:
      throw new Error('Unreachable');
  }
}

const HTML_CONTENT = `
<p id="notification" class="hidden">Prompt</p>
<div id="board-banner">
  <span style="text-align: left;">Timer:&nbsp;<span id="value-timer">0:00</span>
  </span><span style="text-align: center;">Mistakes:&nbsp;<span id="value-mistakes">0</span>&nbsp;
  </span><span style="text-align: right;">Remaining:&nbsp;<span id="value-remaining">0</span>&nbsp;
  </span>
</div>
<div id="board" style="position: relative;"></div>
<div id="board-buttons">
  <span class="btn-default enabled" id="btn-new-game">New Game</span>
  <span class="btn-default enabled" id="btn-quick-draft">Quick Draft</span>
  <span class="btn-default enabled" id="btn-save">Save</span>
  <span class="btn-default enabled" id="btn-load">Load</span>
</div>
<div id="num-keyboard"></div>`;

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
    const keyboardDom = document.getElementById('num-keyboard')!;
    this.boardUi = new BoardUi(
      boardDom,
      game.puzzleBoard,
      keyboardDom,
      this.handleVirtualKeyboardClickEvent.bind(this),
      {
        size: boardDom.clientWidth,
        highlightCursorNeighbors: true,
        highlightNumber: true,
        highlightNumberNeighbors: true,
      },
    );

    this.refreshBanner();

    // Button functions.
    const quickDraftBtn = document.getElementById('btn-quick-draft');
    quickDraftBtn?.addEventListener('click', ev => {
      ev.stopPropagation();
      this.game.recalculateDraftNumbers();
      this.boardUi.updateBoard();
    });

    const newGameBtn = document.getElementById('btn-new-game');
    newGameBtn!.addEventListener('click', ev => {
      ev.stopPropagation();
      if (confirm('Abort the current game and start a new one?') === true) {
        location.reload();
      }
    });

    const saveBtn = document.getElementById('btn-save')!;
    const loadBtn = document.getElementById('btn-load')!;
    const updateSaveLoadBtnState = () => {
      if (game.savedPuzzleBoard !== null) {
        loadBtn.classList.add('enabled');
        loadBtn.classList.remove('disabled');
      } else {
        loadBtn.classList.remove('enabled');
        loadBtn.classList.add('disabled');
      }
    };
    updateSaveLoadBtnState();
    saveBtn!.addEventListener('click', ev => {
      ev.stopPropagation();
      game.saveState();
      updateSaveLoadBtnState();
      this.showNotification('Saved');
    });
    loadBtn!.addEventListener('click', ev => {
      ev.stopPropagation();
      if (!loadBtn.classList.contains('enabled')) {
        return;
      }
      if (confirm('Load previously saved state?') === true) {
        game.loadState();
        this.boardUi.updateBoard(game.puzzleBoard);
        updateSaveLoadBtnState();
        this.showNotification('Loaded');
      }
    });
  }

  handleKeyDownEvent(ev: KeyboardEvent): boolean {
    console.log(ev);
    switch (ev.code) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.boardUi.moveCursor(keyCodeToDirection(ev.code));
        return true;
      case 'Digit1':
      case 'Digit2':
      case 'Digit3':
      case 'Digit4':
      case 'Digit5':
      case 'Digit6':
      case 'Digit7':
      case 'Digit8':
      case 'Digit9':
        this.handleDigitKeyEvent(ev);
        return true;
      case 'KeyD':
        this.game.recalculateDraftNumbers();
        this.boardUi.updateBoard();
        return true;
      default:
        // Do nothing now.
        return false;
    }
  }

  private handleDigitKeyEvent(ev: KeyboardEvent) {
    const value = parseInt(ev.code.charAt(5));
    if (this.boardUi.cursorCoord !== null) {
      this.handleVirtualKeyboardClickEvent(value, !ev.shiftKey);
    }
  }

  private handleVirtualKeyboardClickEvent(value: number, draftMode: boolean) {
    if (this.boardUi.cursorCoord === null) {
      return;
    }
    console.log('hit %d', value);
    if (!draftMode) {
      this.game.fillInNumber(this.boardUi.cursorCoord, value);
    } else {
      this.game.toggleDraftNumber(this.boardUi.cursorCoord, value);
    }
    this.boardUi.updateBoard();
    this.refreshBanner(true);
  }

  handleOutOfBoundClick() {
    this.boardUi.updateCursor(null);
  }

  private showNotification(msg: string) {
    const dom = document.getElementById('notification')!;
    dom.innerText = msg;
    dom.classList.remove('hidden');
    setTimeout(() => {
      dom.classList.add('hidden');
    }, 2500);
  }

  private refreshBanner(once = false) {
    const timerDom = document.getElementById('value-timer')!;
    const mistakesDom = document.getElementById('value-mistakes')!;
    const remainingDom = document.getElementById('value-remaining')!;

    timerDom.textContent = `${secondsToHumanReadable(this.game.getElapsedSeconds())}`;
    mistakesDom.textContent = `${this.game.mistakes}`;
    remainingDom.textContent = `${this.game.getEmptyCellsCount()}`;

    // TODO: Add stop condition.
    if (!once) {
      setTimeout(() => {
        this.refreshBanner();
      }, 1000);
    }
  }
}
