#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

#define BUFFER_SIZE 10000

bool is_marker(char* input, size_t marker_length) {
    // keep track of the characters we've seen in this marker
    char bitmask[26] = {0};

    for (size_t i = 0; i < marker_length; i++) {
        // find character index from 0-25
        char char_num = input[i] - 'a';

        if (bitmask[char_num]) {
            // ah-ha, we've seen this character before in this input
            // not a valid marker
            return false;
        }

        // mark the character as seen and continue
        bitmask[char_num] = true;
    }

    // we got all the way through our input with no duplicate chars
    // must be a valid marker!
    return 1;
}

int find_end_of_first_marker(char* input, size_t input_length, size_t marker_length) {
    // scan through the string, character by character
    for (size_t cursor = 0; cursor < input_length - marker_length; cursor++) {
        // check if there is a marker at our cursor
        if (is_marker(&input[cursor], marker_length)) {
            // return the position of the END of the marker (cursor is at the start, looking forward)
            return cursor + marker_length;
        }
    }

    // marker never found
    return -1;
}

int main(void)
{
    FILE *input_file = fopen("./input.txt", "r");
    if (input_file == NULL) {
        perror("Failed to open input file.");
        exit(1);
    }

    // read the whole file at once (ceebs to stream process this)
    char input[BUFFER_SIZE];
    size_t input_length = fread(input, sizeof(char), BUFFER_SIZE, input_file);
    if (input_length == BUFFER_SIZE) {
        printf("Input file too large");
        exit(1);
    }

    printf(" 4: %i\n", find_end_of_first_marker(input, input_length, 4));
    printf("14: %i\n", find_end_of_first_marker(input, input_length, 14));

    fclose(input_file);
    return 0;
}
