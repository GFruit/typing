var wordlist;
var wordset;
var min;
var max;
var excluded_letters;
var excluded_strings;
var included_letters;
var included_strings;
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
var setRowLetters;
var home_position;
var tips = "inactive";


function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

function setWordset () {
    wordset = document.getElementById('wordset').value;
    if (wordset == "Top 200") {
        wordlist = words.top200;
    } else if (wordset == "Top 1000") {
        wordlist = words.top1000;
    } else if (wordset == "Top 10k") {
        wordlist = words.top10k;
    } else if (wordset == "Top 30k") {
        wordlist = words.top30k;
    } else if (wordset == "Top 370k") {
        wordlist = top370k;
    } else if (wordset == "Quotes") {
        wordlist = quotes;
    }
}

function setLength() {
    min = document.getElementById('min').value;
    max = document.getElementById('max').value;
}

function setExcludingLetters() {
    excluded_letters = document.getElementById("excluding_letters").value;
    if (excluded_letters.length == 0) {
        return;
    } else {
        excluded_letters = excluded_letters.split(",");
        var trimmed = [];
        for (string of excluded_letters) {
            trimmed.push(string.trim());
        }
        excluded_letters = trimmed;
    }
}

function setExcludingStrings() {
    excluded_strings = document.getElementById("excluding_strings").value;
    if (excluded_strings.length == 0) {
        return;
    } else {
        excluded_strings = excluded_strings.split(",");
        var trimmed = [];
        for (string of excluded_strings) {
            trimmed.push(string.trim());
        }
        excluded_strings = trimmed;
        var nested_list = [];
        for (string of excluded_strings) {
            nested_list.push(string.split(' '));
        }
        excluded_strings = nested_list;
    }
}

