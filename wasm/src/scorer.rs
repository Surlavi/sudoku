use crate::*;

use solve_utils::*;
use strategy_solver::*;

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

fn non_backtracing_scorer(node_arr: &mut NodeArray) -> i32 {
    let mut score = 0;

    let basic_eliminator = BasicEliminator {};
    let basic_filler = UniqueDraftValueFiller {};
    let non_hidden_group_eliminator_2 = NonHiddenGroupEliminator { group_size: 2 };
    let non_hidden_group_eliminator_3 = NonHiddenGroupEliminator { group_size: 3 };
    let hidden_group_eliminator_1 = HiddenGroupEliminator { group_size: 1 };
    let hidden_group_eliminator_2 = HiddenGroupEliminator { group_size: 2 };
    let hidden_group_eliminator_3 = HiddenGroupEliminator { group_size: 3 };
    let intersection_eliminator = IntersectionEliminator {};

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
        score += 3 * intersection_eliminator.work(node_arr);
        score += 4 * non_hidden_group_eliminator_2.work(node_arr);
        score += 8 * hidden_group_eliminator_2.work(node_arr);
        score += 9 * non_hidden_group_eliminator_3.work(node_arr);
        score += 18 * hidden_group_eliminator_3.work(node_arr);
    }

    return score;
}

// Max score: 10000.
pub fn simple_score(puzzle: &ColorArray) -> i32 {
    let mut node_arr = NodeArray::from_color_array(puzzle);
    let score = non_backtracing_scorer(&mut node_arr);
    let total_score = if !node_arr.validate_colors(true) {
        // If need backtracing.
        score + 100 * count_remaining_state(&node_arr)
    } else {
        score
    };
    total_score * 100 / (9 * 9 * 9)
}
