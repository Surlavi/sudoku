use std::time::Duration;
use wasm_bindgen::prelude::*;
use web_time::Instant;

use core::*;
use generator::{generate_answer, generate_puzzle_from_answer};
use scorer::simple_score;
use solve_utils::SolveResult;

mod core;
mod fast_solver;
mod generator;
mod scorer;
mod solve_utils;
mod strategy_solver;

// Required by the bench lib.
pub use generator::GeneratorConfig;
pub use generator::generate_puzzle;

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
pub fn generate(difficulty: u8, output_puzzle: &mut [u8]) -> i32 {
    let answer = generate_answer();
    let target_clues = (4 - difficulty) * 14 - 9;
    let min_score = match difficulty {
        0 => 0,
        1 => 150,
        2 => 1000,
        _ => 2000,
    };
    let max_score = match difficulty {
        0 => 200,
        1 => 500,
        _ => 10000,
    };
    let timeout= Duration::from_secs(3);
    let now = Instant::now();
    loop {
        let puzzle = generate_puzzle_from_answer(
            &answer,
            GeneratorConfig {
                timeout: Some(timeout),
                target_clues_num: target_clues as NodeIndexType,
            },
        );
        let score = simple_score(&puzzle); 
        if (score < min_score || score > max_score) && now.elapsed() < timeout {
            continue;
        }
        fill_color_array_to_js_type(&puzzle, output_puzzle);
        return score;
    }
}
