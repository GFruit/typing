var wordlist;
var min;
var max;
var excluded_letters;
var excluded_strings;
var included_letters;
var left_hand;
var right_hand;
var top_row;
var home_row;
var bottom_row;
var index;
var middle;
var ring;
var pinky;
var doAlternate;
var doFingerSwitches;
var doRowSwitches;
var hand;


function setWordset () {
    wordset = document.getElementById('wordset').value;
    if (wordset == "Top 200") {
        wordlist = words.top200;
    } else if (wordset == "Top 1000") {
        wordlist = words.top1000;
    } else if (wordset == "Top 10k") {
        wordlist = words.top10k;
    }
}

function setLength() {
    min = document.getElementById('min').value;
    max = document.getElementById('max').value;
}

function setExcludingLetters() {
    excluded_letters = document.getElementById("excluding_letters").value;
}

function setExcludingStrings() {
    excluded_strings = document.getElementById("excluding_strings").value;
    if (excluded_strings.length == 0) {
        excluded_strings = [];
        return;
    }
    excluded_strings = excluded_strings.split(",");
    var trimmed = [];
    for (string of excluded_strings) {
        trimmed.push(string.trim());
    }
    excluded_strings = trimmed;
}

function setIncludingLetters() {
    included_letters = document.getElementById("including_letters").value;
}

function setIncludingStrings() {
    included_strings = document.getElementById("including_strings").value;
    if (included_strings.length == 0) {
        return;
    } else {
    included_strings = included_strings.split(",");
    var trimmed = [];
    for (string of included_strings) {
        trimmed.push(string.trim());
    }
    included_strings = trimmed;
    }
}

function setLayout () {
    layout = document.getElementById('layout').value;
    if (layout == "Qwerty") {
        left_hand = layouts.qwerty.left_hand;
        right_hand = layouts.qwerty.right_hand;
        top_row = layouts.qwerty.top_row;
        home_row = layouts.qwerty.home_row;
        bottom_row = layouts.qwerty.bottom_row;
        index = layouts.qwerty.index;
        middle = layouts.qwerty.middle;
        ring =  layouts.qwerty.ring;
        pinky = layouts.qwerty.pinky;            
    }
    else if (layout == "Qwertz") {
        left_hand = layouts.qwertz.left_hand;
        right_hand = layouts.qwertz.right_hand;
        top_row = layouts.qwertz.top_row;
        home_row = layouts.qwertz.home_row;
        bottom_row = layouts.qwertz.bottom_row;
        index = layouts.qwertz.index;
        middle = layouts.qwertz.middle;
        ring =  layouts.qwertz.ring;
        pinky = layouts.qwertz.pinky; 
    }
    else if (layout == "Colemak") {
        left_hand = layouts.colemak.left_hand;
        right_hand = layouts.colemak.right_hand;
        top_row = layouts.colemak.top_row;
        home_row = layouts.colemak.home_row;
        bottom_row = layouts.colemak.bottom_row;
        index = layouts.colemak.index;
        middle = layouts.colemak.middle;
        ring =  layouts.colemak.ring;
        pinky = layouts.colemak.pinky; 
    }
    else if (layout == "Dvorak") {
        left_hand = layouts.dvorak.left_hand;
        right_hand = layouts.dvorak.right_hand;
        top_row = layouts.dvorak.top_row;
        home_row = layouts.dvorak.home_row;
        bottom_row = layouts.dvorak.bottom_row;
        index = layouts.dvorak.index;
        middle = layouts.dvorak.middle;
        ring =  layouts.dvorak.ring;
        pinky = layouts.dvorak.pinky; 
    }
}

function setDoAlternate() {
    doAlternate = document.getElementById('doAlternate').checked;
}

function setDoFingerSwitches () {
    doFingerSwitches = document.getElementById('doFingerSwitches').checked;
}

function setDoRowSwitches() {
    doRowSwitches = document.getElementById('doRowSwitches').checked;
}

function setHand() {
    hand = document.getElementById("hand").value;
}

