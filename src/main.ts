import init, * as wasm from '../wasm/pkg/sudoku_wasm.js';
import * as theme from './theme.js';
import {GenericBoard} from './types.js';
import {GameController} from './game_controller.js';
import {Game} from './game.js';

function switchPage(from: HTMLElement | null, to: HTMLElement) {
  if (from !== null) {
    from.classList.remove('visible');
  }
  to.classList.add('visible');
}

async function main() {
  theme.init();

  const welcomePageDom = document.getElementById('welcome-page')!;

  // Show the welcome page at first.
  switchPage(null, welcomePageDom);

  await init().catch(error => {
    console.error('Error initializing WASM module:', error);
  });

  wasm.init_panic_hook();
  console.log('wasm loaded');
  const arr = new Uint8Array([
    4, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 0, 5, 0, 0, 9, 0, 0, 8, 0, 0, 0, 0, 6, 0, 0, 0, 7, 0, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 7, 0, 0, 5, 0, 3, 0, 0, 0, 0, 4, 0, 9, 0, 0,
    0, 0, 0, 0, 0, 0,
  ]);
  console.log(wasm.fast_resolve(arr));
  console.log(arr);

  document.body.style.backgroundColor = theme.getCurrentTheme().colorBg;

  const gamePageDom = document.getElementById('game-page')!;

  // Create a random game.
  const puzzleArr = new Uint8Array(81);
  wasm.generate(60, puzzleArr);
  const answerArr = new Uint8Array(puzzleArr);
  wasm.fast_resolve(answerArr);

  const answer = GenericBoard.createBoardFromString(
    answerArr.join('').replaceAll('0', '.'),
  );
  const puzzle = GenericBoard.createBoardFromString(
    puzzleArr.join('').replaceAll('0', '.'),
  );

  const game = new Game(answer, puzzle);
  const controller = new GameController(game, gamePageDom);

  // We can add logic to remove this listener when necessary in the future.
  window.addEventListener('keydown', ev => {
    if (controller.handleKeyDownEvent(ev)) {
      ev.preventDefault();
    }
  });

  window.addEventListener('click', () => {
    controller.handleOutOfBoundClick();
  });

  // Show the game page.
  switchPage(welcomePageDom, gamePageDom);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
