import init, * as wasm from '../wasm/pkg/sudoku_wasm.js';
import * as theme from './theme.js';
import * as types from './types.js';
import {GameController} from './game_controller.js';
import {Game} from './game.js';

async function waitForDifficultyInput(): Promise<number> {
  return new Promise(resolve => {
    const btns = document.getElementsByClassName('btn-difficulty');
    Array.from(btns).forEach(btn => {
      const val = parseInt((btn as HTMLElement).dataset['value']!);
      if (Number.isNaN(val)) {
        console.error('Invalid value');
        return;
      }
      btn.addEventListener('click', () => {
        resolve(val);
      });
    });
  });
}

// Switches to page `to` and hide other pages.
function switchPage(to: HTMLElement) {
  Array.from(to.parentElement!.children).forEach(node => {
    node.classList.remove('visible');
  });

  to.classList.add('visible');
}

async function main() {
  theme.init();

  const appContainerDom = document.getElementById('app-container')!;

  document.documentElement.style.setProperty('--scale-factor', `${appContainerDom.clientWidth / 640}`);

  const initPageDom = document.getElementById('init-page')!;
  const loadingPageDom = document.getElementById('loading-page')!;
  const gamePageDom = document.getElementById('game-page')!;

  // Show the init page at first.
  switchPage(initPageDom);

  // Get the difficulty selected by the user.
  const difficulty = await waitForDifficultyInput();

  // Show the loading page.
  switchPage(loadingPageDom);

  await init().catch(error => {
    console.error('Error initializing WASM module:', error);
  });

  // So that panic output will look better in the console.
  wasm.init_panic_hook();
  console.debug('wasm loaded');

  // Create a random game.
  console.debug('Generating game with difficulty: %d', difficulty);
  const puzzleArr = new Uint8Array(types.CELLS_NUMBER);
  const score = wasm.generate(difficulty, puzzleArr);
  console.debug('Puzzle generated: ', puzzleArr);
  console.info('Puzzle score: ', score);
  const answerArr = new Uint8Array(puzzleArr);
  wasm.fast_solve(answerArr);
  console.debug('Answer generated: ', answerArr);

  const answer = types.GenericBoard.createBoardFromUint8Array(answerArr);
  const puzzle = types.GenericBoard.createBoardFromUint8Array(puzzleArr);

  const game = new Game(answer, puzzle);
  const controller = new GameController(game, gamePageDom);

  // Register global keyboard and mouse event.
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
  switchPage(gamePageDom);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
