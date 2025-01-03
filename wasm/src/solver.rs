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

mod neighbor_based {

    use super::*;

    #[derive(Clone, Copy, PartialEq)]
    struct Node {
        color: u8,
        available_colors: Colors,
    }

    impl SudokuValue for Node {
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
    struct NodeArray(SudokuArrayType<Node>);

    impl Deref for NodeArray {
        type Target = SudokuArrayType<Node>;

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
            NodeArray(value.map(Node::from_color))
        }
    }

    impl From<&NodeArray> for ColorArray {
        fn from(val: &NodeArray) -> Self {
            val.0.map(|n| n.color)
        }
    }

    enum FillResult {
        // Returns the number of nodes which were filled successfully.
        Success(usize),
        // After filling some numbers, there is one or more nodes which cannot be filled in any numbers. Returns the first conflit node idx.
        Fail(),
    }

    #[derive(Clone, Copy)]
    struct NodeStack {
        items: [u8; 81],
        cnt: u8,
    }

    impl NodeStack {
        fn new() -> Self {
            NodeStack {
                items: [0; 81],
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
    }

    impl NodeArray {
        // Returns the impossible node after the elimination.
        #[inline(never)]
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
                // if !neigh.available_colors.has(color) {
                //     continue;
                // }
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
                // print!("Remove color {} from {} due to {}, remaining {:?}\n", color, neigh_idx, idx, neigh.available_colors);
            }
            None
        }

        #[inline(never)]
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

        #[inline(never)]
        fn fill_all(&mut self, fill_candidates: &mut NodeStack) -> FillResult {
            let mut cnt = 0;
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
                    return FillResult::Fail();
                }
                cnt += 1;
            }

            *fill_candidates = new_fill_candidates;
            FillResult::Success(cnt)
        }

        fn eliminate_and_fill(&mut self, idx: Option<NodeIndexType>) -> Option<SolveResult> {
            let mut fill_candidates = NodeStack::new();

            if self.eliminate(idx, &mut fill_candidates).is_some() {
                return Some(SolveResult::Invalid);
            }

            loop {
                match self.fill_all(&mut fill_candidates) {
                    FillResult::Success(0) => break,
                    FillResult::Success(_) => continue,
                    FillResult::Fail() => return Some(SolveResult::Invalid),
                }
            }
            if self.uncolored_node_count() == 0 {
                return Some(SolveResult::Unique(self.0.to_color_array()));
            }
            None
        }

        // Check if the current board is valid. This is useful in debugging.
        #[allow(dead_code)]
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
        // Returns the one with the least number of available colors.
        fn pick_up_uncolored_node_fast(&self) -> Option<NodeIndexType> {
            let mut min_colors = COLOR_COUNT;
            let mut min_idx = None;
            for i in 0..NODE_COUNT {
                if self[i].color != 0 {
                    continue;
                }
                let cnt = self[i].available_colors.count();
                if cnt < min_colors {
                    min_colors = cnt;
                    min_idx = Some(i);
                }
            }
            min_idx
        }
    }

    struct Solver<'a> {
        node_arr: NodeArray,
        hint_answer: Option<&'a ColorArray>,
    }

    impl Solver<'_> {
        // Returns None if the input is invalid (not solvable).
        fn new(node_arr: NodeArray, hint_answer: Option<&ColorArray>) -> Solver<'_> {
            #[cfg(debug_assertions)]
            {
                let mut node_arr_copy = node_arr;
                let result = node_arr_copy.eliminate(None, &mut NodeStack::new());
                if result.is_some() {
                    panic!();
                }
                if node_arr != node_arr_copy {
                    panic!();
                }
            }

            Solver {
                node_arr,
                hint_answer,
            }
        }

        fn solve(&mut self) -> SolveResult {
            let idx = self.node_arr.pick_up_uncolored_node_fast().unwrap();
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
                        Solver::new(
                            node_arr_copy,
                            if Some(c) == hint_color {
                                self.hint_answer
                            } else {
                                None
                            },
                        )
                        .solve()
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

    pub fn solve(puzzle: &ColorArray, hint_answer: Option<&ColorArray>) -> SolveResult {
        let mut node_arr: NodeArray = NodeArray::from(puzzle);
        if let Some(result) = node_arr.eliminate_and_fill(None) {
            return result;
        }
        Solver::new(node_arr, hint_answer).solve()
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

pub fn fast_solve(puzzle: &ColorArray, hint_answer: Option<&ColorArray>) -> SolveResult {
    neighbor_based::solve(puzzle, hint_answer)
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

        let result = fast_solve(&puzzle, None);
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

        let result = fast_solve(&puzzle, None);
        assert_eq!(result, SolveResult::Unique(answer));
    }
}
