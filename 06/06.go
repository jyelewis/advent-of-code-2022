package main

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
)

func findEndOfFirstMarker(input string, markerLength int) (int, error) {
	// scan through the string, character by character
	for i := range input {
		// check if all characters in our potential marker are unique
		if stringContainsUniqueChars(input[i : i+markerLength]) {
			// x unique characters!
			// return the position of the END of the marker (cursor is at the start, looking forward)
			return i + markerLength, nil
		}
	}

	return 0, errors.New("Marker never found")
}

func stringContainsUniqueChars(input string) bool {
	charSet := make(map[rune]bool)
	for _, char := range input {
		if charSet[char] {
			// we've already seen this char
			return false
		}
		charSet[char] = true
	}

	return true
}

func solve06() error {
	file, err := fs.ReadFile(os.DirFS("."), "input.txt")
	if err != nil {
		return err
	}
	input := string(file)

	endOfMarker4, err := findEndOfFirstMarker(input, 4)
	if err != nil {
		return err
	}
	fmt.Println("4", endOfMarker4)

	endOfMarker14, err := findEndOfFirstMarker(input, 14)
	if err != nil {
		return err
	}
	fmt.Println("14", endOfMarker14)

	return nil
}

func main() {
	err := solve06()
	if err != nil {
		panic(err)
	}
}
