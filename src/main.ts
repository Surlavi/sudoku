import init, * as wasm from '../wasm/pkg/sudoku_wasm.js';
import {BoardUi} from './board_ui.js';
import * as types from './types.js';
import * as resolve from './resolve.js';

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

function startUi() {
  const appDomNode = document.getElementById('app');
  if (appDomNode === null) {
    console.log('Failed to find the dom node');
    return;
  }

  const board = resolve.ResolvingBoard.createBoardFromString(BOARD_EXAMPLE);
  const boardUi = new BoardUi(
    appDomNode,
    resolve.ResolvingBoard.createFromBoard(board),
  );
  boardUi.setSize(800);
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
