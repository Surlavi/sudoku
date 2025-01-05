## Changelog

### 0.1.0

- Add basic game play, including:
  - Generate a random Sudoku puzzle with 3 levels of difficulty.
  - Physical keyboard support and touch screen support.
  - Highlight the cells/numbers on the board on clicking.
  - Save / load the current state during a game.
  - "Quick draft" functionality to add all the possible draft numbers in unsolved cells.

## Development

- Environment
  - Tested with
    - nodejs v21.7.3;
    - Rust 1.83.0.
  - `npm install`
- Build
  - `sh build.sh`
- Run unit tests
  - `npm run test`
  - `cargo test --release`
- Benchmark unit tests in rust:
  - Example on wsl: `PERF=/usr/lib/linux-tools/5.4.0-204-generic/perf flamegraph -- target/release/deps/sudoku_wasm-...`
- Format code
  - `npm run fix`
  - `cargo fmt` && `cargo clippy`
- Publish demo to GitHub Pages:
  - `sh publish.sh`

## TODO list
- Helps for keyboard shortcut.
- More configuration for new games (penalty on mistakes, etc.).
- UI theme settings.
- Hint supports.
- Multiplayer supports?
