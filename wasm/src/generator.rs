use std::{
    cmp::{max, min},
    time::Duration,
};
use web_time::Instant;

use rand::{seq::SliceRandom, thread_rng};

use crate::*;
use fast_solver::*;

#[derive(Clone, Copy)]
pub struct GeneratorConfig {
    pub timeout: Option<Duration>,
    pub target_clues_num: NodeIndexType,
}

fn shuffle_colors() -> [ColorType; COLOR_COUNT] {
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
        if arr.validate_color_at_idx(c, i) && generate_full_impl(arr, i + 1) {
            return true;
        }
        arr[i] = 0;
    }
    false
}

// Generates a full sudoku array (no empty cells) randomly.
pub fn generate_answer() -> ColorArray {
    let mut arr = [0; NODE_COUNT];

    // Generate the first row directly.
    arr[..COLOR_COUNT].copy_from_slice(&shuffle_colors());
    generate_full_impl(&mut arr, COLOR_COUNT);
    if !arr.validate_colors(true) {
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

// Shuffles the nodes index randomly.
fn shuffle_nodes() -> [u8; NODE_COUNT] {
    let mut ret = NODES_ARRAY;
    ret.shuffle(&mut thread_rng());
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
        let cnt = puzzle.count_clues();
        if cnt < self.best_hint_cnt {
            self.best_hint_cnt = cnt;
            self.best_puzzle = Some(*puzzle);
        }
    }
}

fn generate_puzzle_from_answer_dfs(
    answer: &ColorArray,
    arr: &mut ColorArray,
    config: GeneratorConfig,
    cannot_remove: &[bool; NODE_COUNT],
    tmp_result: &mut IntermediateResult,
) -> bool {
    match check_puzzle_has_unique_answer(arr, answer) {
        true => tmp_result.update_puzzle(arr),
        false => return false,
    }

    let current_non_empty = arr.count_clues();
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
        if generate_puzzle_from_answer_dfs(answer, arr, config, &cannot_remove_copy, tmp_result) {
            return true;
        }
        arr[i as usize] = val;
        cannot_remove_copy[i as usize] = true;
    }

    false
}

fn drop_numbers_uniformly(answer: &ColorArray, target_clues_num: NodeIndexType) -> ColorArray {
    let mut pos = [[0u8; COLOR_COUNT]; COLOR_COUNT];
    let mut cnt = [0_u8; COLOR_COUNT];
    for i in 0..NODE_COUNT {
        let c = answer[i];
        pos[c as usize - 1][cnt[c as usize - 1] as usize] = i as u8;
        cnt[c as usize - 1] += 1;
    }
    for i in 0..COLOR_COUNT {
        pos[i].shuffle(&mut thread_rng())
    }
    let mut ret = *answer;

    // Leave 81-6*9=27 at least. Leaving 21 numbers is very inefficient.
    let steps = min((NODE_COUNT - target_clues_num) / COLOR_COUNT, 6);
    for c in 0..COLOR_COUNT {
        for j in 0..steps {
            let p = pos[c][j];
            ret[p as usize] = 0;
        }
    }
    ret
}

fn generate_puzzle_by_random_sequence(answer: &ColorArray, config: GeneratorConfig) -> ColorArray {
    loop {
        let puzzle = drop_numbers_uniformly(answer, config.target_clues_num);
        match check_puzzle_has_unique_answer(&puzzle, answer) {
            true => return puzzle,
            false => continue,
        }
    }
}

fn generate_puzzle_from_answer_impl(answer: &ColorArray, config: GeneratorConfig) -> ColorArray {
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

        let mut puzzle = generate_puzzle_by_random_sequence(
            answer,
            GeneratorConfig {
                timeout: None,
                target_clues_num: max(config.target_clues_num, 27),
            },
        );

        if !generate_puzzle_from_answer_dfs(
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
pub fn generate_puzzle_from_answer(answer: &ColorArray, config: GeneratorConfig) -> ColorArray {
    let puzzle = generate_puzzle_from_answer_impl(answer, config);

    // Validate the puzzle again.
    match fast_solver::solve(&puzzle) {
        SolveResult::Unique(result) => {
            if result != *answer {
                panic!("Invalid state");
            }
        }
        _ => panic!(),
    }
    puzzle
}

pub fn generate_puzzle(config: GeneratorConfig) -> ColorArray {
    let arr = generate_answer();
    generate_puzzle_from_answer(&arr, config)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_answer() {
        let answer = generate_answer();
        assert!(answer.validate_colors(true));
    }

    #[test]
    fn test_generate_puzzle_by_random_sequence_28() {
        let answer = generate_answer();
        let puzzle = generate_puzzle_by_random_sequence(
            &answer,
            GeneratorConfig {
                timeout: None,
                target_clues_num: 28,
            },
        );
        assert_eq!(puzzle.count_clues(), 36);
    }

    #[test]
    fn test_generate_puzzle_by_random_sequence_27() {
        let answer = generate_answer();
        let puzzle = generate_puzzle_by_random_sequence(
            &answer,
            GeneratorConfig {
                timeout: None,
                target_clues_num: 27,
            },
        );
        assert_eq!(puzzle.count_clues(), 27);
    }

    #[test]
    fn test_generate_puzzle_from_answer() {
        let answer = [
            5, 3, 9, 4, 8, 2, 6, 1, 7, 8, 6, 4, 9, 7, 1, 5, 2, 3, 7, 1, 2, 5, 3, 6, 4, 9, 8, 2, 5,
            6, 7, 4, 3, 9, 8, 1, 1, 4, 3, 8, 2, 9, 7, 5, 6, 9, 8, 7, 1, 6, 5, 3, 4, 2, 4, 7, 1, 6,
            9, 8, 2, 3, 5, 6, 2, 5, 3, 1, 4, 8, 7, 9, 3, 9, 8, 2, 5, 7, 1, 6, 4,
        ];

        let puzzle = generate_puzzle_from_answer(
            &answer,
            GeneratorConfig {
                timeout: Some(Duration::from_secs(1)),
                target_clues_num: 17,
            },
        );

        assert_eq!(solve(&puzzle), SolveResult::Unique(answer));
    }

    #[test]
    fn test_generate_puzzle() {
        let answer = generate_answer();
        let puzzle = generate_puzzle_from_answer(
            &answer,
            GeneratorConfig {
                timeout: Some(Duration::from_secs(1)),
                target_clues_num: 17,
            },
        );
        assert!(puzzle.count_clues() < 27);
    }
}
