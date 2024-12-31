use std::{
    collections::VecDeque,
    fmt::Debug,
    hint,
    ops::{Deref, DerefMut},
};

use crate::*;

#[derive(Clone, Copy)]
struct Colors {
    arr: [bool; COLOR_COUNT + 1],
    // cnt is a bottleneck, so cache the value instead.
    cnt: usize,
}

impl Colors {
    fn new(val: bool) -> Self {
        return Colors {
            arr: [val; COLOR_COUNT + 1],
            cnt: if val { COLOR_COUNT } else { 0 },
        };
    }

    fn set(&mut self, color: u8) {
        if !self.arr[color as usize] {
            self.cnt += 1
        }
        self.arr[color as usize] = true;
    }

    fn del(&mut self, color: u8) {
        if self.arr[color as usize] {
            self.cnt -= 1
        }
        self.arr[color as usize] = false;
    }

    fn has(&self, color: u8) -> bool {
        return self.arr[color as usize];
    }

    fn count(&self) -> usize {
        return self.cnt;
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
        return ret;
    }

    fn get_all(&self) -> Vec<u8> {
        let mut ret = vec![];
        for i in 1..COLOR_COUNT + 1 {
            if self.arr[i] {
                ret.push(i as u8);
            }
        }
        return ret;
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

#[derive(Clone, Copy)]
struct Node {
    color: u8,
    available_colors: Colors,
}

impl Node {
    fn new(color: u8) -> Self {
        Self {
            color: color,
            available_colors: Colors::new(true),
        }
    }
}

#[derive(Clone, Copy)]
struct NodeArray(SudokuArray<Node>);

impl Deref for NodeArray {
    type Target = SudokuArray<Node>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for NodeArray {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl From<&ColorArray> for NodeArray {
    fn from(value: &ColorArray) -> Self {
        NodeArray(SudokuArray::new(value.map(Node::new)))
    }
}

impl Into<ColorArray> for &NodeArray {
    fn into(self) -> ColorArray {
        let mut ret = SudokuArray::new([0; NODE_COUNT]);
        for (i, node) in self.iter().enumerate() {
            ret[i] = node.color;
        }
        return ret;
    }
}

enum FillResult {
    // Returns the number of nodes which were filled successfully.
    Success(usize),
    // After filling some numbers, there is one or more nodes which cannot be filled in any numbers. Returns the first conflit node idx.
    Fail(NodeIndexType),
}

impl NodeArray {
    fn uncolored_node_count(&self) -> usize {
        self.iter().filter(|n| n.color == 0).count()
    }

    // Returns the impossible node after the elimination.
    #[inline(never)]
    fn eliminate_with_idx(&mut self, idx: NodeIndexType) -> Option<NodeIndexType> {
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
            neigh.available_colors.del(color);
            if neigh.available_colors.count() == 0 {
                // It's impossible to fill in this cell.
                return Some(neigh_idx);
            }
            // print!("Remove color {} from {} due to {}, remaining {:?}\n", color, neigh_idx, idx, neigh.available_colors);
        }
        return None;
    }

    #[inline(never)]
    fn eliminate(&mut self, idx: Option<NodeIndexType>) -> Option<NodeIndexType> {
        if let Some(val) = idx {
            return self.eliminate_with_idx(val)
        }

        for i in 0..self.len() {
            if let Some(v) = self.eliminate_with_idx(i) {
                return Some(v);
            }
        }
        return None;
    }

    #[inline(never)]
    fn fill_all(&mut self) -> FillResult {
        let mut cnt = 0;
        for i in 0..self.len() {
            if self[i].color != 0 {
                continue;
            }
            if self[i].available_colors.count() != 1 {
                continue;
            }
            self[i].color = self[i]
                .available_colors
                .get_unique()
                .expect("Invalid state");
            if let Some(impossible_node_idx) = self.eliminate_with_idx(i) {
                return FillResult::Fail(impossible_node_idx);
            }
            cnt += 1;
        }
        return FillResult::Success(cnt);
    }

    fn eliminate_and_fill(&mut self, idx: Option<NodeIndexType>) -> Option<SolveResult> {
        if let Some(_) = self.eliminate(idx) {
            return Some(SolveResult::Invalid);
        }

        loop {
            match self.fill_all() {
                FillResult::Success(0) => break,
                FillResult::Success(_) => continue,
                FillResult::Fail(_) => return Some(SolveResult::Invalid),
            }
        }
        if self.uncolored_node_count() == 0 {
            return Some(SolveResult::Unique(self.create_color_array()));
        }
        return None
    }

    fn create_color_array(&self) -> ColorArray {
        let mut ret = SudokuArray::new([0; NODE_COUNT]);
        for (i, node) in self.iter().enumerate() {
            ret[i] = node.color;
        }
        return ret;
    }

    #[inline(never)]
    fn find_invalid_cell(&self) -> Option<NodeIndexType> {
        for i in 0..NODE_COUNT {
            for j in NEIGHBOR_ARRAY_MAP[i] {
                if self[i].color == 0 || self[j].color == 0 {
                    continue;
                }
                if self[i].color == self[j].color {
                    return Some(i);
                }
            }
        }
        None
    }

    // Returns the index of an uncolored node for backtracing.
    #[inline(never)]
    fn pick_up_uncolored_node(&self) -> Option<NodeIndexType> {
        let mut pairs = (0..NODE_COUNT)
            .filter(|i| self[*i].color == 0)
            .map(|i| (i, self[i].available_colors.count()))
            .collect::<Vec<_>>();
        if pairs.len() == 0 {
            return None;
        }
        pairs.sort_by_key(|x| x.1);
        return Some(pairs[0].0);
    }
}

#[derive(PartialEq, Debug)]
pub enum SolveResult {
    // The input is invalid. There is no valid result for this puzzle.
    Invalid,
    // Unique result can be found.
    Unique(ColorArray),
    // Multiple results can be found. Note that the list wrapped in this value may not be the complete list for all valid results.
    Multiple(Vec<ColorArray>),
    // Failed to valid result in the given timeout (there can be valid result or not).
    Timeout,
}

pub fn fast_solve(puzzle: &ColorArray) -> SolveResult {
    return fast_solve_with_hint(puzzle, None);
}

pub fn fast_solve_with_hint(puzzle: &ColorArray, hint_answer: Option<&ColorArray>) -> SolveResult {
    let mut node_arr: NodeArray = NodeArray::from(puzzle);
    if let Some(result) = node_arr.eliminate_and_fill(None) {
        return result;
    }
    return solve_with_backtracing(node_arr, hint_answer);
}

fn solve_with_backtracing(node_arr: NodeArray, hint_answer: Option<&ColorArray>) -> SolveResult {
    // println!("{}\n", node_arr.uncolored_node_count());
    let idx = node_arr.pick_up_uncolored_node().expect("Invalid state");
    let mut answers = vec![];
    let colors = node_arr[idx].available_colors.get_all();
    for c in colors {
        let mut node_arr_copy = node_arr;
        node_arr_copy[idx].color = c;
        // println!("filling {} to {}\n", c, idx);
        let result = node_arr_copy
            .eliminate_and_fill(Some(idx))
            .unwrap_or_else(|| solve_with_backtracing(node_arr_copy, hint_answer));
        match result {
            SolveResult::Invalid => {

                continue},
            SolveResult::Unique(answer) => {
                answers.push(answer);
            }
            SolveResult::Multiple(new_answers) => {
                answers.extend(new_answers);
            }
            SolveResult::Timeout => return SolveResult::Timeout,
        }

        // Now that we already have multiple answers, just return them. By definition, this function does not have to return all the valid answers.
        if answers.len() > 1 {
            return SolveResult::Multiple(answers);
        }
    }

    return match answers.len() {
        0 => SolveResult::Invalid,
        1 => SolveResult::Unique(SudokuArray::new(*answers[0])),
        // Already handled above in the loop.
        _ => panic!("Unexpected multiple answer found"),
    };
}

mod tests {
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

        let result = fast_solve(&ColorArray::new(puzzle));
        assert_eq!(result, SolveResult::Unique(ColorArray::new(answer)));
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

        let result = fast_solve(&ColorArray::new(puzzle));
        assert_eq!(result, SolveResult::Unique(ColorArray::new(answer)));
    }
}