function setIncludingLetters() {
    included_letters = document.getElementById("including_letters").value;
    if (included_letters.length == 0) {
        return;
    } else {
        included_letters = included_letters.split(",");
        var trimmed = [];
        for (string of included_letters) {
            trimmed.push(string.trim());
        }
        included_letters = trimmed;
    }
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
        var nested_list = [];
        for (string of included_strings) {
            nested_list.push(string.split(' '));
        }
        included_strings = nested_list;
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
        home_position = layouts.qwerty.home_position;
        lindex = layouts.qwerty.lindex;
        lmiddle = layouts.qwerty.lmiddle;
        lring =  layouts.qwerty.lring;
        lpinky = layouts.qwerty.lpinky; 
        rindex = layouts.qwerty.rindex;
        rmiddle = layouts.qwerty.rmiddle;
        rring =  layouts.qwerty.rring;
        rpinky = layouts.qwerty.rpinky; 
        
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
        home_position = layouts.qwertz.home_position;
        bottom_row = layouts.qwertz.bottom_row;
        lindex = layouts.qwertz.lindex;
        lmiddle = layouts.qwertz.lmiddle;
        lring =  layouts.qwertz.lring;
        lpinky = layouts.qwertz.lpinky; 
        rindex = layouts.qwertz.rindex;
        rmiddle = layouts.qwertz.rmiddle;
        rring =  layouts.qwertz.rring;
        rpinky = layouts.qwertz.rpinky;
        
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
        home_position = layouts.colemak.home_position;
        bottom_row = layouts.colemak.bottom_row;
        lindex = layouts.colemak.lindex;
        lmiddle = layouts.colemak.lmiddle;
        lring =  layouts.colemak.lring;
        lpinky = layouts.colemak.lpinky; 
        rindex = layouts.colemak.rindex;
        rmiddle = layouts.colemak.rmiddle;
        rring =  layouts.colemak.rring;
        rpinky = layouts.colemak.rpinky;

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
        home_position = layouts.dvorak.home_position;
        bottom_row = layouts.dvorak.bottom_row;
        lindex = layouts.dvorak.lindex;
        lmiddle = layouts.dvorak.lmiddle;
        lring =  layouts.dvorak.lring;
        lpinky = layouts.dvorak.lpinky; 
        rindex = layouts.dvorak.rindex;
        rmiddle = layouts.dvorak.rmiddle;
        rring =  layouts.dvorak.rring;
        rpinky = layouts.dvorak.rpinky;

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

function setRowLetters() {
    row_letters = [];
    if (document.getElementById('toprow').checked) {
        row_letters.push(top_row);
        document.getElementById('homeposition').checked = false;
    }
    if (document.getElementById('homerow').checked) {
        row_letters.push(home_row);
        document.getElementById('homeposition').checked = false;
    }
    if (document.getElementById('bottomrow').checked) {
        row_letters.push(bottom_row);
        document.getElementById('homeposition').checked = false;
    }
}

function setHomePosition() {
    if (document.getElementById('homeposition').checked) {
        row_letters = home_position;
        document.getElementById('toprow').checked = false;
        document.getElementById('homerow').checked = false;
        document.getElementById('bottomrow').checked = false;
    }
}

function setFingers() {
    finger_letters = [];
    if (document.getElementById('lpinky').checked) {
        finger_letters.push(lpinky);
    }
    if (document.getElementById('lring').checked) {
        finger_letters.push(lring);
    }
    if (document.getElementById('lmiddle').checked) {
        finger_letters.push(lmiddle);
    }
    if (document.getElementById('lindex').checked) {
        finger_letters.push(lindex);
    }
    if (document.getElementById('rpinky').checked) {
        finger_letters.push(rpinky);
    }
    if (document.getElementById('rring').checked) {
        finger_letters.push(rring);
    }
    if (document.getElementById('rmiddle').checked) {
        finger_letters.push(rmiddle);
    }
    if (document.getElementById('rindex').checked) {
        finger_letters.push(rindex);
    }
}

function displayText () {
    len = filtered.length;
    if (len == 0 && wordset == "Quotes") {
        document.getElementById('status').innerHTML = "No quotes found!";
        document.getElementById('result').innerHTML = "---";
    }
    else if (len == 0) {
        document.getElementById('status').innerHTML = "No words found!";
        document.getElementById('result').innerHTML = "---";
    }
    else if (wordset == "Quotes") {
        if (len == 1) {
            document.getElementById('status').innerHTML = len + " quote found!";
        } else {
            document.getElementById('status').innerHTML = len + " quotes found!";
        }
        document.getElementById('result').innerHTML = filtered.join('<br><br><br>');
    } else {
        if (len == 1) {
            document.getElementById('status').innerHTML = len + " word found!";
        } else {
            document.getElementById('status').innerHTML = len + " words found!";
        }
        document.getElementById('result').innerHTML = filtered.join(' ');
    }
}

function filterTheWords () {
    dstart = new Date();
    document.getElementById('status').innerHTML = "";
    filtered = byLength();
    filtered = byRows(filtered);
    filtered = byFingers(filtered);
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

function byRows () {
    if (row_letters == []) {
        return arguments[0];
    }
    temp_list = [];
    for (row of row_letters) {
        for (letter of row) {
            temp_list.push(letter);
        }
    }
    row_letters = temp_list;
    var word;
    var letter;
    var row_letter;
    var validWord;
    var partialValid;
    var validStates;
    var filtered = [];
    for (word of arguments[0]) {
        word_copy = word;
        word_copy = word_copy.toLowerCase();
        validWord = true;
        validStates = [];
        for (letter of word_copy) {
            if (isLetter(letter) == null) {
                continue;
            }
            partialValid = false;
            for (row_letter of row_letters) {
                if (row_letter == letter) {
                    partialValid = true;
                    break;
                }
            }
            validStates.push(partialValid);
        }
        for (validState of validStates) {
            if (validState == false) {
                validWord = false;
            }
        }
        if (validWord == true) {
            filtered.push(word);
        }
    }
    return filtered;
}

function byFingers () {
    if (finger_letters == []) {
        return arguments[0];
    }
    temp_list = [];
    for (finger of finger_letters) {
        for (letter of finger) {
            temp_list.push(letter);
        }
    }
    finger_letters = temp_list;
    var word;
    var letter;
    var finger_letter;
    var validWord;
    var partialValid;
    var validStates;
    var filtered = [];
    for (word of arguments[0]) {
        word_copy = word;
        word_copy = word_copy.toLowerCase();
        validWord = true;
        validStates = [];
        for (letter of word_copy) {
            if (isLetter(letter) == null) {
                continue;
            }
            partialValid = false;
            for (finger_letter of finger_letters) {
                if (finger_letter == letter) {
                    partialValid = true;
                    break;
                }
            }
            validStates.push(partialValid);
        }
        for (validState of validStates) {
            if (validState == false) {
                validWord = false;
            }
        }
        if (validWord == true) {
            filtered.push(word);
        }
    }
    return filtered;
}

function excludeLetters () {
    if (excluded_letters == "") {
        return arguments[0];
    }
    var letter;
    var word;
    var filtered = [];
    var partialDiscard;
    var discardStates;
    var partialDiscard2;
    var discardStates2;
    var value;
    var nextWord = false;
    var tempWord;
    for (word of arguments[0]) {
        word_copy = word;
        word_copy = word_copy.toLowerCase();
        nextWord = false;
        discardStates2 = [];
        for (string of excluded_letters) {
            if (nextWord == true) {
                break;
            }
            tempWord = word_copy;
            discardStates = [];
            for (string_letter of string) {
                partialDiscard = false;
                for (letter of tempWord) {
                    if (isLetter(letter) == null) {
                        continue;
                    }
                    if (letter == string_letter) {
                        partialDiscard = true;
                        tempWord = tempWord.slice(0, tempWord.indexOf(letter)) + tempWord.slice(tempWord.indexOf(letter) + 1, tempWord.length);
                        break;
                    }
                }
                discardStates.push(partialDiscard)
            }
            partialDiscard2 = true;
            for (value of discardStates) {
                if (value == false) {
                    partialDiscard2 = false;
                    break;
                }
            }
            discardStates2.push(partialDiscard2);
            if (partialDiscard2 == true) {
                nextWord = true;
                break;
            }
        }
        nextWord = false;
        for (value2 of discardStates2) {
            if (value2 == true) {
                nextWord = true;
                break;
            }
        }
        if (nextWord == false) {
            filtered.push(word);
        }
    }
    return filtered;
}

function excludeStrings (/*wordset*/) {
    if (excluded_strings == "") {
        return arguments[0];
    }
    var i;
    var len;
    var invalidWord;
    var partialinValid;
    var invalidStates;
    var filtered = [];
    var value;
    var sorted = [];

    /*
    for (sublist of excluded_strings) {

        var len = sublist.length;
        for (var i = 0; i < len; i++) {
            var el = sublist[i];
            var j;

            for (j = i - 1; j >= 0 && sublist[j].length > el.length; j--) {
                sublist[j + 1] = sublist[j];
              }
              sublist[j + 1] = el;
        }
        sorted.push(sublist);
    }*/

    for (sublist of excluded_strings) {
        sublist.sort(function(a,b) {return a.length - b.length});
        sorted.push(sublist);
    }

    var totalOverlaps = []
    for (sublist of sorted) {
        var overlapPairs = [];
        for (var i = 0 ; i <= sublist.length-2 ; i++) {
            for (var j = i+1 ; j <= sublist.length-1 ; j++) {
                var k = 0
                var overlapPair = [];
                while (k+sublist[i].length <= sublist[j].length) {
                    if (sublist[i] == sublist[j].slice(k, k+sublist[i].length)) {
                        var overlapPair = [sublist[i], sublist[j]]
                        break;
                    }
                    k++;
                }
                overlapPairs.push(overlapPair);
            }
        }
        totalOverlaps.push(overlapPairs);
    }
    
    var distinct_list = [];
    var distinct_sublist;
    var unique;
    for (overlapPairs of totalOverlaps) {
        distinct_sublist = [];
        for (overlapPair of overlapPairs) {
            for (value of overlapPair) {
                unique = true;
                for (element of distinct_sublist) {
                    if (element == value) {
                        unique = false;
                        break;
                    }
                }
                if (unique == true) {
                    distinct_sublist.push(value);
                }
            }
        }
        distinct_list.push(distinct_sublist);
    }

    var fixed_sublist;
    var fixed_list = [];
    var i = -1;
    for (sublist of excluded_strings) {
        i++;
        fixed_sublist = [];
        for (value of sublist) {
            for (element of distinct_list[i]) {
                if (value == element) {
                    fixed_sublist.push(value);
                    break;
                }
            }
        }
        fixed_list.push(fixed_sublist)
    }
    
   var excluded_strings_copy = [];
   var sublist_copy;
   for (sublist of excluded_strings) {
       sublist_copy = [];
       for (string of sublist) {
           sublist_copy.push(string);
       }
       excluded_strings_copy.push(sublist_copy);
   }

    var i = 0;
    for (sublist of fixed_list) {
        for (value of sublist) {
            index = excluded_strings_copy[i].indexOf(value);
            excluded_strings_copy[i].splice(index, 1);
        }
        i++;
    }

    for (word of arguments[0]) {
        word_copy = word;
        word_copy = word_copy.toLowerCase();
        invalidWord = false;
        var idx = -1;
        for (sublist of excluded_strings_copy) {
            idx++;
            invalidStates = [];
            if (invalidWord == true) {
                break;
            }
            for (string of sublist) {
                partialinValid = false;
                if (string.length > word_copy.length) {
                    invalidStates.push(partialinValid);
                    break;
                }
                len = string.length;
                i = 0;
                while (i+len <= word_copy.length) {
                    if (word_copy.slice(i, i+len) == string) {
                        partialinValid = true;
                        break;
                    }
                    i++;
                }
                invalidStates.push(partialinValid);
            }
            tempWord = word_copy;
            for (string of fixed_list[idx]) {
                partialinValid = false;
                if (string.length > tempWord.length) {
                    invalidStates.push(partialinValid);
                    break;
                }
                len = string.length;
                i = 0;
                while (i+len <= tempWord.length) {
                    if (tempWord.slice(i, i+len) == string) {
                        partialinValid = true;
                        tempWord = tempWord.slice(0, tempWord.indexOf(string)) + tempWord.slice(tempWord.indexOf(string) + string.length, tempWord.length);
                        break;
                    }
                    i++;
                }
                invalidStates.push(partialinValid);
            }
            invalidWord = true;
            for (value of invalidStates) {
                if (value == false) {
                    invalidWord = false;
                    break;
                }
            }
        }
        if (invalidWord == false) {
            filtered.push(word);
        }
    }
    return filtered;
}

function includeLetters () {
    if (included_letters == "") {
        return arguments[0];
    }
    var word;
    var letter;
    var filtered = [];
    var string;
    var string_letter;
    var validStates;
    var partialValid;
    var value;
    var checkNextString;
    var tempWord;
    for (word of arguments[0]) {
        word_copy = word;
        word_copy = word_copy.toLowerCase();
        for (string of included_letters) {
            validStates = [];
            tempWord = word_copy;
            for (string_letter of string) {
                partialValid = false;
                for (letter of tempWord) {
                    if (partialValid == true) {
                        break;
                    }
                    if (string_letter == letter) {
                        partialValid = true
                        tempWord = tempWord.slice(0, tempWord.indexOf(letter)) + tempWord.slice(tempWord.indexOf(letter) + 1, tempWord.length);
                        break;
                    }
                }
                validStates.push(partialValid);
            }
            checkNextString = false;
            for (value of validStates) {
                if (value == false) {
                    checkNextString = true;
                    break
                }
            }
            if (checkNextString == false) {
                filtered.push(word);
                break;
            }

        }
    }
    return filtered;
}

function includeStrings () {
    if (included_strings == "") { //for some reason after executing this function the included_strings becomes "empty"
        return arguments[0];
    }
    var i;
    var len;
    var validWord;
    var partialValid;
    var validStates;
    var filtered = [];
    var value;
    var sorted = [];
    //sort list
    /*
    for (sublist of included_strings) {
        //console.log(sublist)
        var len = sublist.length;
        for (var i = 0; i < len; i++) {
            var el = sublist[i];
            var j;

            for (j = i - 1; j >= 0 && sublist[j].length > el.length; j--) {
                sublist[j + 1] = sublist[j];
              }
              sublist[j + 1] = el;
        }
        sorted.push(sublist);
    }
    */
    for (sublist of included_strings) {
        sublist.sort(function(a,b) {return a.length - b.length});
        sorted.push(sublist);
    }
    //find pairs that overlap
    var totalOverlaps = []
    for (sublist of sorted) {
        //console.log(sublist)
        var overlapPairs = [];
        for (var i = 0 ; i <= sublist.length-2 ; i++) {
            for (var j = i+1 ; j <= sublist.length-1 ; j++) {
                var k = 0
                var substring = "";
                var overlapPair = [];
                while (k+sublist[i].length <= sublist[j].length) {
                    substring = false;
                    if (sublist[i] == sublist[j].slice(k, k+sublist[i].length)) {
                        var substring = true;
                        var overlapPair = [sublist[i], sublist[j]]
                        break;
                    }
                    k++;
                }
                overlapPairs.push(overlapPair);
            }
        }
        totalOverlaps.push(overlapPairs);
    }

    /*
    console.log('totalOverlaps')
    console.log(totalOverlaps);
    */
    
    var distinct_list = [];
    var distinct_sublist;
    var unique;
    for (overlapPairs of totalOverlaps) {
        distinct_sublist = [];
        for (overlapPair of overlapPairs) {
            for (value of overlapPair) {
                unique = true;
                for (element of distinct_sublist) {
                    if (element == value) {
                        unique = false;
                        break;
                    }
                }
                if (unique == true) {
                    distinct_sublist.push(value);
                }
            }
        }
     distinct_list.push(distinct_sublist);
    }

    /*
    console.log( distinct_list')
    console.log distinct_list); //distinct values that should not overlap however the amounts aren't right in case there are duplicates for example
    */

    var fixed_sublist;
    var fixed_list = [];
    var i = -1;
    for (sublist of included_strings) { //to fix the amounts
        i++;
        fixed_sublist = [];
        for (value of sublist) {
            for (element of distinct_list[i]) {
                if (value == element) {
                    fixed_sublist.push(value);
                    break;
                }
            }
        }
        fixed_list.push(fixed_sublist)
    }
    
 distinct_list = fixed_list //replace bad list with good list
    
    /*
    console.log('fixed new list')
    console.log distinct_list);
    */
    
    //var included_strings_copy = included_strings;


    var included_strings_copy = [];
    var sublist_copy;
    for (sublist of included_strings) {
        sublist_copy = [];
        for (string of sublist) {
            sublist_copy.push(string);
        }
        included_strings_copy.push(sublist_copy);
    }


    var i = 0;
    for (sublist of distinct_list) {
        for (value of sublist) {
            index = included_strings_copy[i].indexOf(value);
            included_strings_copy[i].splice(index, 1); //remove those values from the original array
        }
        i++;
    }
    
    /*
    console.log('included_strings');
    console.log(included_strings);
    */

    //continue as normal with the strings that aren't allowed to be overlapped in a separate list  distinct_list)
    for (word of arguments[0]) {
        word_copy = word;
        word_copy = word_copy.toLowerCase();
        validWord = false;
        var idx = -1;
        for (sublist of included_strings_copy) {
            idx++;
            validStates = [];
            if (validWord == true) {
                break;
            }
            for (string of sublist) {
                partialValid = false;
                if (string.length > word_copy.length) {
                    validStates.push(partialValid);
                    break;
                }
                len = string.length;
                i = 0;
                while (i+len <= word_copy.length) {
                    if (word_copy.slice(i, i+len) == string) {
                        partialValid = true;
                        break;
                    }
                    i++;
                }
                validStates.push(partialValid);
            }
            tempWord = word_copy;
            for (string of distinct_list[idx]) {
                partialValid = false;
                if (string.length > tempWord.length) {
                    validStates.push(partialValid);
                    break;
                }
                len = string.length;
                i = 0;
                while (i+len <= tempWord.length) {
                    if (tempWord.slice(i, i+len) == string) {
                        partialValid = true;
                        tempWord = tempWord.slice(0, tempWord.indexOf(string)) + tempWord.slice(tempWord.indexOf(string) + string.length, tempWord.length);
                        break;
                    }
                    i++;
                }
                validStates.push(partialValid);
            }
            validWord = true;
            for (value of validStates) {
                if (value == false) {
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
        word_copy = word;
        word_copy = word_copy.toLowerCase();
        validWord = true;
        previous = "";
        for (letter of word_copy) {
            if (isLetter(letter) == null) {
                continue;
            }
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
        word_copy = word;
        word_copy = word_copy.toLowerCase();
        previous = "";
        validWord = true;
        for (letter of word_copy) {
            if (isLetter(letter) == null) {
                continue;
            }
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
        word_copy = word;
        word_copy = word_copy.toLowerCase();
        previous = "";
        validWord = true;
        for (letter of word_copy) {
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
            word_copy = word;
            word_copy = word_copy.toLowerCase();
            validWord = true;
            for (letter of word_copy) {
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
            word_copy = word;
            word_copy = word_copy.toLowerCase();
            validWord = true;
            for (letter of word_copy) {
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

function reset() {
    document.getElementById('wordset').value = "Top 200";
    document.getElementById('layout').value = "Qwerty";
    document.getElementById('hand').value = "both";
    document.getElementById('toprow').checked = true;
    document.getElementById('homerow').checked = true;
    document.getElementById('bottomrow').checked = true;
    document.getElementById('homeposition').checked = false;
    document.getElementById('lpinky').checked = true;
    document.getElementById('lring').checked = true;
    document.getElementById('lmiddle').checked = true;
    document.getElementById('lindex').checked = true;
    document.getElementById('rpinky').checked = true;
    document.getElementById('rring').checked = true;
    document.getElementById('rmiddle').checked = true;
    document.getElementById('rindex').checked = true;
    document.getElementById('min').value = 1;
    document.getElementById('max').value = 999;
    document.getElementById('excluding_letters').value = "";
    document.getElementById('including_letters').value = "";
    document.getElementById('excluding_strings').value = "";
    document.getElementById('including_strings').value = "";
    document.getElementById('doAlternate').checked = false;
    document.getElementById('doFingerSwitches').checked = false;
    document.getElementById('doRowSwitches').checked = false;
    document.getElementById('result').innerHTML = "---";
    document.getElementById('status').innerHTML = "Successully Reset";
    wordlist = words.top200;
    setWordset();
    setLayout();
    setHand();
    setRowLetters();
    setFingers();
    setLength();
    excluded_letters = "";
    included_letters = "";
    excluded_strings = "";
    included_strings = "";
    doAlternate = false;
    doFingerSwitches = false;
    doRowSwitches = false;

}
    
function copy(node) {
  node = document.getElementById(node);

  if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(node);
      range.select();
  } else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
  } else {
      console.warn("Could not select text in node: Unsupported browser.");
  }
  document.execCommand('copy');
  document.getElementById('status').innerHTML = "Copied to Clipboard!";
}

function showTips() {
    if (tips == "inactive") {
        document.getElementById('left').style.visibility = "visible";
        document.getElementById('right').style.visibility = "visible";
        document.getElementById('info').innerHTML = 'hide help'
        tips = "active";
    } else if (tips == "active") {
        document.getElementById('left').style.visibility = "hidden";
        document.getElementById('right').style.visibility = "hidden";
        document.getElementById('info').innerHTML = 'show help'
        tips = "inactive";
    }
}

function load370k() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            top370k = this.responseText;
            top370k = JSON.parse(top370k);
        }
    }
    xhttp.open("GET", "js/370k.json", true);
    xhttp.send();
}