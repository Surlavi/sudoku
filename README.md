### Development

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

# TODO list
- Helps for keyboard shortcut.
- Touch screen support.
- Configuration for new games (difficulty, penalty on mistakes, etc.).
- UI theme settings.
- Hint supports.
- Multiplayer supports?
