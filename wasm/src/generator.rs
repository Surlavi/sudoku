use std::time::Duration;
use web_time::Instant;

use rand::{seq::SliceRandom, thread_rng};

use crate::*;

#[derive(Clone, Copy)]
pub struct GeneratorConfig {
    pub timeout: Option<Duration>,
    pub target_clues_num: NodeIndexType,
}

// Verifies that the current value at idx is not empty and is valid.
fn validate_idx(arr: &ColorArray, i: usize) -> bool {
    if arr[i] == 0 || arr[i] > (COLOR_COUNT as u8) {
        return false;
    }
    for j in NEIGHBOR_ARRAY_MAP[i] {
        if arr[i] == arr[j] {
            return false;
        }
    }
    true
}

// Verifies that a sudoku array is valid (no empty cells).
pub fn validate(arr: &ColorArray) -> bool {
    for i in 0..NODE_COUNT {
        if !validate_idx(arr, i) {
            return false;
        }
    }
    true
}

pub fn count_clues(arr: &ColorArray) -> usize {
    let mut cnt = 0;
    for i in 0..NODE_COUNT {
        if arr[i] != 0 {
            cnt += 1;
        }
    }
    cnt
}

fn shuffle_colors() -> [u8; COLOR_COUNT] {
    let mut ret = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    ret.shuffle(&mut thread_rng());
    ret
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
    false
}

// Generates a full sudoku array (no empty cells) randomly.
pub fn generate_full() -> ColorArray {
    let mut arr = [0; NODE_COUNT];

    // Generate the first row directly.
    arr[..9].copy_from_slice(&shuffle_colors());
    generate_full_impl(&mut arr, COLOR_COUNT);
    if !validate(&arr) {
        panic!(
            "Failed to generate full array: {}",
            print_sudoku_array(&arr, u8::to_string)
        );
    }

    arr
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

    // Deterministic behavior in unit tests.
    // #[cfg(not(test))]
    {
        ret.shuffle(&mut thread_rng());
    }

    ret
}

fn nodes_sorted_by_connected_zeros(arr: &ColorArray) -> Vec<u8> {
    let nodes_to_try = shuffle_nodes();
    let count_zero_in_neighs = |i: u8| {
        let mut cnt = 0;
        for j in NEIGHBOR_ARRAY_MAP[i as usize] {
            if arr[j] == 0 {
                cnt += 1;
            }
        }
        cnt
    };
    // Try sort the nodes by the number of 0 value it connects to.
    let mut pairs = nodes_to_try
        .iter()
        .filter(|&&i| arr[i as usize] != 0)
        .map(|&i| (i, count_zero_in_neighs(i)))
        .collect::<Vec<_>>();
    pairs.sort_by_key(|x| x.1);
    pairs.iter().map(|x| x.0).collect()
}

#[allow(dead_code)]
fn nodes_sorted_by_colors_num(arr: &ColorArray) -> Vec<u8> {
    let mut colors = [0; COLOR_COUNT + 1];
    for i in 0..arr.len() {
        colors[arr[i] as usize] += 1;
    }

    let nodes_to_try = shuffle_nodes();
    // Try sort the nodes by the number of 0 value it connects to.
    let mut pairs = nodes_to_try
        .iter()
        .filter(|&&i| arr[i as usize] != 0)
        .map(|&i| (i, colors[arr[i as usize] as usize]))
        .collect::<Vec<_>>();
    pairs.sort_by_key(|x| x.1);
    pairs.iter().map(|x| x.0).collect()
}

struct IntermediateResult {
    best_puzzle: Option<ColorArray>,
    best_hint_cnt: usize,
}

impl IntermediateResult {
    fn new() -> Self {
        Self {
            best_puzzle: None,
            best_hint_cnt: NODE_COUNT,
        }
    }
    fn update_puzzle(&mut self, puzzle: &ColorArray) {
        let cnt = count_clues(puzzle);
        if cnt < self.best_hint_cnt {
            self.best_hint_cnt = cnt;
            self.best_puzzle = Some(*puzzle);
        }
    }
}

fn generate_puzzle_from_full_impl(
    answer: &ColorArray,
    arr: &mut ColorArray,
    config: GeneratorConfig,
    cannot_remove: &[bool; NODE_COUNT],
    tmp_result: &mut IntermediateResult,
) -> bool {
    match fast_solve(arr, Some(answer)) {
        SolveResult::Invalid => panic!("Got an invalid array"),
        SolveResult::Multiple => return false,
        SolveResult::Unique(_) => {
            // This is the good case.
            tmp_result.update_puzzle(arr);
        }
    }

    let current_non_empty = count_clues(arr);
    if current_non_empty <= config.target_clues_num {
        return true;
    }

    let mut cannot_remove_copy = *cannot_remove;
    for i in nodes_sorted_by_connected_zeros(arr) {
        if cannot_remove[i as usize] {
            continue;
        }
        if arr[i as usize] == 0 {
            continue;
        }
        let val = arr[i as usize];
        arr[i as usize] = 0;
        if generate_puzzle_from_full_impl(answer, arr, config, &cannot_remove_copy, tmp_result) {
            return true;
        }
        arr[i as usize] = val;
        cannot_remove_copy[i as usize] = true;
    }

    false
}

