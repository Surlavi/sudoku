use std::array::TryFromSliceError;

use std::ops::{Deref, DerefMut};

const RANK: usize = 3;
pub const COLOR_COUNT: usize = RANK * RANK;
pub const NODE_COUNT: usize = COLOR_COUNT * COLOR_COUNT;

// Number of neighbors per node (8 + 8 + 4).
const NEIGHBOR_COUNT: usize = 20;

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct SudokuArray<T>([T; NODE_COUNT]);

impl<T> SudokuArray<T> {
    pub fn new(data: [T; NODE_COUNT]) -> Self {
        return Self(data);
    }
}

impl<T> Deref for SudokuArray<T> {
    type Target = [T; NODE_COUNT];

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> DerefMut for SudokuArray<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl<T: Copy> TryFrom<&[T]> for SudokuArray<T> {
    type Error = TryFromSliceError;
    fn try_from(value: &[T]) -> Result<Self, Self::Error> {
        match <[T; NODE_COUNT]>::try_from(value) {
            Ok(arr) => Ok(Self(arr)),
            Err(err) => Err(err),
        }
    }
}

pub fn print_sudoku_array<T>(data: &[T; NODE_COUNT], printer: fn(&T) -> String) -> String {
    let mut buffer = String::new();
    for i in 0..data.len() {
        buffer += &printer(&data[i]);
        if i % COLOR_COUNT == COLOR_COUNT - 1 {
            buffer += "\n";
        }
    }
    return buffer;
}

pub type NodeIndexType = usize;
pub type ColorArray = SudokuArray<u8>;

type NeighborArray = [NodeIndexType; NEIGHBOR_COUNT];
const fn new_neighbor_array() -> NeighborArray {
    [0; NEIGHBOR_COUNT]
}

type NeighborArrayMap = SudokuArray<NeighborArray>;

pub static NEIGHBOR_ARRAY_MAP: NeighborArrayMap = build_neigh_arr_map();

const fn get_neighs_for_idx(idx: usize) -> NeighborArray {
    let mut bit_array = [false; NODE_COUNT];

    let row = idx / COLOR_COUNT;
    let col = idx % COLOR_COUNT;
    let sqr = row / RANK * RANK + col / RANK;

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

    return ret;
}

const fn build_neigh_arr_map() -> NeighborArrayMap {
    let mut ret = [new_neighbor_array(); NODE_COUNT];
    let mut i = 0;
    while i < NODE_COUNT {
        ret[i] = get_neighs_for_idx(i);
        i += 1;
    }
    return SudokuArray(ret);
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