function displayText () {
    var word;
    var textarea = document.createElement('textarea');
    textarea.setAttribute('id', 'result');
    textarea.setAttribute('spellcheck', 'false');
    document.body.appendChild(textarea);
    for (word of filtered) {
        var textnode = document.createTextNode(word + " ");
        textarea.appendChild(textnode);

    }
}

function filterTheWords () {
    dstart = new Date();
    document.getElementById('result').remove();
    filtered = byLength();
    filtered = excludeLetters(filtered);
    filtered = excludeStrings(filtered);
    filtered = includeLetters(filtered);
    filtered = includeStrings(filtered);
    filtered = alternate(filtered);
    filtered = finger_switches(filtered);
    filtered = row_switches(filtered);
    filtered = one_hand(filtered);
    displayText(filtered);
    document.getElementById('copy').style.visibility = "visible";
    document.getElementById('reset').style.visibility = "visible";
    dend = new Date();
    var start = dstart.getTime();
    var end = dend.getTime();
    var time = end-start;
    var seconds = (time/1000).toPrecision(3);
    console.log(seconds);
}

function byLength () {
    var word;
    var filtered = [];
    for (word of wordlist) {
        if (word.length >= min && word.length <= max) {
            filtered.push(word)
        }
    }
    return filtered;
}

function excludeLetters () {
    if (excluded_letters == "") {
        return arguments[0];
    }
    var letter;
    var excluded_letter;
    var word;
    var discardWord;
    var filtered = [];
    for (word of arguments[0]) {
        word = word.toLowerCase();
        discardWord = false;
        for (letter of word) {
            if (discardWord == true) {
                break;
            }
            for (excluded_letter of excluded_letters) {
                if (letter == excluded_letter) {
                    discardWord = true;
                    break;
                }
            }
        }
        if (discardWord == true) {
            continue;
        }
        filtered.push(word);
    }
    return filtered;
}

function excludeStrings (/*wordset*/) {
    if (excluded_strings == "") {
        return arguments[0];
    }
    var excluded_string;
    var i;
    var len;
    var discardWord;
    var filtered = [];
    for (word of arguments[0]) {
        word = word.toLowerCase();
        discardWord = false;
        for (excluded_string of excluded_strings) {
            if (discardWord == true) {
                break;
            }
            if (excluded_string.length > word.length) {
                break;
            }
            len = excluded_string.length;
            i = 0;
            while (i+len <= word.length) {
                if (word.slice(i, i+len) == excluded_string) {
                    discardWord = true;
                    break;
                }
                i++;
            }
        }
        if (discardWord == true) {
            continue;
        }
        filtered.push(word);
    }
    return filtered;
}

function includeLetters () {
    if (included_letters == "") {
        return arguments[0];
    }
    var included_letter;
    var word;
    var letter;
    var validWord;
    var filtered = [];
    for (word of arguments[0]) {
        word = word.toLowerCase();
        validWord = false;
        for (letter of word) {
            if (validWord == true) {
                break;
            }
            for (included_letter of included_letters) {
                if (letter == included_letter) {
                    validWord = true;
                    break;
                }
            }
        }
        if (validWord == true) {
            filtered.push(word);
        }
    }
    return filtered;
}

function includeStrings () {
    if (included_strings == "") {
        return arguments[0];
    }
    var included_string;
    var i;
    var len;
    var validWord;
    var filtered = [];
    for (word of arguments[0]) {
        word = word.toLowerCase();
        validWord = false;
        for (included_string of included_strings) {
            if (validWord == true) {
                break;
            }
            if (included_string.length > word.length) {
                break;
            }
            len = included_string.length;
            i = 0;
            while (i+len <= word.length) {
                if (word.slice(i, i+len) == included_string) {
                    validWord = true;
                    break;
                }
                i++;
            }
        }
        if (validWord == true) {
            filtered.push(word);
        }
    }
    return filtered;
}

function alternate() {
    if (doAlternate == false) {
        return arguments[0];
    }
    var word;
    var handState;
    var left_letter;
    var validWord;
    var previous;
    var filtered = [];
    for (word of arguments[0]) {
        word = word.toLowerCase();
        validWord = true;
        previous = "";
        for (letter of word) {
            handState = "right";
            for (left_letter of left_hand) {
                if (letter == left_letter) {
                    handState = "left";
                }
            }
            if ((handState == "right" && previous == "left") || (handState == "left" && previous == "right")) {
                previous = handState;
                continue;
            } else if (previous == ""){
                previous = handState;
                continue
            } else {
                validWord = false;
                break;
            }
        }
        if (validWord == true) {
            filtered.push(word);
        }
    }
    return filtered;
}

