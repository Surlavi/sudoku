use crate::*;
use itertools::Itertools;
use solve_utils::*;

type NodeArray = SolvingNodeArray<ColorBits>;

fn eliminate_color_at_neighs_to_idx(
    node_arr: &mut NodeArray,
    color: ColorType,
    idx: NodeIndexType,
) -> bool {
    let mut success = false;
    for &j in NEIGHBOR_ARRAY_MAP[idx].iter() {
        success |= node_arr[j].available_colors.del(color);
    }
    success
}

trait PartialScorer {
    // Returns 0 if the scorer cannot simplify node_arr.
    fn work(&self, node_arr: &mut NodeArray) -> i32;
}

struct DraftEliminator {}

impl PartialScorer for DraftEliminator {
    fn work(&self, node_arr: &mut NodeArray) -> i32 {
        let mut success = false;
        for i in 0..NODE_COUNT {
            if node_arr[i].color == 0 {
                continue;
            }
            success |= eliminate_color_at_neighs_to_idx(node_arr, node_arr[i].color, i);
        }
        if success {
            1
        } else {
            0
        }
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

    let mut found_group_cnt = 0;

    for group in candidates.iter().combinations(group_size) {
        let mut super_set = ColorBits::new(false);
        for &&idx in group.iter() {
            super_set |= node_arr[idx].available_colors;
        }
        if super_set.count() != group_size {
            continue;
        }
        let mut removed_draft_num = 0;
        for &idx in candidates.iter() {
            if group.iter().find(|&&&x| x == idx).is_some() {
                continue;
            }
            for c in super_set.get_all() {
                if node_arr[idx].available_colors.del(c) {
                    removed_draft_num += 1;
                }
            }
        }
        if removed_draft_num > 0 {
            found_group_cnt += 1;
        }
    }

    return found_group_cnt;
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

    let mut found_group_cnt: i32 = 0;

    for group in (1..(COLOR_COUNT + 1)).combinations(group_size) {
        let mut super_set = 0_u16;
        for &c in group.iter() {
            super_set |= color_to_node_idx_idx[c];
        }
        if super_set.count_ones() != group_size as u32 {
            continue;
        }
        let mut removed_draft_num = 0;
        for i in 0..COLOR_COUNT {
            if (1 << i) & super_set == 0 {
                continue;
            }
            let node = &mut node_arr[candidates[i]];
            for c in 1..COLOR_COUNT + 1 {
                if group.contains(&c) {
                    continue;
                }
                if node.available_colors.del(c as u8) {
                    // println!("rm {:?} {:?}", candidates[i], node.available_colors);
                    removed_draft_num += 1;
                }
            }
        }
        if removed_draft_num > 0 {
            found_group_cnt += 1;
        }
    }

    return found_group_cnt;
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

        return ret * 10 * self.group_size as i32;
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

        return ret * 20 * self.group_size as i32;
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

        let mut eliminate_and_fill = |node_arr: &mut NodeArray, score: &mut i32| -> bool {
            let start_score = *score;
            loop {
                let last_score = *score;
                *score += basic_eliminator.work(node_arr);
                *score += basic_filler.work(node_arr);
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
            score += non_hidden_group_eliminator_2.work(node_arr);
            score += non_hidden_group_eliminator_3.work(node_arr);
            score += hidden_group_eliminator_1.work(node_arr);
            score += hidden_group_eliminator_2.work(node_arr);
            score += hidden_group_eliminator_3.work(node_arr);
        }

        return score;
    }
}

pub fn simple_score(puzzle: &ColorArray) -> i32 {
    let mut node_arr = NodeArray::from_color_array(puzzle);
    let scorer = NonBacktracingScorer {};
    let score = scorer.work(&mut node_arr);
    if !node_arr.validate_colors(true) {
        // If need backtracing.
        return score + 500 * node_arr.uncolored_node_count() as i32;
    } else {
        return score;
    }
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
        // println!("{:?}", node_arr[0].available_colors);
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
        // println!("{:?}", node_arr[0].available_colors);
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
        // println!("{:?}", node_arr[0].available_colors);
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
