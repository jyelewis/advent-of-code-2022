import os

fn find_end_of_first_marker(input string, marker_length int) int {
	// scan through the string, character by character
	for i := 0; i < input.len; i += 1 {
		// look forward for a marker
    	potential_marker := input.substr(i, i + marker_length)

		// check if all characters in our potential marker are unique
		if string_contains_unique_chars(potential_marker) {
			// return the position of the END of the marker (cursor is at the start, looking forward)
      		return i + marker_length
		}
	}

	return -1
}

fn string_contains_unique_chars(input string) bool {
	mut char_set := map[byte]bool{}
	for char in input {
		if char_set[char] {
			// we've already seen this char
			return false
		}
		char_set[char] = true
	}

	return true
}

input := os.read_file('input.txt') ?

marker4 := find_end_of_first_marker(input, 4)
println('4: $marker4')

marker14 := find_end_of_first_marker(input, 14)
println('14: $marker14')