function finger_switches() {
    if (doFingerSwitches == false) {
        return arguments[0];
    }
    var word;
    var fingerState;
    var validWord;
    var previous;
    var middleLetter;
    var ringLetter;
    var pinkyLetter;
    var filtered = [];
    for (word of arguments[0]) {
        word = word.toLowerCase();
        previous = "";
        validWord = true;
        for (letter of word) {
            fingerState = "index";
            for (middleLetter of middle) {
                if (middleLetter == letter) {
                    fingerState = "middle";
                }
            }
            for (ringLetter of ring) {
                if (ringLetter == letter) {
                    fingerState = "ring";
                }
            }
            for (pinkyLetter of pinky) {
                if (pinkyLetter == letter) {
                    fingerState = "pinky";
                }
            }
            if (fingerState == previous) {
                validWord = false;
                break
            }
            previous = fingerState;
        }
        if (validWord == true) {
            filtered.push(word);
        }
    }
    return filtered;
}

function row_switches() {
    if (doRowSwitches == false) {
        return arguments[0];
    }
    var word;
    var rowState;
    var validWord;
    var previous;
    var homeLetter;
    var bottomLetter;
    var filtered = [];
    for (word of arguments[0]) {
        word = word.toLowerCase();
        previous = "";
        validWord = true;
        for (letter of word) {
            rowState = "top";
            for (homeLetter of home_row) {
                if (homeLetter == letter) {
                    rowState = "home";
                }
            }
            for (bottomLetter of bottom_row) {
                if (bottomLetter == letter) {
                    rowState = "bottom";
                }
            }
            if (rowState == previous) {
                validWord = false;
                break
            }
            previous = rowState;
        }
        if (validWord == true) {
            filtered.push(word);
        }
    }
    return filtered;
}

function one_hand() {
    var validWord;
    var leftLetter;
    var rightLetter;
    var filtered = [];
    if (hand == "both") {
        return arguments[0];
    }
    if (hand == "left") {
        for (word of arguments[0]) {
            word = word.toLowerCase();
            validWord = true;
            for (letter of word) {
                if (validWord == false) {
                    break;
                }
                for (rightLetter of right_hand) {
                    if (rightLetter == letter) {
                        validWord = false;
                        break;
                    }
                }
            }
            if (validWord == true) {
                filtered.push(word);
            }
        }
        return filtered;
    }
    if (hand == "right") {
        for (word of arguments[0]) {
            word = word.toLowerCase();
            validWord = true;
            for (letter of word) {
                if (validWord == false) {
                    break;
                }
                for (leftLetter of left_hand) {
                    if (leftLetter == letter) {
                        validWord = false;
                        break;
                    }
                }
            }
            if (validWord == true) {
                filtered.push(word);
            }
        }
        return filtered;
    }
}

function copy() {
    var text = document.getElementById('result'); //text is an HTML collection
    text.select();
    document.execCommand('copy');
}

function reset() {
    document.getElementById('wordset').value = "Top 200";
    document.getElementById('layout').value = "Qwerty";
    document.getElementById('min').value = 1;
    document.getElementById('max').value = 30;
    document.getElementById('excluding_letters').value = "";
    document.getElementById('including_letters').value = "";
    document.getElementById('excluding_strings').value = "";
    document.getElementById('including_strings').value = "";
    document.getElementById('doAlternate').checked = false;
    document.getElementById('doFingerSwitches').checked = false;
    document.getElementById('doRowSwitches').checked = false;
    document.getElementById('result').value = "";
    wordset = "Top 200";
    layout = "Qwerty";
    min = 1;
    max = 30;
    excluded_letters = "";
    included_letters = "";
    excluded_strings = "";
    included_strings = "";
    doAlternate = false;
    doFingerSwitches = false;
    doRowSwitches = false;
    

}