fn drop_number_uniformly(answer: &ColorArray) -> ColorArray {
    let mut pos = [[0u8;9];9];
    let mut cnt = [0 as u8; 9];
    for i in 0..81 {
        let c = answer[i];
        pos[c as usize - 1][cnt[c as usize - 1] as usize] = i as u8;
        cnt[c as usize - 1] += 1;
    }
    for i in 0..COLOR_COUNT {
        pos[i as usize].shuffle(&mut thread_rng())
    }
    let mut ret = *answer;
    for c in 0..COLOR_COUNT {
        for j in 0..6 {
            let p = pos[c as usize ][j];
            ret[p as usize] = 0;
        }
    }
    return ret;
}

fn generate_sequential(answer: &ColorArray, config: GeneratorConfig) -> ColorArray {
    loop {
        // let nodes_to_remove = shuffle_nodes();
        // let mut puzzle = *answer;
        // for i in 0..(NODE_COUNT - config.target_clues_num as usize) {
        //     puzzle[nodes_to_remove[i] as usize] = 0;
        // }
        let puzzle = drop_number_uniformly(answer);
        match fast_solve(&puzzle, Some(answer)) {
            SolveResult::Invalid => panic!(),
            SolveResult::Multiple => continue,
            SolveResult::Unique(_) => return puzzle,
        }
    }
}

fn generate_mix(answer: &ColorArray, config: GeneratorConfig) -> ColorArray {
    let now = Instant::now();
    let mut tmp_result = IntermediateResult::new();
    let mut loop_cnt = 0;
    loop {
        loop_cnt += 1;
        if let Some(timeout) = config.timeout {
            if now.elapsed() > timeout {
                println!(
                    "Found suboptimal result with clue cnt: {}, loop cnt: {}",
                    tmp_result.best_hint_cnt, loop_cnt
                );
                return tmp_result.best_puzzle.unwrap();
            }
        }

        let mut puzzle = generate_sequential(
            answer,
            GeneratorConfig {
                timeout: None,
                target_clues_num: 28,
            },
        );
        // println!("{:?}", fast_solve(&puzzle, None));
        if !generate_puzzle_from_full_impl(
            answer,
            &mut puzzle,
            config,
            &[false; NODE_COUNT],
            &mut tmp_result,
        ) {
            continue;
        }
        return puzzle;
    }
}

// Generates a puzzle from a full sudoku array randomly.
// target_non_empty controls the minimum number of the non-empty cells in the puzzle.
// It should not be smaller than 17.
pub fn generate_puzzle_from_full(answer: &ColorArray, config: GeneratorConfig) -> ColorArray {
    // let mut puzzle = ColorArray::new(**answer);
    // generate_puzzle_from_full_impl(
    //     answer,
    //     &mut puzzle,
    //     target_non_empty,
    //     &[false; NODE_COUNT],
    // );

    let puzzle = generate_mix(answer, config);

    // Validate the puzzle again.
    match fast_solve(&puzzle, None) {
        SolveResult::Unique(result) => {
            if result != *answer {
                panic!("Invalid state");
            }
        }
        _ => todo!(),
    }
    puzzle
}

pub fn generate_puzzle(config: GeneratorConfig) -> ColorArray {
    let arr = generate_full();
    return generate_puzzle_from_full(&arr, config);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_full() {
        // Only trigger the generation. It will validate itself.
        let arr = generate_full();
        print!("{}", print_sudoku_array(&arr, u8::to_string));
    }

    #[test]
    fn test_generate_sequential() {
        for i in 0..5 {
            println!("Iteration {}", i);
            let arr = generate_full();
            // 22~23 seems to be the threshold of the current algo: values lower than it will take much longer time to generate.
            let puzzle = generate_sequential(
                &arr,
                GeneratorConfig {
                    timeout: None,
                    target_clues_num: 28,
                },
            );
            print!("{}", print_sudoku_array(&puzzle, u8::to_string));
        }
    }

    #[test]
    fn test_generate_puzzle_e2e() {
        for i in 0..2 {
            println!("Iteration {}", i);
            let arr = generate_full();
            // 22~23 seems to be the threshold of the current algo: values lower than it will take much longer time to generate.
            let puzzle = generate_puzzle_from_full(
                &arr,
                GeneratorConfig {
                    timeout: Some(Duration::from_secs(1)),
                    target_clues_num: 17,
                },
            );
            print!("{}", print_sudoku_array(&puzzle, u8::to_string));
        }
    }

    #[test]
    fn test_generate_puzzle_from_full() {
        let arr = [
            5, 3, 9, 4, 8, 2, 6, 1, 7, 8, 6, 4, 9, 7, 1, 5, 2, 3, 7, 1, 2, 5, 3, 6, 4, 9, 8, 2, 5,
            6, 7, 4, 3, 9, 8, 1, 1, 4, 3, 8, 2, 9, 7, 5, 6, 9, 8, 7, 1, 6, 5, 3, 4, 2, 4, 7, 1, 6,
            9, 8, 2, 3, 5, 6, 2, 5, 3, 1, 4, 8, 7, 9, 3, 9, 8, 2, 5, 7, 1, 6, 4,
        ];

        for i in 0..2 {
            println!("Iteration {}", i);
            // 22~23 seems to be the threshold of the current algo: values lower than it will take much longer time to generate.
            let puzzle = generate_puzzle_from_full(
                &arr,
                GeneratorConfig {
                    timeout: Some(Duration::from_secs(1)),
                    target_clues_num: 17,
                },
            );
            print!("{}", print_sudoku_array(&puzzle, u8::to_string));
        }
    }
}
