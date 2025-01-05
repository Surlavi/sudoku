use std::{
    fmt::Debug,
    ops::{BitOr, BitOrAssign},
};

use crate::*;

#[derive(PartialEq, Debug)]
pub enum SolveResult {
    // The input is invalid. There is no valid result for this puzzle.
    Invalid,
    // Unique result can be found.
    Unique(ColorArray),
    // Multiple results can be found.
    Multiple,
}

// Set of colors. Specialized and optimized for the sudoku use case.
pub trait ColorSet: Debug + Clone + Copy {
    fn new(val: bool) -> Self;

    #[allow(dead_code)]
    fn set(&mut self, color: ColorType);
    fn del(&mut self, color: ColorType) -> bool;
    fn has(&self, color: ColorType) -> bool;
    fn count(&self) -> usize;
    fn minus(&mut self, other: &Self) -> usize;

    fn get_unique(&self) -> Option<u8> {
        let mut ret = None;
        for i in 1..COLOR_COUNT + 1 {
            if !self.has(i as ColorType) {
                continue;
            }
            match ret {
                Some(_) => return None,
                None => ret = Some(i as ColorType),
            }
        }
        ret
    }

    fn get_all_no_allocate(
        &self,
        hint_color: Option<u8>,
        output_buffer: &mut [u8; COLOR_COUNT],
    ) -> usize {
        if let Some(c) = hint_color {
            debug_assert!(self.has(c));
        }
        let mut ret = 0;
        let start_idx = hint_color.unwrap_or(1) - 1;
        for j in 0..COLOR_COUNT {
            // Note: start from the hint seems to be faster.
            let i = (start_idx + j as ColorType) % (COLOR_COUNT as ColorType) + 1;
            if self.has(i) {
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

    fn clear(&mut self) {
        for i in 1..COLOR_COUNT + 1 {
            self.del(i as ColorType);
        }
    }
}

// Based a boolean array. The performance is good with SIMD.
#[allow(dead_code)]
#[derive(Clone, Copy, PartialEq)]
pub struct ColorVec {
    arr: [bool; COLOR_COUNT + 1],
    // cnt is a bottleneck, so cache the value instead.
    cnt: usize,
}

impl ColorSet for ColorVec {
    fn new(val: bool) -> Self {
        ColorVec {
            arr: [val; COLOR_COUNT + 1],
            cnt: if val { COLOR_COUNT } else { 0 },
        }
    }

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

    fn has(&self, color: u8) -> bool {
        self.arr[color as usize]
    }

    fn count(&self) -> usize {
        self.cnt
    }

    fn minus(&mut self, other: &ColorVec) -> usize {
        for i in 1..COLOR_COUNT + 1 {
            if self.arr[i] && other.arr[i] {
                self.arr[i] = false;
                self.cnt -= 1;
            }
        }
        self.count()
    }
}

impl Debug for ColorVec {
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

// Based on a u16 with each bit representing a color.
#[derive(Clone, Copy, PartialEq)]
pub struct ColorBits {
    colors: u16,
}

const fn bit_val(color: u8) -> u16 {
    debug_assert!(color <= COLOR_COUNT as u8 && color > 0);
    1 << (color - 1)
}

impl ColorSet for ColorBits {
    fn new(val: bool) -> Self {
        if val {
            ColorBits {
                colors: (1 << COLOR_COUNT) - 1,
            }
        } else {
            ColorBits { colors: 0 }
        }
    }

    fn set(&mut self, color: ColorType) {
        self.colors |= bit_val(color);
    }

    fn del(&mut self, color: ColorType) -> bool {
        let ret = self.has(color);
        self.colors &= !bit_val(color);
        return ret;
    }

    fn has(&self, color: ColorType) -> bool {
        (self.colors & bit_val(color)) > 0
    }

    fn count(&self) -> usize {
        self.colors.count_ones() as usize
    }

    fn minus(&mut self, other: &Self) -> usize {
        self.colors &= !other.colors;
        self.count()
    }
}

impl Debug for ColorBits {
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

impl BitOr for ColorBits {
    type Output = Self;

    fn bitor(self, rhs: Self) -> Self::Output {
        return ColorBits {
            colors: self.colors | rhs.colors,
        };
    }
}

impl BitOrAssign for ColorBits {
    fn bitor_assign(&mut self, rhs: Self) {
        self.colors = self.colors | rhs.colors;
    }
}

#[derive(Clone, Copy, PartialEq)]
pub struct SolvingNode<T: ColorSet> {
    pub(crate) color: u8,
    pub(crate) available_colors: T,
}

impl<T: ColorSet> SudokuValue for SolvingNode<T> {
    fn from_color(number: ColorType) -> Self {
        Self {
            color: number,
            available_colors: T::new(true),
        }
    }

    fn to_color(&self) -> ColorType {
        self.color
    }
}

impl<T: ColorSet> Debug for SolvingNode<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("SolvingNode")
            .field("color", &self.color)
            .field("available_colors", &self.available_colors)
            .finish()
    }
}

pub type SolvingNodeArray<T> = SudokuArrayType<SolvingNode<T>>;

// A stack for storing node indexes. Size is fixed since it does not allow
// duplicated items in the stack.
#[derive(Clone, Copy)]
pub struct NodeIdxStack {
    items: [u8; NODE_COUNT],
    cnt: u8,
}

impl NodeIdxStack {
    pub fn new() -> Self {
        NodeIdxStack {
            items: [0; NODE_COUNT],
            cnt: 0,
        }
    }

    pub fn push(&mut self, node: u8) {
        self.items[self.cnt as usize] = node;
        self.cnt += 1;
    }

    pub fn pop(&mut self) -> Option<u8> {
        if self.cnt > 0 {
            self.cnt -= 1;
            Some(self.items[self.cnt as usize])
        } else {
            None
        }
    }

    pub fn empty(&self) -> bool {
        return self.cnt == 0;
    }
}
