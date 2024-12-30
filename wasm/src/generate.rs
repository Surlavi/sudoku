use rand::{seq::SliceRandom, thread_rng};

use crate::*;

// Verifies that the current value at idx is not empty and is valid.
fn validate_idx(arr: &ColorArray, i: usize) -> bool {
    if arr[i] <= 0 || arr[i] > (COLOR_COUNT as u8) {
        return false;
    }
    for j in NEIGHBOR_ARRAY_MAP[i] {
        if arr[i] == arr[j] {
            return false;
        }
    }
    return true;
}

// Verifies that a sudoku array is valid (no empty cells).
pub fn validate(arr: &ColorArray) -> bool {
    for i in 0..NODE_COUNT {
        if !validate_idx(arr, i) {
            return false;
        }
    }
    return true;
}

fn shuffle_colors() -> [u8; COLOR_COUNT] {
    let mut ret = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    ret.shuffle(&mut thread_rng());
    return ret;
}

fn generate_full_impl(arr: &mut ColorArray, i: usize) -> bool {
    if i == NODE_COUNT {
        return true;
    }

    let colors = shuffle_colors();
    for c in colors {
        arr[i] = c;
        if validate_idx(arr, i) && generate_full_impl(arr, i + 1) {
            return true;
        }
        arr[i] = 0;
    }
    return false;
}

// Generates a full sudoku array (no empty cells) randomly.
pub fn generate_full() -> ColorArray {
    let mut arr = ColorArray::new([0; NODE_COUNT]);

    // Generate the first row directly.
    arr[..9].copy_from_slice(&shuffle_colors());
    generate_full_impl(&mut arr, COLOR_COUNT);
    if (!validate(&arr)) {
        panic!(
            "Failed to generate full array: {}",
            print_sudoku_array(&arr, u8::to_string)
        );
    }

    return ColorArray::new(*arr);
}

const fn create_nodes_array() -> [u8; NODE_COUNT] {
    let mut arr: [u8; NODE_COUNT] = [0; NODE_COUNT];
    let mut i = 0;
    while i < NODE_COUNT {
        arr[i] = i as u8;
        i += 1;
    }
    arr
}

const NODES_ARRAY: [u8; NODE_COUNT] = create_nodes_array();

fn shuffle_nodes() -> [u8; NODE_COUNT] {
    let mut ret = NODES_ARRAY;
    ret.shuffle(&mut thread_rng());
    return ret;
}

fn generate_puzzle_from_full_impl(
    arr: &mut ColorArray,
    current_non_empty: usize,
    target_non_empty: usize,
    cannot_remove: &[bool; NODE_COUNT],
) -> bool {
    match fast_solve_impl(&arr) {
        SolveResult::Invalid => panic!("Got an invalid array"),
        SolveResult::Multiple(_) => {
            print!("Not unique: {}\n", current_non_empty);
            return false;
        }
        SolveResult::Timeout => todo!(),
        SolveResult::Unique(_) => {
            // This is the good case.
        }
    }

    if current_non_empty == target_non_empty {
        return true;
    }

    let mut cannot_remove_copy = cannot_remove.clone();
    for i in shuffle_nodes() {
        if cannot_remove[i as usize] {
            continue;
        }
        if arr[i as usize] == 0 {
            continue;
        }
        let val = arr[i as usize];
        arr[i as usize] = 0;
        if (generate_puzzle_from_full_impl(
            arr,
            current_non_empty - 1,
            target_non_empty,
            &cannot_remove_copy,
        )) {
            return true;
        }
        arr[i as usize] = val;
        cannot_remove_copy[i as usize] = true;
    }

    return false;
}

// Generates a puzzle from a full sudoku array randomly.
// target_non_empty controls the minimum number of the non-empty cells in the puzzle.
// It should not smaller than 17.
pub fn generate_puzzle_from_full(arr: &ColorArray, target_non_empty: usize) -> ColorArray {
    let mut puzzle = ColorArray::new(**arr);
    generate_puzzle_from_full_impl(
        &mut puzzle,
        NODE_COUNT,
        target_non_empty,
        &[false; NODE_COUNT],
    );
    match (fast_solve_impl(&puzzle)) {
        SolveResult::Unique(answer) => {
            if answer != *arr {
                panic!("Invalid state");
            }
        }
        _ => todo!(),
    }
    return puzzle;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_full() {
        // Only trigger the generation. It will validate itself.
        generate_full();
    }

    #[test]
    fn test_generate_puzzle_from_full() {
        let arr = generate_full();
        // 25 seems to be the threshold of the current algo: values lower than it will take much longer time to generate.
        let puzzle = generate_puzzle_from_full(&arr, 25);
        print!("{}", print_sudoku_array(&puzzle, u8::to_string));
    }
}
