use std::collections::HashSet;
use std::fs;

fn find_end_of_first_marker(marker_length: usize) -> Result<usize, ()> {
    let input = fs::read_to_string("./input.txt").unwrap();

    // scan through the string, character by character
    for i in 0..input.len() {
        // look forward for a marker
        // copy the string into a hashset of it's characters to check uniqueness
        let potential_marker: HashSet<char> = input[i..i + marker_length].chars().collect();

        // check our marker is truly all unique
        if potential_marker.len() == marker_length {
            // x unique characters!
            // return the position of the END of the marker (cursor is at the start, looking forward)
            return Ok(i + marker_length);
        }
    }

    Err(())
}

fn main() {
    println!("4: {}", find_end_of_first_marker(4).unwrap());
    println!("14: {}", find_end_of_first_marker(14).unwrap());
}
