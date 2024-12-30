use generator::{generate_full, generate_puzzle_from_full};
use wasm_bindgen::prelude::*;

mod core;
mod generator;
mod solver;

use core::*;
use solver::*;

fn new_color_array_from_js_type(src: &[u8]) -> Result<ColorArray, JsError> {
    SudokuArray::try_from(src).map_err(|err| JsError::new(&err.to_string()))
}

fn fill_color_array_to_js_type(src: &ColorArray, dst: &mut [u8]) {
    dst.copy_from_slice(&src.as_slice());
}

#[wasm_bindgen]
pub fn fast_resolve(board: &mut [u8]) -> Result<usize, JsError> {
    let sudoku_array = new_color_array_from_js_type(&board)?;
    return match fast_solve_impl(&sudoku_array) {
        SolveResult::Invalid => todo!(),
        SolveResult::Unique(answer) => {
            fill_color_array_to_js_type(&answer, board);
            Ok(1)
        }
        SolveResult::Multiple(vec) => todo!(),
        SolveResult::Timeout => todo!(),
    };
}

#[wasm_bindgen]
pub fn generate(non_empty_cnt: u8, output_puzzle: &mut [u8]) {
    let answer = generate_full();
    let puzzle = generate_puzzle_from_full(&answer, non_empty_cnt as usize);
    fill_color_array_to_js_type(&puzzle, output_puzzle);
}
