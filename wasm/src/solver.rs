use std::{
    fmt::Debug,
    ops::{Deref, DerefMut},
};

use crate::*;

#[derive(Clone, Copy, PartialEq)]
struct Colors {
    arr: [bool; COLOR_COUNT + 1],
    // cnt is a bottleneck, so cache the value instead.
    cnt: usize,
}

impl Colors {
    fn new(val: bool) -> Self {
        Colors {
            arr: [val; COLOR_COUNT + 1],
            cnt: if val { COLOR_COUNT } else { 0 },
        }
    }

    #[allow(dead_code)]
    fn set(&mut self, color: u8) {
        if !self.arr[color as usize] {
            self.cnt += 1
        }
        self.arr[color as usize] = true;
    }

    fn del(&mut self, color: u8) -> bool {
        let val = self.arr[color as usize];
        if val {
            self.cnt -= 1
        }
        self.arr[color as usize] = false;
        val
    }

    #[allow(dead_code)]
    fn has(&self, color: u8) -> bool {
        self.arr[color as usize]
    }

    fn count(&self) -> usize {
        self.cnt
    }

    fn get_unique(&self) -> Option<u8> {
        let mut ret = None;
        for i in 1..COLOR_COUNT + 1 {
            if !self.arr[i] {
                continue;
            }
            match ret {
                Some(_) => return None,
                None => ret = Some(i as u8),
            }
        }
        ret
    }

    fn get_all_no_allocate(
        &self,
        hint_color: Option<u8>,
        output_buffer: &mut [u8; COLOR_COUNT],
    ) -> usize {
        // Uncomment for debugging.
        // if let Some(c) = hint_color {
        //     if !self.arr[c as usize] {
        //         panic!()
        //     }
        // }
        let mut ret = 0;
        let start_idx = hint_color.unwrap_or(1) - 1;
        for j in 0..COLOR_COUNT {
            // Note: start from the hint seems to be faster.
            let i = (start_idx + j as u8) % (COLOR_COUNT as u8) + 1;
            if self.arr[i as usize] {
                output_buffer[ret] = i;
                ret += 1;
            }
        }
        ret
    }

    fn get_all(&self) -> Vec<u8> {
        let mut buffer = [0; COLOR_COUNT];
        let cnt = self.get_all_no_allocate(None, &mut buffer);
        buffer[0..cnt].to_vec()
    }
}

impl Debug for Colors {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{{count: {}, unique: {:?}, colors: {:?}}}",
            self.count(),
            self.get_unique(),
            self.get_all()
        )
    }
}

#[derive(Clone, Copy, PartialEq)]
struct SolvingNode {
    color: u8,
    available_colors: Colors,
}

impl SudokuValue for SolvingNode {
    fn from_color(number: ColorType) -> Self {
        Self {
            color: number,
            available_colors: Colors::new(true),
        }
    }

    fn to_color(&self) -> ColorType {
        self.color
    }
}

#[derive(Clone, Copy, PartialEq)]
struct SolvingNodeArray(SudokuArrayType<SolvingNode>);

