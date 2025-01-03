import init, * as wasm from '../wasm/pkg/sudoku_wasm.js';
import * as theme from './theme.js';
import {GenericBoard} from './types.js';
import {GameController} from './game_controller.js';
import {Game} from './game.js';

async function waitForDifficulty(): Promise<number> {
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

function switchPage(to: HTMLElement) {
  Array.from(to.parentElement!.children).forEach(node => {
    node.classList.remove('visible');
  });

  to.classList.add('visible');
}

async function main() {
  theme.init();

  const initPageDom = document.getElementById('init-page')!;
  const loadingPageDom = document.getElementById('loading-page')!;
  const gamePageDom = document.getElementById('game-page')!;

  // Show the init page at first.
  switchPage(initPageDom);

  const difficulty = await waitForDifficulty();
  const clues = (4 - difficulty) * 14 - 9;

  // Show the loading page.
  switchPage(loadingPageDom);

  await init().catch(error => {
    console.error('Error initializing WASM module:', error);
  });

  wasm.init_panic_hook();
  console.log('wasm loaded');

  document.body.style.backgroundColor = theme.getCurrentTheme().colorBg;

  // Create a random game.
  console.log('Generating clues for %d', clues);
  const puzzleArr = new Uint8Array(81);
  wasm.generate(clues, puzzleArr);
  console.log('Puzzle generated: ', puzzleArr);
  const answerArr = new Uint8Array(puzzleArr);
  wasm.fast_resolve(answerArr);
  console.log('Answer generated: ', answerArr);

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
  switchPage(gamePageDom);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
