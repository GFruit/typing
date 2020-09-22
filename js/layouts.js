const layouts = {
    qwerty : {
        left_hand :    ["q", "w", "e", "r", "t",
                        "a", "s", "d", "f", "g",
                        "z", "x", "c", "v", "b"],
        right_hand :   ["y", "u", "i", "o", "p",
                        "h", "j", "k", "l",
                        "n", "m"],
        top_row  :      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        home_row :      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        bottom_row :    ["z", "x", "c", "v", "b", "n", "m"],

        home_position:  ["a", "s", "d", "f", "j", "k", "l"],

        index : ["r", "t", "y", "u",
                 "f", "g", "h", "j",
                 "v", "b", "n", "m"],
        middle :["e", "i",
                 "d", "k",
                 "c"],
        ring :  ["w", "o",
                 "s", "l",
                 "x"],
        pinky : ["q", "p",
                 "a",
                 "z"]
    },

    qwertz : {
        left_hand :    ["q", "w", "e", "r", "t",
                        "a", "s", "d", "f", "g",
                        "y", "x", "c", "v", "b"],
        right_hand :   ["z", "u", "i", "o", "p",
                        "h", "j", "k", "l",
                        "n", "m"],
        top_row  :      ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p"],
        home_row :      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        bottom_row :    ["y", "x", "c", "v", "b", "n", "m"],

        home_position:  ["a", "s", "d", "f", "j", "k", "l"],

        index : ["r", "t", "z", "u",
                 "f", "g", "h", "j",
                 "v", "b", "n", "m"],
        middle :["e", "i",
                 "d", "k",
                 "c"],
        ring :  ["w", "o",
                 "s", "l",
                 "x"],
        pinky : ["q", "p",
                 "a",
                 "y"]
    },

    colemak : {
        left_hand :    ["q", "w", "f", "p", "g",
                        "a", "r", "s", "t", "d",
                        "z", "x", "c", "v", "b"],
        right_hand :   ["j", "l", "u", "y", 
                        "h", "n", "e", "i", "o",
                        "k", "m"],
        top_row  :      ["q", "w", "f", "p", "g", "j", "l", "u", "y"],
        home_row :      ["a", "r", "s", "t", "d", "h", "n", "e", "i", "o"],
        bottom_row :    ["z", "x", "c", "v", "b", "k", "m"],

        home_position:  ["a", "r", "s", "t", "n", "e", "i", "o"],

        index : ["p", "g", "j", "l",
                 "t", "d", "h", "n",
                 "v", "b", "k", "m"],
        middle :["f", "u",
                 "s", "e",
                 "c"],
        ring :  ["w", "y",
                 "r", "i",
                 "x"],
        pinky : ["q", "o",
                 "a",
                 "z"]
    },

    dvorak : {
        left_hand :    [               "p", "y",
                        "a", "o", "e", "u", "i",
                             "q", "j", "k", "x"],
        right_hand :   ["f", "g", "c", "r", "l",
                        "d", "h", "t", "n", "s",
                        "b", "m", "w", "v", "z"],
        top_row  :      ["p", "y", "f", "g", "c", "r", "l"],
        home_row :      ["a", "o", "e", "u", "i", "d", "h", "t", "n", "s"],
        bottom_row :    ["q", "j", "k", "x", "b", "m", "w", "v", "z"],

        home_position:  ["a", "o", "e", "u", "h", "t", "n", "s"],

        index : ["p", "y", "f", "g",
                 "u", "i", "d", "h",
                 "k", "x", "b", "m"],
        middle :["e", "c",
                 "j", "t",
                      "w"],
        ring :  [     "r",
                 "o", "n",
                 "q", "v"],
        pinky : [     "l",
                 "a", "s",
                      "z"]
    }
}