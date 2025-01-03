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

    fn contains(&self, b: &Self) -> bool;
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

    fn contains(&self, b: &Self) -> bool {
        for i in 0..NODE_COUNT {
            if self[i].to_color() != b[i].to_color() && b[i].to_color() != 0 {
                return false;
            }
        }
        true
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
    while i < 9 {
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        // let result = add(2, 2);
        // assert_eq!(result, 4);
        build_neigh_arr_map();
    }
}
