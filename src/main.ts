import init, * as wasm from '../wasm/pkg/sudoku_wasm.js';
import {BoardUi, Config, MoveDirection} from './board_ui.js';
import {getCurrentTheme} from './theme.js';
import {GenericBoard} from './types.js';
import {Game} from './game.js';

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

const ANSWER = `
4 8 3 9 2 1 6 7 5
9 6 7 3 4 5 8 2 1
2 5 1 8 7 6 4 3 9
5 4 8 1 3 2 9 6 7
7 3 9 5 6 4 1 8 2
1 2 6 7 9 8 2 5 4
3 7 2 6 8 9 5 1 4
8 1 4 2 5 3 7 6 9
6 9 5 4 1 7 3 8 2
`;

function startUi() {
  const appDomNode = document.getElementById('app');
  if (appDomNode === null) {
    console.log('Failed to find the dom node');
    return;
  }

  // Create a random game.
  const puzzleArr = new Uint8Array(81);
  wasm.generate(25, puzzleArr);
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
  const boardUi = new BoardUi(appDomNode, game.puzzleBoard, {
    size: 800,
    highlightCursorNeighbors: true,
    highlightNumber: true,
    highlightNumberNeighbors: true,
  });

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
    }
  });
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
      startUi();
    });
  } catch (error) {
    console.error('Error initializing WASM module:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
