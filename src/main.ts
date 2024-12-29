import init, * as wasm from '../wasm/pkg/sudoku_wasm.js';

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
    });
  } catch (error) {
    console.error('Error initializing WASM module:', error);
  }
}

main();
