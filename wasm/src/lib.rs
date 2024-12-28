use wasm_bindgen::prelude::*;

mod core;
mod solve;

use core::*;
use solve::*;

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        // let result = add(2, 2);
        // assert_eq!(result, 4);
    }
}
