with open("input.txt") as file:
    input = file.read()

    def find_end_of_first_marker(marker_length):
        # scan through the string, character by character
        for i,_ in enumerate(input):
            # look forward for a marker
            potential_marker = input[i:i + marker_length]
            if len(set(potential_marker)) == marker_length:
                # x unique characters!
                # return the position of the END of the marker (cursor is at the start, looking forward)
                return i + marker_length

        raise Exception("Marker never found")

    print("4", find_end_of_first_marker(4))
    print("14", find_end_of_first_marker(14))
