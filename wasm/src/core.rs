const RANK: usize = 3;
pub const COLOR_COUNT: usize = RANK * RANK;
pub const NODE_COUNT: usize = COLOR_COUNT * COLOR_COUNT;

pub type ColorType = u8;
pub type NodeIndexType = usize;
pub type SudokuArrayType<T> = [T; NODE_COUNT];
pub type ColorArray = SudokuArrayType<ColorType>;

pub trait SudokuValue {
    fn from_color(number: ColorType) -> Self;
    fn to_color(&self) -> ColorType;
}

impl SudokuValue for u8 {
    #[inline]
    fn from_color(number: ColorType) -> Self {
        number
    }

    #[inline]
    fn to_color(&self) -> ColorType {
        *self
    }
}

pub trait SudokuArray<T: SudokuValue + Copy> {
    fn from_color_array(colors: &ColorArray) -> Self;
    fn to_color_array(&self) -> ColorArray;

    fn uncolored_node_count(&self) -> usize;

    // Checks that if putting color at idx will cause direct conflict (i.e., no
    // neighbor of this idx has the same color).
    fn validate_color_at_idx(&self, color: ColorType, idx: NodeIndexType) -> bool;

    // Checks that if the current array has conflict values. If strict is true,
    // also checks that all the cells are not empty.
    fn validate_colors(&self, strict: bool) -> bool;

    // Counts the number of empty cells.
    fn count_clues(&self) -> usize;
}

impl<T> SudokuArray<T> for [T; NODE_COUNT]
where
    T: SudokuValue + Copy,
{
    fn from_color_array(colors: &ColorArray) -> Self {
        colors.map(T::from_color)
    }

    fn to_color_array(&self) -> ColorArray {
        self.map(|x| x.to_color())
    }

    fn uncolored_node_count(&self) -> usize {
        self.iter().filter(|n| n.to_color() == 0).count()
    }

    fn validate_color_at_idx(&self, color: ColorType, idx: NodeIndexType) -> bool {
        for j in NEIGHBOR_ARRAY_MAP[idx] {
            if self[j].to_color() != 0 && color == self[j].to_color() {
                return false;
            }
        }
        true
    }

    fn validate_colors(&self, strict: bool) -> bool {
        for i in 0..NODE_COUNT {
            let c = self[i].to_color();
            if strict && c == 0 {
                return false;
            }
            if c != 0 && !self.validate_color_at_idx(c, i) {
                return false;
            }
        }
        true
    }

    fn count_clues(&self) -> usize {
        let mut cnt = 0;
        for i in 0..NODE_COUNT {
            if self[i].to_color() != 0 {
                cnt += 1;
            }
        }
        cnt
    }
}

pub fn print_sudoku_array<T>(data: &[T; NODE_COUNT], printer: fn(&T) -> String) -> String {
    let mut buffer = String::new();
    for (i, val) in data.iter().enumerate() {
        buffer += &printer(val);
        if i % COLOR_COUNT == COLOR_COUNT - 1 {
            buffer += "\n";
        }
    }
    buffer
}

// Helper functions for calculating index.
const fn row_idx(idx: usize) -> usize {
    idx / COLOR_COUNT
}
const fn col_idx(idx: usize) -> usize {
    idx % COLOR_COUNT
}
const fn sqr_idx(idx: usize) -> usize {
    row_idx(idx) / RANK * RANK + col_idx(idx) / RANK
}

// Number of neighbors per node (8 + 8 + 4).
const NEIGHBOR_COUNT: usize = 20;

// Neighbors indexes.
type NeighborArray = [NodeIndexType; NEIGHBOR_COUNT];
const fn new_neighbor_array() -> NeighborArray {
    [0; NEIGHBOR_COUNT]
}

type NeighborArrayMap = SudokuArrayType<NeighborArray>;

// Map from an index to the indexes of its numbers. This can be generated at the compile time.
pub static NEIGHBOR_ARRAY_MAP: NeighborArrayMap = build_neigh_arr_map();

const fn get_neighs_for_idx(idx: usize) -> NeighborArray {
    let mut bit_array = [false; NODE_COUNT];

    let row = row_idx(idx);
    let col = col_idx(idx);
    let sqr = sqr_idx(idx);

    let mut i = 0;
    while i < COLOR_COUNT {
        // Neighbors on the same row.
        bit_array[row * COLOR_COUNT + i] = true;
        // Neighbors on the same column.
        bit_array[i * COLOR_COUNT + col] = true;
        // Neighbors in the same square.
        bit_array[(sqr / RANK * RANK + i / RANK) * COLOR_COUNT + (sqr % RANK * RANK + i % RANK)] =
            true;

        i += 1;
    }

    bit_array[idx] = false;

    let mut ret = new_neighbor_array();
    i = 0;
    let mut j = 0;
    while i < NODE_COUNT {
        if bit_array[i] {
            ret[j] = i;
            j += 1;
        }
        i += 1;
    }

    // Note: we cannot use assert in a const function.
    if j != NEIGHBOR_COUNT {
        panic!("Unexpected neighbor count");
    }

    ret
}

const fn build_neigh_arr_map() -> NeighborArrayMap {
    let mut ret = [new_neighbor_array(); NODE_COUNT];
    let mut i = 0;
    while i < NODE_COUNT {
        ret[i] = get_neighs_for_idx(i);
        i += 1;
    }
    ret
}

pub(crate) const fn get_all_idx_for_row(row: usize) -> [NodeIndexType; COLOR_COUNT] {
    let mut ret = [0; COLOR_COUNT];
    let mut i = 0;
    while i < COLOR_COUNT {
        ret[i] = row * COLOR_COUNT + i;
        i += 1;
    }
    ret
}

pub(crate) const fn get_all_idx_for_col(col: usize) -> [NodeIndexType; COLOR_COUNT] {
    let mut ret = [0; COLOR_COUNT];
    let mut i = 0;
    while i < COLOR_COUNT {
        ret[i] = i * COLOR_COUNT + col;
        i += 1;
    }
    ret
}

pub(crate) const fn get_all_idx_for_sqr(sqr: usize) -> [NodeIndexType; COLOR_COUNT] {
    let mut ret = [0; COLOR_COUNT];
    let mut i = 0;
    while i < COLOR_COUNT {
        ret[i] = (sqr / RANK * RANK + i / RANK) * COLOR_COUNT + (sqr % RANK * RANK + i % RANK);
        i += 1;
    }
    ret
}
