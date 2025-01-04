use crate::*;
use itertools::Itertools;
use solve_utils::*;

// About score -- we normalize the score in the following way:
// - All the solvers can be considered as eliminating some states from the
//   board, by dropping a draft number.
// - The upper bound of the draft numbers are 9*9*9=729.
// - We give each solver a weight (0..=100), which represents the cognitive
//   overhead of the solver.
// - So the score of the puzzle = sum(weight * #eliminated_state).

type NodeArray = SolvingNodeArray<ColorBits>;

fn eliminate_color_at_neighs_to_idx(
    node_arr: &mut NodeArray,
    color: ColorType,
    idx: NodeIndexType,
) -> i32 {
    let mut cnt = 0;
    for &j in NEIGHBOR_ARRAY_MAP[idx].iter() {
        if node_arr[j].available_colors.del(color) {
            cnt += 1;
        }
    }
    cnt
}

trait PartialScorer {
    // Returns the number of state eliminated.
    fn work(&self, node_arr: &mut NodeArray) -> i32;
}

struct DraftEliminator {}

impl PartialScorer for DraftEliminator {
    fn work(&self, node_arr: &mut NodeArray) -> i32 {
        let mut cnt = 0;
        for i in 0..NODE_COUNT {
            if node_arr[i].color == 0 {
                continue;
            }
            cnt += eliminate_color_at_neighs_to_idx(node_arr, node_arr[i].color, i);
        }
        cnt
    }
}

struct UniqueDraftFiller {}

impl PartialScorer for UniqueDraftFiller {
    fn work(&self, node_arr: &mut NodeArray) -> i32 {
        let mut cnt = 0;
        for i in 0..NODE_COUNT {
            if node_arr[i].color != 0 {
                continue;
            }
            debug_assert_ne!(node_arr[i].available_colors.count(), 0);
            if let Some(v) = node_arr[i].available_colors.get_unique() {
                node_arr[i].color = v;
                cnt += 1;
            }
        }
        cnt
    }
}

fn eliminate_grouped_colors_from_other_cells(
    node_arr: &mut NodeArray,
    node_idx: &[NodeIndexType; COLOR_COUNT],
    group_size: usize,
) -> i32 {
    let candidates: Vec<usize> = node_idx
        .into_iter()
        .filter(|&&x| node_arr[x].color == 0)
        .map(|&x| x)
        .collect();

    if candidates.len() <= group_size {
        return 0;
    }

    let mut dropped_draft_number_cnt = 0;

    for group in candidates.iter().combinations(group_size) {
        let mut super_set = ColorBits::new(false);
        for &&idx in group.iter() {
            super_set |= node_arr[idx].available_colors;
        }
        if super_set.count() != group_size {
            continue;
        }
        for &idx in candidates.iter() {
            if group.iter().find(|&&&x| x == idx).is_some() {
                continue;
            }
            for c in super_set.get_all() {
                if node_arr[idx].available_colors.del(c) {
                    dropped_draft_number_cnt += 1;
                }
            }
        }
    }

    return dropped_draft_number_cnt;
}

fn eliminate_grouped_colors_from_grouped_cells(
    node_arr: &mut NodeArray,
    node_idx: &[NodeIndexType; COLOR_COUNT],
    group_size: usize,
) -> i32 {
    let candidates: Vec<usize> = node_idx
        .into_iter()
        .filter(|&&x| node_arr[x].color == 0)
        .map(|&x| x)
        .collect();

    if candidates.len() <= group_size {
        return 0;
    }

    let mut color_to_node_idx_idx = [0_u16; COLOR_COUNT + 1];
    for i in 0..candidates.len() {
        let idx = candidates[i];
        for c in node_arr[idx].available_colors.get_all() {
            color_to_node_idx_idx[c as usize] |= 1 << i;
        }
    }

    let mut color_set = ColorBits::new(false);
    for idx in candidates.iter() {
        color_set |= node_arr[*idx].available_colors;
    }

    let mut dropped_draft_number_cnt: i32 = 0;
    for group in color_set.get_all().into_iter().combinations(group_size) {
        let mut super_set = 0_u16;
        for &c in group.iter() {
            super_set |= color_to_node_idx_idx[c as usize];
        }
        if super_set.count_ones() != group_size as u32 {
            continue;
        }
        for i in 0..COLOR_COUNT {
            if (1 << i) & super_set == 0 {
                continue;
            }
            let node = &mut node_arr[candidates[i]];
            for c in 1..COLOR_COUNT + 1 {
                if group.contains(&(c as u8)) {
                    continue;
                }
                if node.available_colors.del(c as u8) {
                    dropped_draft_number_cnt += 1;
                }
            }
        }
    }

    return dropped_draft_number_cnt;
}

struct NonHiddenGroupEliminator {
    group_size: usize,
}

impl PartialScorer for NonHiddenGroupEliminator {
    fn work(&self, node_arr: &mut NodeArray) -> i32 {
        let mut ret = 0;
        for i in 0..9 {
            ret += eliminate_grouped_colors_from_other_cells(
                node_arr,
                &get_all_idx_for_row(i),
                self.group_size,
            );
            ret += eliminate_grouped_colors_from_other_cells(
                node_arr,
                &get_all_idx_for_col(i),
                self.group_size,
            );
            ret += eliminate_grouped_colors_from_other_cells(
                node_arr,
                &get_all_idx_for_sqr(i),
                self.group_size,
            );
        }

        ret
    }
}

