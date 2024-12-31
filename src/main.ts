import init, * as wasm from '../wasm/pkg/sudoku_wasm.js';
import {BoardUi, MoveDirection} from './board_ui.js';
import {getCurrentTheme} from './theme.js';
import {GenericBoard} from './types.js';
import {Game} from './game.js';

function startUi() {
  const welcomeScreen = document.getElementById('welcome');
  if (welcomeScreen === null) {
    console.error('failed to load welcome screen');
    return;
  }

  const appContainerDomNode = document.getElementById('app-container');
  const appDomNode = document.getElementById('app');

  appDomNode!.style.height = `${appContainerDomNode!.clientHeight}px`;
  console.log('setting height to %d', appContainerDomNode!.clientHeight);

  const boardDomNode = document.getElementById('board');
  if (boardDomNode === null) {
    console.log('Failed to find the dom node');
    return;
  }

  // Create a random game.
  const puzzleArr = new Uint8Array(81);
  wasm.generate(60, puzzleArr);

  welcomeScreen.style.opacity = '0';

  const answerArr = new Uint8Array(puzzleArr);
  wasm.fast_resolve(answerArr);

  document.body.style.backgroundColor = getCurrentTheme().color_background;

  // const answer = GenericBoard.createBoardFromString(ANSWER);
  // const puzzle = GenericBoard.createBoardFromString(BOARD_EXAMPLE);
  const answer = GenericBoard.createBoardFromString(
    answerArr.join('').replaceAll('0', '.'),
  );
  const puzzle = GenericBoard.createBoardFromString(
    puzzleArr.join('').replaceAll('0', '.'),
  );
  const game = new Game(answer, puzzle);
  const boardUi = new BoardUi(boardDomNode, game.puzzleBoard, {
    size: boardDomNode.clientWidth,
    highlightCursorNeighbors: true,
    highlightNumber: true,
    highlightNumberNeighbors: true,
  });

  appDomNode!.style.opacity = '1';

  function refreshBanner(once = false) {
    console.log('called');

    const timerDom = document.getElementById('value-timer')!;
    const mistakesDom = document.getElementById('value-mistakes')!;
    const remainingDom = document.getElementById('value-remaining')!;

    timerDom.textContent = `${secondsToHumanReadable(game.getElapsedSeconds())}`;
    mistakesDom.textContent = `${game.mistakes}`;
    remainingDom.textContent = `${game.getEmptyCellsCount()}`;

    // TODO: Add stop condition.
    if (!once) {
      setTimeout(refreshBanner, 1000);
    }
  }

  refreshBanner();

  window.addEventListener('keydown', (ev: KeyboardEvent) => {
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
        game.recalculateDraftNumbers();
        boardUi.updateBoard();
        break;
      default:
        // Do nothing now.
        break;
    }
    if (direction !== null) {
      boardUi.moveCursor(direction);
      ev.preventDefault();
    }
    if (value !== null && boardUi.cursorCoord !== null) {
      console.log('hit %d', value);
      if (ev.shiftKey) {
        game.fillInNumber(boardUi.cursorCoord, value);
      } else {
        game.toggleDraftNumber(boardUi.cursorCoord, value);
      }
      boardUi.updateBoard();
      refreshBanner(true);
    }
  });
}

function secondsToHumanReadable(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function main() {
  console.log('called');
  try {
    await init().then(() => {
      console.log('loaded');
      const arr = new Uint8Array([
        4, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 9, 0, 0, 8, 0, 0, 0, 0, 6, 0, 0, 0, 7, 0,
        2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 7, 0, 0, 5, 0, 3, 0, 0, 0, 0, 4, 0,
        9, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      console.log(wasm.fast_resolve(arr));
      console.log(arr);
      wasm.init_panic_hook();
      startUi();
    });
  } catch (error) {
    console.error('Error initializing WASM module:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