impl Deref for SolvingNodeArray {
    type Target = SudokuArrayType<SolvingNode>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for SolvingNodeArray {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl From<&ColorArray> for SolvingNodeArray {
    fn from(value: &ColorArray) -> Self {
        SolvingNodeArray(value.map(SolvingNode::from_color))
    }
}

impl From<&SolvingNodeArray> for ColorArray {
    fn from(val: &SolvingNodeArray) -> Self {
        val.0.map(|n| n.color)
    }
}

#[derive(Clone, Copy)]
struct NodeStack {
    items: [u8; NODE_COUNT],
    cnt: u8,
}

impl NodeStack {
    fn new() -> Self {
        NodeStack {
            items: [0; NODE_COUNT],
            cnt: 0,
        }
    }

    fn push(&mut self, node: u8) {
        self.items[self.cnt as usize] = node;
        self.cnt += 1;
    }

    fn pop(&mut self) -> Option<u8> {
        if self.cnt > 0 {
            self.cnt -= 1;
            Some(self.items[self.cnt as usize])
        } else {
            None
        }
    }

    fn empty(&self) -> bool {
        return self.cnt == 0;
    }
}

impl SolvingNodeArray {
    // Returns the impossible node after the elimination.
    fn eliminate_with_idx(
        &mut self,
        idx: NodeIndexType,
        fill_candidates: &mut NodeStack,
    ) -> Option<NodeIndexType> {
        let node = &self[idx];
        if node.color == 0 {
            return None;
        }
        let color = node.color;
        for neigh_idx in NEIGHBOR_ARRAY_MAP[idx] {
            let neigh = &mut self[neigh_idx];
            if neigh.color != 0 {
                continue;
            }
            if !neigh.available_colors.del(color) {
                continue;
            }
            let cnt = neigh.available_colors.count();
            if cnt == 1 {
                fill_candidates.push(neigh_idx as u8);
            }
            if cnt == 0 {
                // It's impossible to fill in this cell.
                return Some(neigh_idx);
            }
        }
        None
    }

    fn eliminate(
        &mut self,
        idx: Option<NodeIndexType>,
        fill_candidates: &mut NodeStack,
    ) -> Option<NodeIndexType> {
        if let Some(val) = idx {
            return self.eliminate_with_idx(val, fill_candidates);
        }

        for i in 0..self.len() {
            if let Some(v) = self.eliminate_with_idx(i, fill_candidates) {
                return Some(v);
            }
        }
        None
    }

    // Consumes `fill_candidates`, returns the next round of fill candidates, or
    // None if we found that the puzzle is not solvable.
    fn fill_all(&mut self, fill_candidates: &mut NodeStack) -> Option<NodeStack> {
        let mut new_fill_candidates = NodeStack::new();
        while let Some(idx) = fill_candidates.pop() {
            let i = idx as usize;
            if self[i].color != 0 {
                continue;
            }
            if self[i].available_colors.count() != 1 {
                continue;
            }
            self[i].color = self[i].available_colors.get_unique().unwrap();
            if self
                .eliminate_with_idx(i, &mut new_fill_candidates)
                .is_some()
            {
                return None;
            }
        }

        return Some(new_fill_candidates);
    }

    fn eliminate_and_fill(&mut self, idx: Option<NodeIndexType>) -> Option<SolveResult> {
        let mut fill_candidates = NodeStack::new();

        if self.eliminate(idx, &mut fill_candidates).is_some() {
            return Some(SolveResult::Invalid);
        }

        while !fill_candidates.empty() {
            match self.fill_all(&mut fill_candidates) {
                Some(v) => fill_candidates = v,
                None => return Some(SolveResult::Invalid),
            }
        }
        if self.uncolored_node_count() == 0 {
            return Some(SolveResult::Unique(self.0.to_color_array()));
        }
        None
    }
}

struct FastSolver<'a> {
    node_arr: SolvingNodeArray,
    hint_answer: Option<&'a ColorArray>,
}

impl FastSolver<'_> {
    fn solve(puzzle: &ColorArray, hint_answer: Option<&ColorArray>) -> SolveResult {
        let mut node_arr: SolvingNodeArray = SolvingNodeArray::from(puzzle);
        if let Some(result) = node_arr.eliminate_and_fill(None) {
            return result;
        }
        FastSolver::new(node_arr, hint_answer).solve_impl()
    }

    // Assumes that the passed-in SolvingNodeArray has been
    // eliminate-and-fill-ed, so that this function will start from backtracing
    // directly.
    fn new(node_arr: SolvingNodeArray, hint_answer: Option<&ColorArray>) -> FastSolver<'_> {
        #[cfg(debug_assertions)]
        {
            let mut node_arr_copy = node_arr;
            let result = node_arr_copy.eliminate_and_fill(None);
            if result.is_some() {
                panic!();
            }
            if node_arr != node_arr_copy {
                panic!();
            }
        }

        FastSolver {
            node_arr,
            hint_answer,
        }
    }

    // Returns the index of an uncolored node for backtracing.
    // Returns the one with the least number of available colors.
    fn pick_up_uncolored_node(&self) -> Option<NodeIndexType> {
        let mut min_colors = COLOR_COUNT;
        let mut min_idx = None;
        for i in 0..NODE_COUNT {
            if self.node_arr[i].color != 0 {
                continue;
            }
            let cnt = self.node_arr[i].available_colors.count();
            if cnt < min_colors {
                min_colors = cnt;
                min_idx = Some(i);
            }
        }
        min_idx
    }

    fn solve_impl(&mut self) -> SolveResult {
        let idx = self.pick_up_uncolored_node().unwrap();
        let mut found_answer: Option<ColorArray> = None;
        let mut colors_buf = [0; COLOR_COUNT];
        let hint_color: Option<u8> = self.hint_answer.map(|x| x[idx]);
        let colors_cnt = self.node_arr[idx]
            .available_colors
            .get_all_no_allocate(hint_color, &mut colors_buf);
        for &c in &colors_buf[0..colors_cnt] {
            let mut node_arr_copy = self.node_arr;
            node_arr_copy[idx].color = c;
            // println!("filling {} to {}\n", c, idx);
            let result = node_arr_copy
                .eliminate_and_fill(Some(idx))
                .unwrap_or_else(|| {
                    FastSolver::new(
                        node_arr_copy,
                        if Some(c) == hint_color {
                            self.hint_answer
                        } else {
                            None
                        },
                    )
                    .solve_impl()
                });
            match result {
                SolveResult::Invalid => continue,
                SolveResult::Unique(answer) => {
                    if found_answer.is_some() {
                        return SolveResult::Multiple;
                    }
                    found_answer = Some(answer)
                }
                SolveResult::Multiple => return SolveResult::Multiple,
            }
        }

        match found_answer {
            Some(v) => SolveResult::Unique(v),
            None => SolveResult::Invalid,
        }
    }
}

