import init, * as wasm from '../wasm/pkg/sudoku_wasm.js';
import {getCurrentTheme} from './theme.js';
import {GenericBoard} from './types.js';
import {GameController} from './game_controller.js';
import {Game} from './game.js';

function startUi() {
  const welcomePageDom = document.getElementById('welcome-page')!;
  const gamePageDom = document.getElementById('game-page')!;

  // Create a random game.
  const puzzleArr = new Uint8Array(81);
  wasm.generate(60, puzzleArr);

  welcomePageDom.style.opacity = '0';

  const answerArr = new Uint8Array(puzzleArr);
  wasm.fast_resolve(answerArr);

  document.body.style.backgroundColor = getCurrentTheme().color_background;

  const answer = GenericBoard.createBoardFromString(
    answerArr.join('').replaceAll('0', '.'),
  );
  const puzzle = GenericBoard.createBoardFromString(
    puzzleArr.join('').replaceAll('0', '.'),
  );

  const game = new Game(answer, puzzle);
  const controller = new GameController(game, gamePageDom);

  gamePageDom!.style.opacity = '1';

  // We can add logic to remove this listener when necessary in the future.
  window.addEventListener('keydown', ev => {
    controller.handleKeyDownEvent(ev);
  });
}

async function main() {
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
  startUi();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
