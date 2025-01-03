use criterion::{criterion_group, criterion_main, Criterion};

use sudoku_wasm::{generate_puzzle, GeneratorConfig};

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("gen 28", |b| {
        b.iter(|| {
            generate_puzzle(GeneratorConfig {
                timeout: None,
                target_clues_num: 28,
            })
        })
    });
    c.bench_function("gen 23", |b| {
        b.iter(|| {
            generate_puzzle(GeneratorConfig {
                timeout: None,
                target_clues_num: 23,
            })
        })
    });
    c.bench_function("gen 22", |b| {
        b.iter(|| {
            generate_puzzle(GeneratorConfig {
                timeout: None,
                target_clues_num: 22,
            })
        })
    });
    c.bench_function("gen 21", |b| {
        b.iter(|| {
            generate_puzzle(GeneratorConfig {
                timeout: None,
                target_clues_num: 21,
            })
        })
    });
}

criterion_group! {
    name = benches;
    config = Criterion::default().sample_size(20);
    targets = criterion_benchmark
}
criterion_main!(benches);
