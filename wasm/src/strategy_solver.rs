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

pub type NodeArray = SolvingNodeArray<ColorBits>;

// Note that a StrategySolver is usually a partial solver -- it will not solve
// the puzzle directly, but will eliminate the possible states in that.
pub trait StrategySolver {
    // Returns the number of state eliminated.
    fn work(&self, node_arr: &mut NodeArray) -> i32;
}

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

fn idx_arr_intersection(
    a: &[NodeIndexType; COLOR_COUNT],
    b: &[NodeIndexType; COLOR_COUNT],
) -> [NodeIndexType; 3] {
    let mut cnt = 0;
    let mut ret = [0; 3];
    for &i in a {
        if b.contains(&i) {
            ret[cnt] = i;
            cnt += 1;
        }
    }
    debug_assert_eq!(cnt, 3);
    ret
}

fn idx_arr_minus(
    a: &[NodeIndexType; COLOR_COUNT],
    b: &[NodeIndexType; COLOR_COUNT],
) -> [NodeIndexType; 6] {
    let mut cnt = 0;
    let mut ret = [0; 6];
    for &i in a {
        if !b.contains(&i) {
            ret[cnt] = i;
            cnt += 1;
        }
    }
    debug_assert_eq!(cnt, 6);
    ret
}

pub struct BasicEliminator {}

impl StrategySolver for BasicEliminator {
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

pub struct UniqueDraftValueFiller {}

impl StrategySolver for UniqueDraftValueFiller {
    fn work(&self, node_arr: &mut NodeArray) -> i32 {
        let mut cnt = 0;
        for i in 0..NODE_COUNT {
            if node_arr[i].color != 0 {
                continue;
            }
            debug_assert_ne!(node_arr[i].available_colors.count(), 0);
            if let Some(v) = node_arr[i].available_colors.get_unique() {
                node_arr[i].color = v;
                node_arr[i].available_colors.clear();
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

pub struct NonHiddenGroupEliminator {
    pub group_size: usize,
}

impl StrategySolver for NonHiddenGroupEliminator {
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

pub struct HiddenGroupEliminator {
    pub group_size: usize,
}

impl StrategySolver for HiddenGroupEliminator {
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

pub struct IntersectionEliminator {}

fn eliminate_by_intersection(
    node_arr: &mut NodeArray,
    idx_a: &[NodeIndexType; COLOR_COUNT],
    idx_b: &[NodeIndexType; COLOR_COUNT],
) -> i32 {
    let get_color_super_set = |idx_arr: &[NodeIndexType]| {
        let mut ret = ColorBits::new(false);
        for &idx in idx_arr {
            let node = node_arr[idx];
            if node.color != 0 {
                continue;
            }
            ret |= node.available_colors;
        }
        ret
    };

    let intersect_idx_arr = idx_arr_intersection(idx_a, idx_b);
    let diff_a_idx_arr = idx_arr_minus(idx_a, idx_b);
    let diff_b_idx_arr = idx_arr_minus(idx_b, idx_a);

    let inter_color_set = get_color_super_set(&intersect_idx_arr);
    let diff_a_color_set = get_color_super_set(&diff_a_idx_arr);
    let diff_b_color_set = get_color_super_set(&diff_b_idx_arr);

    let mut cnt = 0;

    let mut inter_color_set_not_in_b = inter_color_set;
    inter_color_set_not_in_b.minus(&diff_b_color_set);
    for c in inter_color_set_not_in_b.get_all() {
        for idx in diff_a_idx_arr {
            let node = &mut node_arr[idx];
            if node.color != 0 {
                continue;
            }
            if node.available_colors.del(c) {
                cnt += 1;
            }
        }
    }

    let mut inter_color_set_not_in_a = inter_color_set;
    inter_color_set_not_in_a.minus(&diff_a_color_set);
    for c in inter_color_set_not_in_a.get_all() {
        for idx in diff_b_idx_arr {
            let node = &mut node_arr[idx];
            if node.color != 0 {
                continue;
            }
            if node.available_colors.del(c) {
                cnt += 1;
            }
        }
    }

    cnt
}

impl StrategySolver for IntersectionEliminator {
    fn work(&self, node_arr: &mut NodeArray) -> i32 {
        let mut cnt = 0;
        for i in 0..COLOR_COUNT {
            let sqr = get_all_idx_for_sqr(i);
            for j in 0..COLOR_COUNT {
                let row = get_all_idx_for_row(j);
                let col = get_all_idx_for_col(j);
                if i % 3 == j / 3 {
                    cnt += eliminate_by_intersection(node_arr, &sqr, &col);
                }
                if i / 3 == j / 3 {
                    cnt += eliminate_by_intersection(node_arr, &sqr, &row);
                }
            }
        }
        cnt
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

    #[test]
    fn intersection_eliminator() {
        let board = [0u8; NODE_COUNT];
        let mut node_arr = NodeArray::from_color_array(&board);
        for i in 3..COLOR_COUNT {
            node_arr[i].available_colors.del(1);
        }

        let solver = IntersectionEliminator {};
        assert!(solver.work(&mut node_arr) > 0);
        for &i in get_all_idx_for_sqr(0)[3..].into_iter() {
            assert_eq!(
                node_arr[i].available_colors.get_all(),
                vec![2, 3, 4, 5, 6, 7, 8, 9]
            );
        }
    }
}
