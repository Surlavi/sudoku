use std::time::Duration;
use wasm_bindgen::prelude::*;

use core::*;
use generator::{generate_answer, generate_puzzle_from_answer, GeneratorConfig};
use scorer::simple_score;
use solve_utils::SolveResult;

mod core;
mod fast_solver;
mod generator;
mod scorer;
mod solve_utils;
mod strategy_solver;

fn new_color_array_from_js_type(src: &[u8]) -> Result<ColorArray, JsError> {
    ColorArray::try_from(src).map_err(|err| JsError::new(&err.to_string()))
}

fn fill_color_array_to_js_type(src: &ColorArray, dst: &mut [u8]) {
    dst.copy_from_slice(src.as_slice());
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn fast_solve(board: &mut [u8]) -> Result<usize, JsError> {
    let sudoku_array = new_color_array_from_js_type(board)?;
    match fast_solver::solve(&sudoku_array) {
        SolveResult::Invalid => todo!(),
        SolveResult::Unique(answer) => {
            fill_color_array_to_js_type(&answer, board);
            Ok(1)
        }
        SolveResult::Multiple => todo!(),
    }
}

#[wasm_bindgen]
pub fn generate(non_empty_cnt: u8, output_puzzle: &mut [u8]) -> i32 {
    let answer = generate_answer();
    let puzzle = generate_puzzle_from_answer(
        &answer,
        GeneratorConfig {
            timeout: Some(Duration::from_secs(5)),
            target_clues_num: non_empty_cnt as NodeIndexType,
        },
    );
    fill_color_array_to_js_type(&puzzle, output_puzzle);
    simple_score(&puzzle)
}
