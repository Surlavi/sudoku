use crate::*;
use solve_utils::*;

struct FastSolver<'a> {
    node_arr: SolvingNodeArray<ColorBits>,
    hint_answer: Option<&'a ColorArray>,
}

impl FastSolver<'_> {
    fn solve(puzzle: &ColorArray, hint_answer: Option<&ColorArray>) -> SolveResult {
        FastSolver::new(SolvingNodeArray::from_color_array(puzzle), hint_answer)
            .eliminate_and_backtracing()
    }

    fn new(
        node_arr: SolvingNodeArray<ColorBits>,
        hint_answer: Option<&ColorArray>,
    ) -> FastSolver<'_> {
        FastSolver {
            node_arr,
            hint_answer,
        }
    }

    fn eliminate_and_backtracing(&mut self) -> SolveResult {
        if let Some(result) = self.eliminate_and_fill(None) {
            return result;
        }
        self.backtracing()
    }

    // Returns the impossible node after the elimination.
    fn eliminate_with_idx(
        &mut self,
        idx: NodeIndexType,
        fill_candidates: &mut NodeIdxStack,
    ) -> Option<NodeIndexType> {
        let node = &self.node_arr[idx];
        if node.color == 0 {
            return None;
        }
        let color = node.color;
        for neigh_idx in NEIGHBOR_ARRAY_MAP[idx] {
            let neigh = &mut self.node_arr[neigh_idx];
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
        fill_candidates: &mut NodeIdxStack,
    ) -> Option<NodeIndexType> {
        if let Some(val) = idx {
            return self.eliminate_with_idx(val, fill_candidates);
        }

        for i in 0..self.node_arr.len() {
            if let Some(v) = self.eliminate_with_idx(i, fill_candidates) {
                return Some(v);
            }
        }
        None
    }

    // Consumes `fill_candidates`, returns the next round of fill candidates, or
    // None if we found that the puzzle is not solvable.
    fn fill_all(&mut self, fill_candidates: &mut NodeIdxStack) -> Option<NodeIdxStack> {
        let mut new_fill_candidates = NodeIdxStack::new();
        while let Some(idx) = fill_candidates.pop() {
            let i = idx as usize;
            if self.node_arr[i].color != 0 {
                continue;
            }
            if self.node_arr[i].available_colors.count() != 1 {
                continue;
            }
            self.node_arr[i].color = self.node_arr[i].available_colors.get_unique().unwrap();
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
        let mut fill_candidates = NodeIdxStack::new();

        if self.eliminate(idx, &mut fill_candidates).is_some() {
            return Some(SolveResult::Invalid);
        }

        while !fill_candidates.empty() {
            match self.fill_all(&mut fill_candidates) {
                Some(v) => fill_candidates = v,
                None => return Some(SolveResult::Invalid),
            }
        }
        if self.node_arr.uncolored_node_count() == 0 {
            return Some(SolveResult::Unique(self.node_arr.to_color_array()));
        }
        None
    }

    // Returns the index of an uncolored node for backtracing.
    // Returns the one with the least number of available colors.
    fn pick_up_uncolored_node(&self) -> Option<NodeIndexType> {
        let mut min_colors = COLOR_COUNT + 1;
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

    fn backtracing(&mut self) -> SolveResult {
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
            let mut child_solver = FastSolver::new(
                node_arr_copy,
                if Some(c) == hint_color {
                    self.hint_answer
                } else {
                    None
                },
            );
            let result = child_solver
                .eliminate_and_fill(Some(idx))
                .unwrap_or_else(|| child_solver.backtracing());
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

// Checks if `answer` is the unique answer to puzzle.
// This function assumes that `answer` can satisfy `puzzle`.
pub fn check_puzzle_has_unique_answer(puzzle: &ColorArray, answer: &ColorArray) -> bool {
    match FastSolver::solve(puzzle, Some(answer)) {
        SolveResult::Invalid => panic!(),
        SolveResult::Unique(v) => {
            debug_assert_eq!(*answer, v);
            true
        }
        SolveResult::Multiple => false,
    }
}

pub fn solve(puzzle: &ColorArray) -> SolveResult {
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

        let result = solve(&puzzle);
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

        let result = solve(&puzzle);
        assert_eq!(result, SolveResult::Unique(answer));
    }

    #[test]
    fn solve_result_multiple() {
        let puzzle = [0; NODE_COUNT];
        let result = solve(&puzzle);
        assert_eq!(result, SolveResult::Multiple);
    }
}
