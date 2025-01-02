use generator::{generate_full, generate_puzzle_from_full};
use wasm_bindgen::prelude::*;

mod core;
mod generator;
mod solver;

use core::*;
use solver::*;
use std::time::Duration;

pub use generator::generate_puzzle;
pub use generator::GeneratorConfig;

fn new_color_array_from_js_type(src: &[u8]) -> Result<ColorArray, JsError> {
    SudokuArray::try_from(src).map_err(|err| JsError::new(&err.to_string()))
}

fn fill_color_array_to_js_type(src: &ColorArray, dst: &mut [u8]) {
    dst.copy_from_slice(src.as_slice());
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn fast_resolve(board: &mut [u8]) -> Result<usize, JsError> {
    let sudoku_array = new_color_array_from_js_type(board)?;
    match fast_solve(&sudoku_array, None) {
        SolveResult::Invalid => todo!(),
        SolveResult::Unique(answer) => {
            fill_color_array_to_js_type(&answer, board);
            Ok(1)
        }
        SolveResult::Multiple(_) => todo!(),
        SolveResult::Timeout => todo!(),
    }
}

#[wasm_bindgen]
pub fn generate(non_empty_cnt: u8, output_puzzle: &mut [u8]) {
    let answer = generate_full();
    let puzzle = generate_puzzle_from_full(
        &answer,
        GeneratorConfig {
            timeout: Some(Duration::from_secs(3)),
            target_clues_num: non_empty_cnt as NodeIndexType,
        },
    );
    fill_color_array_to_js_type(&puzzle, output_puzzle);
}