struct HiddenGroupEliminator {
    group_size: usize,
}

impl PartialScorer for HiddenGroupEliminator {
    fn work(&self, node_arr: &mut NodeArray) -> i32 {
        let mut ret = 0;
        for i in 0..9 {
            ret += eliminate_grouped_colors_from_grouped_cells(
                node_arr,
                &get_all_idx_for_row(i),
                self.group_size,
            );
            ret += eliminate_grouped_colors_from_grouped_cells(
                node_arr,
                &get_all_idx_for_col(i),
                self.group_size,
            );
            ret += eliminate_grouped_colors_from_grouped_cells(
                node_arr,
                &get_all_idx_for_sqr(i),
                self.group_size,
            );
        }

        ret
    }
}

struct NonBacktracingScorer {}

impl PartialScorer for NonBacktracingScorer {
    fn work(&self, node_arr: &mut NodeArray) -> i32 {
        let mut score = 0;

        let basic_eliminator = DraftEliminator {};
        let basic_filler = UniqueDraftFiller {};
        let non_hidden_group_eliminator_2 = NonHiddenGroupEliminator { group_size: 2 };
        let non_hidden_group_eliminator_3 = NonHiddenGroupEliminator { group_size: 3 };
        let hidden_group_eliminator_1 = HiddenGroupEliminator { group_size: 1 };
        let hidden_group_eliminator_2 = HiddenGroupEliminator { group_size: 2 };
        let hidden_group_eliminator_3 = HiddenGroupEliminator { group_size: 3 };

        let eliminate_and_fill = |node_arr: &mut NodeArray, score: &mut i32| -> bool {
            let start_score = *score;
            loop {
                let last_score = *score;
                *score += 1 * basic_eliminator.work(node_arr);
                *score += 1 * basic_filler.work(node_arr);
                if last_score == *score {
                    break;
                }
            }
            start_score != *score
        };

        loop {
            if !eliminate_and_fill(node_arr, &mut score) {
                break;
            }
            score += 2 * hidden_group_eliminator_1.work(node_arr);
            score += 4 * non_hidden_group_eliminator_2.work(node_arr);
            score += 8 * hidden_group_eliminator_2.work(node_arr);
            score += 9 * non_hidden_group_eliminator_3.work(node_arr);
            score += 18 * hidden_group_eliminator_3.work(node_arr);
        }

        return score;
    }
}

fn count_remaining_state(node_arr: &NodeArray) -> i32 {
    let mut cnt = 0;
    for &c in node_arr {
        if c.color != 0 {
            continue;
        }
        cnt += c.available_colors.count() as i32;
    }
    cnt
}

// Max score: 10000.
pub fn simple_score(puzzle: &ColorArray) -> i32 {
    let mut node_arr = NodeArray::from_color_array(puzzle);
    let scorer = NonBacktracingScorer {};
    let score = scorer.work(&mut node_arr);
    let total_score = if !node_arr.validate_colors(true) {
        // If need backtracing.
        score + 100 * count_remaining_state(&node_arr)
    } else {
        score
    };
    total_score * 100 / (9 * 9 * 9)
}

mod tests {
    #[allow(unused_imports)]
    use super::*;

    #[test]
    fn hidden_group_eliminator_group_1() {
        let board = [0u8; NODE_COUNT];
        let mut node_arr = NodeArray::from_color_array(&board);
        for i in 1..9 {
            node_arr[i].available_colors.del(1);
        }

        let solver = HiddenGroupEliminator { group_size: 1 };
        assert!(solver.work(&mut node_arr) > 0);
        assert_eq!(node_arr[0].available_colors.get_unique(), Some(1));
    }

    #[test]
    fn hidden_group_eliminator_group_2() {
        let board = [0u8; NODE_COUNT];
        let mut node_arr = NodeArray::from_color_array(&board);
        for i in 1..8 {
            node_arr[i].available_colors.del(1);
            node_arr[i].available_colors.del(2);
        }

        let solver = HiddenGroupEliminator { group_size: 2 };
        assert!(solver.work(&mut node_arr) > 0);
        assert_eq!(node_arr[0].available_colors.get_all(), vec![1, 2]);
        assert_eq!(node_arr[8].available_colors.get_all(), vec![1, 2]);
        assert_eq!(node_arr[1].available_colors.count(), 7);
        assert_eq!(node_arr[2].available_colors.count(), 7);
    }

    #[test]
    fn non_hidden_group_eliminator_group_2() {
        let board = [0u8; NODE_COUNT];
        let mut node_arr = NodeArray::from_color_array(&board);
        for color in 1..8 {
            node_arr[1].available_colors.del(color);
            node_arr[4].available_colors.del(color);
        }

        let solver = NonHiddenGroupEliminator { group_size: 2 };
        assert!(solver.work(&mut node_arr) > 0);
        assert_eq!(
            node_arr[0].available_colors.get_all(),
            vec![1, 2, 3, 4, 5, 6, 7]
        );
        assert_eq!(node_arr[1].available_colors.get_all(), vec![8, 9]);
        assert_eq!(
            node_arr[2].available_colors.get_all(),
            vec![1, 2, 3, 4, 5, 6, 7]
        );
    }
}
