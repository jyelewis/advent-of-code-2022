use std::fs;

pub fn main_04a() {
    let num_contained_pairs = fs::read_to_string("./input.txt").unwrap()
        .split("\n")// split file by line
        .filter(|x| !x.is_empty())// filter empty lines
        .filter(|x| str_pair_contains_pair(x)) // filter to lines containing string
        .count();

    println!("[04a] num_contained_pairs: {num_contained_pairs}");
}

// ------

fn str_pair_contains_pair(pair_str: &str) -> bool {
    // parse string into u32s
    let pair_vals: Vec<u32> = pair_str
        .split(",")
        .flat_map(|x| x.split("-"))
        .map(|x| x.parse::<u32>().unwrap())
        .collect();

    assert_eq!(pair_vals.len(), 4);

    let pair1 = (pair_vals[0], pair_vals[1]);
    let pair2 = (pair_vals[2], pair_vals[3]);

    // check twice, does p1 contain p2, does p2 contain p1
    (pair1.0 <= pair2.0 && pair1.1 >= pair2.1) ||
    (pair2.0 <= pair1.0 && pair2.1 >= pair1.1)
}