#[derive(PartialEq, Debug)]
pub enum SolveResult {
    // The input is invalid. There is no valid result for this puzzle.
    Invalid,
    // Unique result can be found.
    Unique(ColorArray),
    // Multiple results can be found.
    Multiple,
}

// Checks if `answer` is the unique answer to puzzle.
// This function assumes that `answer` can satisfy `puzzle`.
pub fn check_puzzle_has_unique_answer(puzzle: &ColorArray, answer: &ColorArray) -> bool {
    match FastSolver::solve(puzzle, Some(answer)) {
        SolveResult::Invalid => panic!(),
        SolveResult::Unique(v) => {
            #[cfg(debug_assertions)]
            assert_eq!(*answer, v);
            true
        }
        SolveResult::Multiple => false,
    }
}

pub fn fast_solve(puzzle: &ColorArray) -> SolveResult {
    FastSolver::solve(puzzle, None)
}

mod tests {
    #[allow(unused_imports)]
    use super::*;

    #[test]
    fn solve_simple() {
        let puzzle = [
            0, 0, 3, 0, 2, 0, 6, 0, 0, //
            9, 0, 0, 3, 0, 5, 0, 0, 1, //
            0, 0, 1, 8, 0, 6, 4, 0, 0, //
            0, 0, 8, 1, 0, 2, 9, 0, 0, //
            7, 0, 0, 0, 0, 0, 0, 0, 8, //
            0, 0, 6, 7, 0, 8, 2, 0, 0, //
            0, 0, 2, 6, 0, 9, 5, 0, 0, //
            8, 0, 0, 2, 0, 3, 0, 0, 9, //
            0, 0, 5, 0, 1, 0, 3, 0, 0, //
        ];

        let answer = [
            4, 8, 3, 9, 2, 1, 6, 5, 7, //
            9, 6, 7, 3, 4, 5, 8, 2, 1, //
            2, 5, 1, 8, 7, 6, 4, 9, 3, //
            5, 4, 8, 1, 3, 2, 9, 7, 6, //
            7, 2, 9, 5, 6, 4, 1, 3, 8, //
            1, 3, 6, 7, 9, 8, 2, 4, 5, //
            3, 7, 2, 6, 8, 9, 5, 1, 4, //
            8, 1, 4, 2, 5, 3, 7, 6, 9, //
            6, 9, 5, 4, 1, 7, 3, 8, 2, //
        ];

        let result = fast_solve(&puzzle);
        assert_eq!(result, SolveResult::Unique(answer));
    }

    #[test]
    fn solve_hard() {
        let puzzle = [
            4, 0, 0, 0, 3, 0, 0, 0, 0, //
            0, 0, 0, 6, 0, 0, 8, 0, 0, //
            0, 0, 0, 0, 0, 0, 0, 0, 1, //
            0, 0, 0, 0, 5, 0, 0, 9, 0, //
            0, 8, 0, 0, 0, 0, 6, 0, 0, //
            0, 7, 0, 2, 0, 0, 0, 0, 0, //
            0, 0, 0, 1, 0, 2, 7, 0, 0, //
            5, 0, 3, 0, 0, 0, 0, 4, 0, //
            9, 0, 0, 0, 0, 0, 0, 0, 0, //
        ];
        let answer = [
            4, 6, 8, 9, 3, 1, 5, 2, 7, //
            7, 5, 1, 6, 2, 4, 8, 3, 9, //
            3, 9, 2, 5, 7, 8, 4, 6, 1, //
            1, 3, 4, 7, 5, 6, 2, 9, 8, //
            2, 8, 9, 4, 1, 3, 6, 7, 5, //
            6, 7, 5, 2, 8, 9, 3, 1, 4, //
            8, 4, 6, 1, 9, 2, 7, 5, 3, //
            5, 1, 3, 8, 6, 7, 9, 4, 2, //
            9, 2, 7, 3, 4, 5, 1, 8, 6, //
        ];

        let result = fast_solve(&puzzle);
        assert_eq!(result, SolveResult::Unique(answer));
    }
}
