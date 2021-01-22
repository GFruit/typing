let stats = {
    wrong : {
        letters : {},
        bigrams : {},
        words : {},
        wordpairs : {}
    },
    correct : {
        letters : {},
        bigrams : {},
        words: {},
        wordpairs : {}
    },
    time : {
        letters : {},
        bigrams : {},
        words: {},
        wordpairs : {}
    }
}

let hide = false;
 

let obj = {
    itemcounter: 0,
    lettercounter: 0,
    lettercount: 0,
    wordcounter: 0,
    wordcount: 0,
    highlight: false,
    previousOffset: -1,
    previousLen: 0,
    mistake: false,
    mistakeIdx: -1,
    scrolldowncounter: 0,
    scrollupcounter: 0,
    cooldown: 0,
    selection: "",
    selectedText: "",
    selectionStart: 0,
    selectionEnd: 0,
    selectionMiddle: 0,
    new_input: '',
    updateInput: false,
    scrollTop: 0,
    input: '',
    len: 0,
    letters: ''
}

let toggles = {
    statsDisplay: 'errors',
    sorting: 'ascending',
    minAmount: 1
}

let times = {
    letters : {
        startTime : 0,
        endTime : 0
    },
    bigrams : {
        startTime1 : 0,
        endTime1 : 0,
        startTime2 : 0,
        endTime2 : 0,
        startTime3 : 0,
        endTime3 : 0,
        cooldown : 0
    },
    words: {
        startTime : 0,
        endTime : 0
    },
    wordpairs : {
        startTime1 : 0,
        endTime1 : 0,
        startTime2 : 0,
        endTime2 : 0,
        startTime3  : 0,
        endTime3 : 0,
        cooldown : 0
    }
    
}

let offsetList = [];

let flash = {
    caretChange: false
}

let states = {
    shift: false,
    ctrl: false
}

let caret = {
    previousPos: 0, //so we know where to remove the flashing animation
    currentPos: 0, //so we know where to add the flashing animation,
}

let style = {
    top: 25,
    background: getComputedStyle(document.querySelector(':root')).getPropertyValue("--background"),
	textColor: getComputedStyle(document.querySelector(':root')).getPropertyValue("--text"),
	subColor: getComputedStyle(document.querySelector(':root')).getPropertyValue("--sub-color"),
	hoverColor: getComputedStyle(document.querySelector(':root')).getPropertyValue("--hover-color"),
    caretColor: getComputedStyle(document.querySelector(':root')).getPropertyValue("--caret-color"),
}


if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    // true for mobile device
    obj.mobile = true;
  }else{
    // false for not mobile device
    obj.mobile = false;
  }

var isFirefox = typeof InstallTrigger !== 'undefined';

document.getElementById('typing-input').addEventListener("input", getValue);
document.getElementById('typing-input').addEventListener("keydown", keydown);
document.getElementById('typing-input').addEventListener("keyup", keyup);

input_box = document.getElementById('typing-input');

function keydown(e) {
    let keyCode = e.which || e.keyCode;
    input_box = document.getElementById('typing-input');

    if (keyCode == 13) {
        refresh();
        return;
    }
    
    if (keyCode == 8 && states.ctrl && obj.highlight && isFirefox) { //make it so ctrl + backspace on highlight acts like normal backspace

        obj.new_input = obj.input.slice(0, obj.selectionStart) + obj.input.slice(obj.selectionEnd, obj.len); //good
        caret.currentPos = obj.selectionStart;
        if (caret.currentPos > 0) {
            obj.updateInput = true;
        } else {
            obj.updateInput = true;
            getValue();
            return;
        }
        removeHighlight();
        checkOffset();
    }
    switch(keyCode) {
        case 16:
            if (states.shift == false) {
                states.shift = true;
                return;
            }
        case 17:
            if (states.ctrl == false) {
                states.ctrl = true;
                return
            }
        case 35: //end
            if (states.ctrl == true && states.shift == true) {
                if (obj.highlight == false) {
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) { //left to middle, handle cross overs here
                    obj.selectionStart = obj.selectionEnd;
                    caret.currentPos = obj.selectionStart;
                }
                obj.selectionEnd = obj.len;
            } else if (states.shift == true) {
                if (obj.highlight == false) {
                    obj.selectionStart = caret.currentPos;
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart;
                    obj.selectionEnd = leftRight(obj.selectionEnd, 'right');
                } else if (obj.highlight == true) {
                    if (obj.selectionMiddle == obj.selectionStart) {
                        obj.selectionEnd = leftRight(obj.selectionEnd, 'right');
                    } else if (obj.selectionMiddle == obj.selectionEnd) {
                        obj.selectionStart = obj.selectionEnd;
                        caret.currentPos = obj.selectionStart;
                        obj.selectionEnd = leftRight(obj.selectionEnd, 'right');
                    }
                }
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
            } else if (states.ctrl == true) {
                caret.currentPos = obj.len;
            } else {
                if (obj.highlight == false) {
                    caret.currentPos = leftRight(caret.currentPos, 'right')
                } else {
                    if (obj.selectionMiddle == obj.selectionStart) {
                        caret.currentPos = obj.selectionEnd;
                        obj.selectionEnd = leftRight(obj.selectionEnd, 'right');
                    } else if (obj.selectionMiddle = obj.selectionEnd) {
                        caret.currentpos = obj.selectionStart;
                        obj.selectionEnd = leftRight(obj.selectionEnd, 'right');
                    }
                }
                e.preventDefault();
                if (caret.previousPos > 0) {
                    setCaretPosition("typing-input", caret.currentPos);
                } else {
                    input = document.getElementById('typing-input').value
                    document.getElementById('typing-input').value = ' ' + input;
                    setCaretPosition("typing-input", caret.currentPos);
                    document.getElementById('typing-input').value = input;
                    setCaretPosition("typing-input", caret.currentPos);
                }

            }
            break;
        case 36: //home
            if (states.ctrl == true && states.shift == true) {
                if (obj.highlight == false) {
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd;
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) {  //handle cross overs here
                    obj.selectionEnd = obj.selectionStart;                  
                }
                caret.currentPos = 0;
                obj.selectionStart = caret.currentPos
            } else if (states.shift == true) {
                if (obj.highlight == false) {
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd;
                    obj.selectionStart = leftRight(obj.selectionStart, 'left');
                    caret.currentPos = obj.selectionStart;
                } else {
                    if (obj.selectionMiddle == obj.selectionStart) {//when it's highlighted and you do it again it's not supposed to remove the highlight
                        obj.selectionEnd = obj.selectionStart;
                        obj.selectionStart = leftRight(obj.selectionStart, 'left');
                    } else if (obj.selectionMiddle = obj.selectionEnd) {
                        obj.selectionStart = leftRight(obj.selectionStart, 'left');
                    }
                }
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
            } else if (states.ctrl == true) {
                caret.currentPos = 0;
            } else {
                if (obj.highlight == false) {
                    caret.currentPos = leftRight(caret.currentPos, 'left');
                } else {
                    if (obj.selectionMiddle == obj.selectionStart) {
                        caret.currentPos = obj.selectionEnd;
                        caret.currentPos = leftRight(caret.currentPos, 'left');
                    } else if (obj.selectionMiddle = obj.selectionEnd) {
                        caret.currentpos = obj.selectionStart;
                        caret.currentPos = leftRight(caret.currentPos, 'left');
                    }
                }
                adjustCaret(e, caret.currentPos, caret.previousPos);
            }
            break;
        case 37: //left
            if (states.ctrl == true && states.shift == true) {
                if (obj.highlight == false) {
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd
                    if (caret.currentPos > 0) {
                        let previousLetter = obj.letters[caret.currentPos-1];
                        if (previousLetter.innerHTML == ' ') {
                            caret.currentPos -= 1;
                            previousLetter = obj.letters[caret.currentPos-1];
                        }
                        while (previousLetter.innerHTML != ' ' && caret.currentPos >= 1) {
                            caret.currentPos -= 1;
                            if (caret.currentPos > 0) {
                                previousLetter = obj.letters[caret.currentPos-1]
                            }
                        }
                    }
                    obj.selectionStart = caret.currentPos;
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) {
                    if (caret.currentPos > 0) {
                        let previousLetter = obj.letters[caret.currentPos-1];
                        if (previousLetter.innerHTML == ' ') {
                            caret.currentPos -= 1;
                            previousLetter = obj.letters[caret.currentPos-1];
                        }
                        while (previousLetter.innerHTML != ' ' && caret.currentPos >= 1) {
                            caret.currentPos -= 1;
                            if (caret.currentPos > 0) {
                                previousLetter = obj.letters[caret.currentPos-1]
                            }
                        }
                    }
                    obj.selectionStart = caret.currentPos;
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) {  //handle cross overs here
                    let previousLetter = obj.letters[obj.selectionEnd-1];
                    if (previousLetter.innerHTML == ' ') {
                        obj.selectionEnd -= 1;
                        previousLetter = obj.letters[obj.selectionEnd-1];
                    }
                    while (previousLetter.innerHTML != ' ' && obj.selectionEnd >= 1) {
                        obj.selectionEnd -= 1;
                        if (obj.selectionEnd > 0) {
                            previousLetter = obj.letters[obj.selectionEnd-1]
                        }
                    }
                    if (obj.selectionStart > obj.selectionEnd) {
                        let temp = obj.selectionStart;
                        obj.selectionStart = obj.selectionEnd;
                        obj.selectionEnd = temp;     
                    }
                }
                caret.currentPos = obj.selectionStart;
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
            } else if (states.shift == true) {
                if (obj.highlight == false && caret.currentPos-1 >= 0) {
                    caret.currentPos -= 1;
                    obj.selectionStart = caret.currentPos;
                    obj.selectionEnd = caret.currentPos + 1;
                    obj.selectionMiddle = caret.currentPos + 1;
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) { //right to middle
                    obj.selectionEnd -= 1;
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle && obj.selectionStart-1 >= 0) { //middle to left
                    caret.currentPos -= 1;
                    obj.selectionStart -= 1;
                }
            } else if (states.ctrl == true) {
                if (caret.currentPos > 0) {
                    let previousLetter = obj.letters[caret.currentPos-1];
                    if (previousLetter.innerHTML == ' ') {
                        caret.currentPos -= 1;
                        previousLetter = obj.letters[caret.currentPos-1];
                    }
                    while (previousLetter.innerHTML != ' ' && caret.currentPos >= 1) {
                        caret.currentPos -= 1;
                        if (caret.currentPos > 0) {
                            previousLetter = obj.letters[caret.currentPos-1]
                        }
                    }
                }
                if (isFirefox == true && obj.highlight == true) {
                    caret.currentPos = obj.selectionStart;
                }
                if (obj.highlight == true) {
                    obj.selectionStart = caret.currentPos;
                    obj.selectionEnd = caret.currentPos;
                }
                adjustCaret(e, caret.currentPos, caret.previousPos)
            } else {
                if (obj.highlight == true) {
                    caret.currentPos = obj.selectionStart;
                    obj.selectionStart = 0;
                    obj.selectionEnd = 0;
                } else if (caret.currentPos-1 >= 0) {
                    caret.currentPos -= 1;
                }
            }
            break;
        case 38: //up
            if (states.ctrl == true && states.shift == true) {
                if (obj.highlight == false) {
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd;
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) {  //handle cross overs here
                    obj.selectionEnd = obj.selectionStart;                  
                }
                caret.currentPos = 0;
                obj.selectionStart = caret.currentPos 
            } else if (states.shift == true) {
                e.preventDefault();
                if (obj.highlight == false) { //middle
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd;
                    caret.currentPos = upDown(caret.currentPos, "up");
                    obj.selectionStart = caret.currentPos;

                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) { //right to middle
                    obj.selectionEnd = upDown(obj.selectionEnd, "up");
                    if (obj.selectionEnd < obj.selectionStart) {
                        temp = obj.selectionStart;
                        obj.selectionStart = obj.selectionEnd;
                        obj.selectionEnd = temp;
                        obj.selectionMiddle = obj.selectionEnd;
                    }
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) {//middle to left
                    caret.currentPos = upDown(caret.currentPos, "up");
                    obj.selectionStart = caret.currentPos;
                }
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
            } else if (states.ctrl == true) {
                caret.currentPos = 0;
            } else {
                e.preventDefault();
                caret.currentPos = upDown(caret.currentPos, "up");
                adjustCaret(e, caret.currentPos, caret.previousPos);
            }
            break;
        case 39: //right
            if (states.ctrl == true && states.shift == true) {
                if (obj.highlight == false) {
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart
                    obj.selectionEnd = caret.currentPos;
                    if (obj.selectionEnd < obj.len) {
                        let previousLetter = obj.letters[obj.selectionEnd-1];
                        if (obj.selectionEnd == 0 || previousLetter.innerHTML == ' ') {
                            obj.selectionEnd += 1;
                            previousLetter = obj.letters[obj.selectionEnd-1]
                        }
                        while (obj.selectionEnd < obj.len && previousLetter.innerHTML != ' ') {
                            obj.selectionEnd += 1;
                            previousLetter = obj.letters[obj.selectionEnd-1]
                        }
                    }
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) { //left to middle, handle cross overs here
                    if (caret.currentPos < obj.len) {
                        let previousLetter = obj.letters[caret.currentPos-1];
                        if (caret.currentPos == 0 || previousLetter.innerHTML == ' ') {
                            caret.currentPos += 1;
                            previousLetter = obj.letters[caret.currentPos-1]
                        }
                        while (caret.currentPos < obj.len && previousLetter.innerHTML != ' ') {
                            caret.currentPos += 1;
                            previousLetter = obj.letters[caret.currentPos-1]
                        }
                    }

                    obj.selectionStart = caret.currentPos; 

                    if (obj.selectionStart > obj.selectionEnd) {
                        let temp = obj.selectionStart;
                        obj.selectionStart = obj.selectionEnd;
                        obj.selectionEnd = temp;     
                    }
                    caret.currentPos = obj.selectionStart;
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) { //middle to right
                    if (obj.selectionEnd < obj.len) {
                        let previousLetter = obj.letters[obj.selectionEnd-1];
                        if (obj.selectionEnd == 0 || previousLetter.innerHTML == ' ') {
                            obj.selectionEnd += 1;
                            previousLetter = obj.letters[obj.selectionEnd-1]
                        }
                        while (obj.selectionEnd < obj.len && previousLetter.innerHTML != ' ') {
                            obj.selectionEnd += 1;
                            previousLetter = obj.letters[obj.selectionEnd-1]
                        }
                    }
                }
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
            } else if (states.shift == true) {
                if (obj.selectionEnd <= obj.len) {
                    if (obj.highlight == false) { //middle
                        if (caret.currentPos == obj.len) {
                            return;
                        }
                        obj.selectionStart = caret.currentPos;
                        obj.selectionEnd = caret.currentPos + 1;
                        obj.selectionMiddle = caret.currentPos;
                    } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) { //middle+1 to right
                        if (obj.selectionEnd < obj.len) {
                            obj.selectionEnd += 1
                        }
                    } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) {//left to middle-1
                        obj.selectionStart += 1
                        caret.currentPos += 1
                    }
                }
            } else if (states.ctrl == true) {
                if (caret.currentPos < obj.len) {
                    let previousLetter = obj.letters[caret.currentPos-1];
                    if (caret.currentPos == 0 || previousLetter.innerHTML == ' ') {
                        caret.currentPos += 1;
                        previousLetter = obj.letters[caret.currentPos-1]
                    }
                    while (caret.currentPos < obj.len && previousLetter.innerHTML != ' ') {
                        caret.currentPos += 1;
                        previousLetter = obj.letters[caret.currentPos-1]
                    }
                }
                if (isFirefox == true && obj.highlight == true) {
                    caret.currentPos = obj.selectionEnd;
                }
                adjustCaret(e, caret.currentPos, caret.previousPos)
            } else {
                if (obj.highlight == true) {
                    caret.currentPos = obj.selectionEnd;
                    obj.selectionStart = 0;
                    obj.selectionEnd = 0
                } else if (caret.currentPos+1 <= obj.len) {
                    caret.currentPos += 1
                }
            }
            break;
        case 40: //down
            if (states.ctrl == true && states.shift == true) {
                if (obj.highlight == false) {
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) { //left to middle, handle cross overs here
                    obj.selectionStart = obj.selectionEnd;
                    caret.currentPos = obj.selectionStart;
                }
                obj.selectionEnd = obj.len;
            } else if (states.shift == true) {
                if (obj.highlight == false) { //middle
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart;
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionEnd = upDown(obj.selectionEnd, "down");
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) { //middle+1 to right
                    obj.selectionEnd = upDown(obj.selectionEnd, "down");
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) {
                    caret.currentPos = upDown(caret.currentPos, "down");
                    obj.selectionStart = caret.currentPos;
                }
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
            } else if (states.ctrl == true) {
                caret.currentPos = obj.len;
            } else {
                e.preventDefault();
                caret.currentPos = upDown(caret.currentPos, "down");
                adjustCaret(e, caret.currentPos, caret.previousPos);
            }
            break;
        case 65:
            if (states.ctrl == true) {
                obj.selectionStart = 0;
                obj.selectionEnd = obj.len;
                caret.currentPos = 0;
            }
    }
    removeHighlight();
    addHighlight();
    checkOffset();
    stopFlash();
    startFlash();
    updateCaret();
    caret.previousPos = caret.currentPos;
}

function keyup(e) {
    let keyCode = e.which || e.keyCode;

    switch(keyCode) {
        case 16:
            states.shift = false;
            break;
        case 17:
            states.ctrl = false;
            break;
    }
}

function upDown(toBeChanged, direction) {
    let offsetLeftOriginal = obj.letters[toBeChanged].offsetLeft;
    let differences = {};
    if (direction == 'up') {
        toBeChanged = leftRight(toBeChanged, 'left');
        if (toBeChanged-1 >= 0) {
            let j = toBeChanged - 1;
            differences[j] = Math.abs(obj.letters[j].offsetLeft - offsetLeftOriginal)
            for (i = toBeChanged - 1; i > 0 && obj.letters[i].offsetTop == obj.letters[i-1].offsetTop; i--) {
                j--;
                differences[j] = Math.abs(obj.letters[j].offsetLeft - offsetLeftOriginal)
            } 
        }
    } else if (direction == 'down') {
        toBeChanged = leftRight(toBeChanged, 'right');
        if (toBeChanged+1 <= obj.len) {
            let j = toBeChanged + 1
            differences[j] = Math.abs(obj.letters[j].offsetLeft - offsetLeftOriginal)
            for (i = toBeChanged + 1; i < obj.len && obj.letters[i].offsetTop == obj.letters[i+1].offsetTop; i++) {
                j++;
                differences[j] = Math.abs(obj.letters[j].offsetLeft - offsetLeftOriginal)
            } 
        }
    }

    if (!(Object.keys(differences).length === 0 && obj.constructor === Object)) { //if object not empty
        keys = Object.keys(differences);
        let min = keys[0];
        for (k in differences) {
            if (differences[k] < differences[min]) {
                min = k
            }
        }
        toBeChanged = parseInt(min);
    }
    return toBeChanged;
}

function leftRight(toBeChanged, direction) {
    if (direction == 'left') {
        for (i = toBeChanged; i > 0 && obj.letters[i].offsetTop == obj.letters[i-1].offsetTop; i--) {   
            toBeChanged--;
        }
    } else if (direction == 'right') {
        for (i = toBeChanged; i < obj.len && obj.letters[i].offsetTop == obj.letters[i+1].offsetTop; i++) {   
            toBeChanged++;
        }
    }
    return toBeChanged;
}

function adjustCaret(e, currentPos, previousPos) {
    if (previousPos > 0) {
        if (e) {
            e.preventDefault(); 
        }
        setCaretPosition("typing-input", currentPos);
    } else {
        document.getElementById('typing-input').value = ' ' + obj.input;
        if (e) {
            e.preventDefault(); 
        }
        setCaretPosition("typing-input", currentPos);
        document.getElementById('typing-input').value = obj.input;
        setCaretPosition("typing-input", currentPos);
    }
}

function setCaretPosition(elemId, caretPos) {
    var elem = document.getElementById(elemId);

    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

function setWordset (value) { 
    if (value == "Top 200") {
        wordlist = words.top200;
        document.getElementById('top200').style.color = style.subColor;
        document.getElementById('top1000').style.color = style.textColor;
        document.getElementById('quotes').style.color = style.textColor;
    } else if (value == "Top 1000") {
        wordlist = words.top1000;
        document.getElementById('top200').style.color = style.textColor;
        document.getElementById('top1000').style.color = style.subColor;
        document.getElementById('quotes').style.color = style.textColor;
    } else if (value == "Quotes") {
        wordlist = quotes;
        document.getElementById('top200').style.color = style.textColor;
        document.getElementById('top1000').style.color = style.textColor;
        document.getElementById('quotes').style.color = style.subColor;
    }
    wordset = value;
    reset();
    loadWords();
    setPreviousOffset();
    focusInput();
}

function toggleStats(statsDisplay) {
    toggles.statsDisplay = statsDisplay;
    if (statsDisplay == "errors") {
        document.getElementById('errors').style.color = style.subColor;
        document.getElementById('accuracy').style.color = style.textColor;
        document.getElementById('speed').style.color = style.textColor;
    } else if (statsDisplay == "accuracy") {
        document.getElementById('errors').style.color = style.textColor;
        document.getElementById('accuracy').style.color = style.subColor;
        document.getElementById('speed').style.color = style.textColor;
    } else if (statsDisplay == "speed") {
        document.getElementById('errors').style.color = style.textColor;
        document.getElementById('accuracy').style.color = style.textColor;
        document.getElementById('speed').style.color = style.subColor;
    }
    displayStats();
    focusInput();
}

function toggleSort() {
    if (toggles.sorting == "ascending") {
        toggles.sorting = "descending";
    } else {
        toggles.sorting = "ascending";
    }
    displayStats();
    focusInput();
}

function setMinAmount() {
    toggles.minAmount = document.getElementById("min").value;
    displayStats();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

async function getItem(item, cache) {
    var request = item + '.json';
    const response = await cache.match(request);
    if (response != undefined) {
        const result = await response.text();
        stats[item] = JSON.parse(result);
    }
    obj.itemcounter += 1;
    if (obj.itemcounter == 4) {
        displayStats();
        updateStatus();
    }
}

if ('caches' in window) {
  
  caches.open('new-cache').then(function(cache) {
      for (item in stats) {
          getItem(item, cache);
      }
  })
}

function loadWords() {
    document.getElementById('textdisplay').innerHTML = "";
    if (wordset == "Quotes") {
        wordlist = quotes;
        shuffle(wordlist);
        wordlist = wordlist[0].split(' ');
        amount = wordlist.length;
    } else {
        shuffle(wordlist);
        amount = 10;
    }
    for (var i=0; i<amount; i++) {
        wordTag = document.createElement('word');
        for (let x=0; x<wordlist[i].length; x++) {
            letterTag = document.createElement('letter');
            letterTag.style.borderLeft = "0.1px solid transparent";
            letter = document.createTextNode(wordlist[i][x]);
            letterTag.appendChild(letter);
            wordTag.appendChild(letterTag);
            obj.lettercount += 1;
        }
        textdisplay.appendChild(wordTag);
        letterTag = document.createElement('letter');
        letterTag.style.borderLeft = "0.1px solid transparent";
        letter = document.createTextNode(' ');
        letterTag.appendChild(letter);
        textdisplay.appendChild(letterTag);
        obj.lettercount += 1; // space
        obj.wordcount += 1;
    }
    startFlash();
    document.getElementById('typing-input').setAttribute("maxlength", obj.lettercount-1);
    obj.mistakeIdx = obj.lettercount;
    obj.letters = document.querySelectorAll('letter');
}

function setPreviousOffset(letter) {
    if (letter != undefined) {
        obj.previousOffset = letter.offsetTop;
    }
}

function checkOffset() {
    let letter;

    letter = obj.letters[obj.selectionEnd];

    if (!(offsetList.includes(letter.offsetTop))) {
        offsetList.push(letter.offsetTop)
    }
    offsetIdx = offsetList.indexOf(letter.offsetTop);
    previousOffsetIdx = offsetList.indexOf(obj.previousOffset);

    if (previousOffsetIdx == -1) {
        previousOffsetIdx = 0;
    }

    if (offsetIdx < previousOffsetIdx) {
        let difference = previousOffsetIdx - offsetIdx;
        style.top -= 3*difference;
        pixel_per_em = Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
        scrollBy(0, -3*pixel_per_em*difference);
    } else if (offsetIdx > previousOffsetIdx) {
        let difference = offsetIdx - previousOffsetIdx;
        style.top += 3*difference;



        //pixel_per_em = Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
        //scrollBy(0, 3*pixel_per_em*difference);
    }
    obj.previousOffset = letter.offsetTop;
    document.getElementById('typing-input').style.top = style.top + 'em';
}

window.addEventListener("scroll", (event) => {
    let scroll = this.scrollY;
    if (caret.currentPos <= 1) {
        obj.scrollTop = scroll;
    }
});

function getValue() {
    if (obj.updateInput == true) {
        document.getElementById('typing-input').value = obj.new_input;
        obj.updateInput = false;
    }
    obj.input = document.getElementById('typing-input').value;
    obj.len = obj.input.length;
    addedChars = 0;
    if (obj.highlight == true) {
        removeHighlight();
        addedChars = obj.len - (obj.previousLen - obj.selectedText.length);
    }
    caret.currentPos = document.getElementById('typing-input').selectionStart;
    obj.selectionStart = caret.currentPos;
    obj.selectionEnd = caret.currentPos;
    if (obj.len-addedChars <= obj.mistakeIdx || caret.currentPos < obj.len) {
        obj.mistake = false;
        obj.mistakeIdx = obj.lettercount;
    }
    stopFlash();
    startFlash();
    if (obj.mobile == true) {
        verifyInput(6, obj.len, obj.input);
    } else if (addedChars == 0) {
        if ((obj.len > obj.previousLen) && (obj.len == caret.currentPos)) {
            verifyInput(1, obj.len, obj.input);
        } else if ((obj.len < obj.previousLen) && (obj.len == caret.currentPos)) {
            verifyInput(2, obj.len, obj.input);
        } else if ((obj.len > obj.previousLen) && (obj.len > caret.currentPos)) {
            verifyInput(3, obj.len, obj.input);
        } else if ((obj.len < obj.previousLen) && (obj.len > caret.currentPos)) {
            verifyInput(4, obj.len, obj.input);
        }
    } else {
        verifyInput(5, obj.len, obj.input)
    }
    checkOffset();
    updateCaret();
    caret.previousPos = caret.currentPos;
    obj.previousLen = obj.len;
}

function verifyInput(Case) {
    if (Case == 1) {
        setCounters(obj.input, caret.previousPos);
        previousletter = obj.letters[obj.lettercounter-1];
        nextletter = obj.letters[obj.lettercounter+1];
        word = document.querySelectorAll("word")[obj.wordcounter];
        previousword = document.querySelectorAll("word")[obj.wordcounter-1];
        let start = caret.previousPos;
        let end = obj.len;
        for (let i = start; i < end; i++) {
            let letter = obj.letters[i];
            let typedLetter = obj.input[i];
            if (typedLetter == letter.innerHTML && i <= obj.mistakeIdx) {
                letter.classList.add("correct");
                countCorrectLetters(letter.innerHTML);
                countCorrectBigrams(previousletter, letter.innerHTML);
                countCorrectWords(letter.innerHTML, nextletter.innerHTML, word);
                countCorrectWordpairs(letter.innerHTML, nextletter.innerHTML, previousword, word);
            } else {
                if (letter.innerHTML == " ") {
                    letter.classList.add("space-error");
                } else {
                    letter.classList.add("error");
                }
                if (obj.mistake == false) {
                    addWrongLetter(letter);
                    addWrongBigram(previousletter, letter);
                    addWrongWord(letter, word);
                    addWrongWordpairs(letter, previousword, word);
                    obj.mistakeIdx = obj.lettercounter;
                }
                obj.mistake = true;
            }
            if (letter.innerHTML == ' ') {
                obj.wordcounter++
            }
        
            obj.lettercounter++;
        }
    } else if (Case == 2) {
        let start = caret.currentPos;
        let end = obj.previousLen;

        let letter = obj.letters[start]; 
        if (letter.classList.contains("correct")) {
            times.letters.startTime = startTimer()
        }


        for (let i = start; i < end; i++) {
            let letter = obj.letters[i];
            if (letter.classList.length > 0) {
                letter.classList.remove(...letter.classList);
            }
        }

    } else if (Case == 3) {
        setCounters(obj.input, caret.previousPos);
        let start = caret.previousPos;
        let end = obj.len;
        for (let i = start; i < end; i++) {
            let letter = obj.letters[i];
            let typedLetter = obj.input[i];
            if (typedLetter == letter.innerHTML && i <= obj.mistakeIdx) {
                if (letter.classList.length > 0) {
                    letter.classList.remove(...letter.classList);
                }
                letter.classList.add("correct");
            } else {
                if (letter.innerHTML == " ") {
                    if (letter.classList.length > 0) {
                        letter.classList.remove(...letter.classList);
                    }
                    letter.classList.add("space-error");
                } else {
                    if (letter.classList.length > 0) {
                        letter.classList.remove(...letter.classList);
                    }
                    letter.classList.add("error");
                }
                
                /*
                if (obj.mistake == false && (i < caret.currentPos)) { //only count mistakes on stuff that was added, as opposed to stuff that is wrong as a result of the insertion
                    previousletter = letters[obj.lettercounter-1];
                    word = document.querySelectorAll("word")[obj.wordcounter];
                    previousword = document.querySelectorAll("word")[obj.wordcounter-1];
                    addWrongLetter(letter);
                    addWrongBigram(previousletter, letter);
                    addWrongWord(letter, word);
                    addWrongWordpairs(letter, previousword, word);
                    obj.mistakeIdx = obj.lettercounter;
                }
                obj.mistake = true;

                //Disabling for now because it doesn't work as intended (counts more mistakes after the first one)
                //also it's hard to fix because I can't base the mistake on the position of the caret, because
                //that might change with arrow keys while there's no input changes
                //also hard to define what should be made red if you insert letters while obj.mistake = true
                //only the following letters or every wrong input (that might make it more confusing when trying to fix the wrong letter)
                //so I think overall the best solution is to not count it right now
                */
            }
            if (letter.innerHTML == ' ') {
                obj.wordcounter++
            }
            obj.lettercounter++;
        }
    } else if (Case == 4) {
        let start = caret.currentPos;
        let between = obj.len;
        let end = obj.previousLen;
        for (let i = between; i < end; i++) {
            let letter = obj.letters[i];
            if (letter.classList.length > 0) {
                letter.classList.remove(...letter.classList);
            }
        }
        for (let i = start; i < between; i++) {
            let letter = obj.letters[i];
            let typedLetter = obj.input[i];
            if (typedLetter == letter.innerHTML && i <= obj.mistakeIdx) {
                if (letter.classList.length > 0) {
                    letter.classList.remove(...letter.classList);
                }
                letter.classList.add("correct");
            } else {
                if (letter.innerHTML == " ") {
                    if (letter.classList.length > 0) {
                        letter.classList.remove(...letter.classList);
                    }
                    letter.classList.add("space-error");
                } else {
                    if (letter.classList.length > 0) {
                        letter.classList.remove(...letter.classList);
                    }
                    letter.classList.add("error");
                }
            }
        }
    } else if (Case == 5) {
        let start = caret.previousPos;
        let end = obj.previousLen;
        if (start <= obj.mistakeIdx) {
            obj.mistake = false;
            obj.mistakeIdx = obj.lettercount;
        }
        for (let i = start; i < end; i++) {
            let letter = obj.letters[i];
            if (letter.classList.length > 0) {
                letter.classList.remove(...letter.classList);
            }
        }
        setCounters(obj.input, caret.previousPos);
        start = caret.previousPos;
        end = obj.len;
        for (let i = start; i < end; i++) {
            let letter = obj.letters[i];
            let typedLetter = obj.input[i];
            if (typedLetter == letter.innerHTML && i <= obj.mistakeIdx) {
                letter.classList.add("correct");
            } else {
                if (letter.innerHTML == " ") {
                    letter.classList.add("space-error");
                } else {
                    letter.classList.add("error");
                }
                if (obj.mistake == false && (i < caret.currentPos)) {
                    previousletter = obj.letters[obj.lettercounter-1];
                    word = document.querySelectorAll("word")[obj.wordcounter];
                    previousword = document.querySelectorAll("word")[obj.wordcounter-1];
                    addWrongLetter(letter);
                    addWrongBigram(previousletter, letter);
                    addWrongWord(letter, word);
                    addWrongWordpairs(letter, previousword, word);
                    obj.mistakeIdx = obj.lettercounter;
                }
                obj.mistake = true;
            }
            if (letter.innerHTML == ' ') {
                obj.wordcounter++
            }
            obj.lettercounter++;
        }
    } else if (Case == 6) {
        obj.lettercounter = 0;
        obj.wordcounter = 0;
        let start = 0;
        //let end = obj.previousLen;
        let end = obj.lettercount;
        for (let i = start; i < end; i++) {
            let letter = obj.letters[i];
            if (letter.classList.length > 0) {
                letter.classList.remove(...letter.classList);
            }
        }
        start = 0;
        //end = obj.len;
        end = obj.len;
        for (let i = start; i < end; i++) {
            let letter = obj.letters[i];
            let typedLetter = obj.input[i];
            if (typedLetter == letter.innerHTML /*&& i <= obj.mistakeIdx*/) {
                letter.classList.add("correct");
            } else {
                if (letter.innerHTML == " ") {
                    letter.classList.add("space-error");
                } else {
                    letter.classList.add("error");
                }
                
                if (obj.mistake == false) {
                    previousletter = obj.letters[obj.lettercounter-1];
                    word = document.querySelectorAll("word")[obj.wordcounter];
                    previousword = document.querySelectorAll("word")[obj.wordcounter-1];
                    addWrongLetter(letter);
                    addWrongBigram(previousletter, letter);
                    addWrongWord(letter, word);
                    addWrongWordpairs(letter, previousword, word);
                    obj.mistakeIdx = obj.lettercounter;
                }
                obj.mistake = true;
                
            }
            if (letter.innerHTML == ' ') {
                obj.wordcounter++
            }
            obj.lettercounter++;
        }
    }
}

function countCorrectLetters(letter) {
    if (obj.lettercounter > 0) {
        times.letters.endTime = stopTimer()
        calculateTimes(times.letters.startTime, times.letters.endTime, "letters", letter)
    }
    times.letters.startTime = startTimer()
    if (stats.correct.letters[letter]) {
        stats.correct.letters[letter] += 1
    } else {
        stats.correct.letters[letter] = 1
    }
}

//NOTE: first ngram is omitted in WPM calculation to make it more accurate, but it's not omitted in "correct words" counter
//but "correct words" counter is used for WPM calculation which leads to WPM calculation being inaccurate again.
//This could be fixed by omitting the first word for "correct words" counter too, just like in WPM calculation.
function countCorrectBigrams(previousLetter, currentLetter) {
    if (obj.lettercounter == 0) {
        times.bigrams.cooldown = 0;
    }
    if (obj.lettercounter > 0) {
        let bigram = previousLetter.innerHTML + currentLetter

        if (times.bigrams.cooldown == 0) {
            times.bigrams.startTime1 = startTimer();
            times.bigrams.cooldown = 3;
            if (obj.lettercounter > 3) {
                times.bigrams.endTime2 = stopTimer();
                calculateTimes(times.bigrams.startTime2, times.bigrams.endTime2, "bigrams", bigram)
            }
        }
        if (times.bigrams.cooldown == 1) {
            times.bigrams.startTime3 = startTimer();
            times.bigrams.endTime1 = stopTimer();
            calculateTimes(times.bigrams.startTime1, times.bigrams.endTime1, "bigrams", bigram)
        }
        if (times.bigrams.cooldown == 2) {
            times.bigrams.startTime2 = startTimer();
            if (obj.lettercounter > 4) {
                times.bigrams.endTime3 = stopTimer();
                calculateTimes(times.bigrams.startTime3, times.bigrams.endTime3, "bigrams", bigram)
            }
        }

        times.bigrams.cooldown--;

        if (obj.lettercounter > 1) {
            if (stats.correct.bigrams[bigram]) {
                stats.correct.bigrams[bigram] += 1
            } else {
                stats.correct.bigrams[bigram] = 1
            }
        }
    }
}

function countCorrectWords(letter, nextLetter, currentWordTag) {
    if (obj.lettercounter > 0) { //to not get error with previousLetter
        if (nextLetter == ' ') {
            let word = "";
            for (letterTag of currentWordTag.childNodes) {
                word += letterTag.innerHTML;
            }
    
            if (obj.wordcounter > 0) {
                console.log('end');
                times.words.endTime = stopTimer();
                calculateTimes(times.words.startTime, times.words.endTime, "words", word)
            }
    
            if (stats.correct.words[word]) {
                stats.correct.words[word] += 1;
            } else {
                stats.correct.words[word] = 1;
            }
        } else if (letter == ' ') {
            console.log('start')
            times.words.startTime = startTimer();
        } 
    }
}

function countCorrectWordpairs(letter, nextLetter, previousWordTag, currentWordTag) {
    //start it if the previous is a space / stop it if the next one is a space
    if (obj.wordcounter == 0) {
        times.wordpairs.cooldown = 0;
    }
    if ((obj.wordcounter > 0 && nextLetter == ' ') || (letter == ' ' && obj.wordcounter < obj.wordcount)) {
        
        if (obj.wordcounter > 1 && nextLetter == ' ') {
            let previousWord = "";
            let currentWord = "";
            for (letterTag of currentWordTag.childNodes) {
                currentWord += letterTag.innerHTML;
            }
            for (letterTag of previousWordTag.childNodes) {
                previousWord += letterTag.innerHTML;
            }
            wordpair = previousWord + ' ' + currentWord
        }

        if (nextLetter == ' ') {
            if (times.wordpairs.cooldown == 1) {
                times.wordpairs.endTime1 = stopTimer();
                calculateTimes(times.wordpairs.startTime1, times.wordpairs.endTime1, "wordpairs", wordpair)
            } else if (times.wordpairs.cooldown == 3) {
                if (obj.wordcounter > 2) {
                    times.wordpairs.endTime2 = stopTimer();
                    calculateTimes(times.wordpairs.startTime2, times.wordpairs.endTime2, "wordpairs", wordpair)
                }
            }
        } else if (letter == ' ') {
            if (times.wordpairs.cooldown == 0) {
                times.wordpairs.startTime1 = startTimer();
                times.wordpairs.cooldown = 4;
            } else if (times.wordpairs.cooldown == 2) {
                times.wordpairs.startTime2 = startTimer();
            }
        }
        times.wordpairs.cooldown--;


        if (obj.wordcounter > 1 && nextLetter == ' ') {
            if (stats.correct.wordpairs[wordpair]) {
                stats.correct.wordpairs[wordpair] += 1;
            } else {
                stats.correct.wordpairs[wordpair] = 1;
            }
        }
    }
}

function startTimer() {
    let d = new Date();
    startTime = d.getTime();
    return startTime;
}

function stopTimer() {
    let d = new Date();
    endTime = d.getTime();
    return endTime;
}

function calculateTimes(startTime, endTime, item, ngram) {
    totalTime = ( ( endTime - startTime ) / 1000 );

    if (stats.time[item][ngram]) {
        stats.time[item][ngram] += totalTime
    } else {
        stats.time[item][ngram] = totalTime
    }
}

function setCounters(input, previousCaretPos) {
    previousInput = input.slice(0, previousCaretPos)
    obj.lettercounter = previousInput.length;
    obj.wordcounter = (previousInput.match(/ /g) || []).length;
}

function stopFlash() {
    if (document.getElementById('caret') != null) {
        document.getElementById('caret').removeAttribute('id');
    }
}

function startFlash() {
    let letter = obj.letters[caret.currentPos];
    if (letter) {
        letter.setAttribute("id", "caret");
    }
}

function addHighlight() {
    stopFlash();
    obj.highlight = false;
    for (let i = obj.selectionStart; i < obj.selectionEnd; i++) {
        obj.letters[i].classList.add("highlight");
        obj.highlight = true;
    }  
}

function removeHighlight() {
    if (obj.highlight == false) {
        return;
    }

    for (let i = 0; i < obj.lettercount; i++) {
        if (obj.letters[i].classList.contains("highlight")) {
            obj.letters[i].classList.remove("highlight");
        }
    }
    obj.highlight = false;
}

function updateCaret() { //note that due to the change of the textdisplay having a space at the end, there is no need for border right anymore
    //also note that due to the max-obj.length attribute of the input field, there is also no need to check for when to stop (it's impossible to go over the limit)
    let letter = obj.letters[caret.currentPos];
    let previous = obj.letters[caret.previousPos]; //note: replace currentPos+1 with caret.previousPos
    if (previous) {
        previous.style.borderLeft = "0.1px solid transparent";
    }
    if (letter) { //letter = letter to the right of the caret
        letter.style.borderLeft = "0.1px solid " + style.caretColor;
    }
}

function focusInput() {
    document.getElementById('typing-input').focus();
    document.getElementById('typing-input').value = "";
    document.getElementById('typing-input').value = obj.input;
    adjustCaret('', caret.previousPos, caret.currentPos);
    checkOffset();
    updateCaret();
}

function blurInput() {
    document.getElementById('typing-input').blur();
}

function refresh() {
    blurInput();
    reset();
    loadWords();
    focusInput();
    resetScroll();
    if ('caches' in window) {
        caches.open('new-cache').then(function (cache) {
            for (item in stats) {
                cache.put(item + '.json', new Response(JSON.stringify(stats[item])))
            }
        })
    }
    displayStats()
    updateStatus()
}

function resetScroll() {
    style.top = 25;
    document.getElementById('typing-input').style.top = style.top + 'em';
    window.scrollTo(0, obj.scrollTop)
}

function reset() {
    obj.lettercounter = 0;
    obj.lettercount = 0;
    obj.wordcounter = 0;
    obj.wordcount = 0;
    obj.mistake = false;
    obj.mistakeIdx = -1;
    obj.previousOffset = -1;
    obj.previousLen = 0;
    caret.currentPos = 0;
    caret.previousPos = 0;
    obj.selectionStart = 0;
    obj.selectionEnd = 0;
    obj.scrolldowncounter = 0;
    obj.scrollupcounter = 0;
    offsetList = [];
    document.getElementById('typing-input').value = "";
    obj.input = "";
    obj.len = 0;
}

function displayStats() {
    if (toggles.statsDisplay == 'errors') {
        let i = 1;
        for (item in stats.wrong) {
            var sortable = [];
            for (ngram in stats.wrong[item]) {
                let correct;

                if (stats.correct[item][ngram]) {
                    correct = stats.correct[item][ngram];
                } else {
                    correct = 0;
                }

                if (correct < toggles.minAmount) {
                    continue
                }

                var displayNgram = ngram;
                if (i == 2 && ngram.includes(" ")) {
                displayNgram = ngram.replace(" ", "⎵");
                }
                sortable.push([displayNgram, stats.wrong[item][ngram]])
            }

            if (toggles.sorting == "ascending") {
                sortable.sort(function(a, b) {return a[1] - b[1]})
            } else if (toggles.sorting == "descending") {
                sortable.sort(function(a, b) {return b[1] - a[1]})
            }

            for (let i = 0; i < sortable.length; i++) {
                sortable[i] = sortable[i][0] + ' ' + sortable[i][1];
            }

            document.getElementById("analysis-" + i).innerHTML = item + '<br><br>' + sortable.join('<br>');
            i++
        }
    } else if (toggles.statsDisplay == 'accuracy') {
        let i = 1;
        let accuracy = {
            letters: {},
            bigrams: {},
            words: {},
            wordpairs: {}
        }; //item : correctly typed / incorrectly typed + correctly typed
        for (item in stats.wrong) {
            for (ngram in stats.wrong[item]) {
                let incorrect = stats.wrong[item][ngram] //incorrect = how many mistakes on ngram
                let correct;
                if (stats.correct[item][ngram]) {
                    correct = stats.correct[item][ngram] //correct = how many correct times that ngram was typed
                } else {
                    correct = 0 //correct = how many correct times that ngram was typed
                }

                if (correct < toggles.minAmount) {
                    continue
                }

                let acc = ( ( correct / (incorrect + correct) ) * 100 )

                if (acc >= 99.5) {
                    acc = acc.toFixed(2);
                } else {
                    acc = acc.toFixed(0);
                }

                accuracy[item][ngram] = acc;
            }
        }
        for (item in accuracy) {
            var sortable = [];
            for (ngram in accuracy[item]) {
                var displayNgram = ngram;
                if ((i == 2 || i == 1) && ngram.includes(" ")) {
                displayNgram = ngram.replace(" ", "⎵");
                }
                sortable.push([displayNgram, accuracy[item][ngram]])
            }

            if (toggles.sorting == "ascending") {
                sortable.sort(function(a, b) {return a[1] - b[1]})
            } else if (toggles.sorting == "descending") {
                sortable.sort(function(a, b) {return b[1] - a[1]})
            }

            for (let i = 0; i < sortable.length; i++) {
                sortable[i] = sortable[i][0] + ' ' + sortable[i][1] + '%';
            }

            document.getElementById("analysis-" + i).innerHTML = item + '<br><br>' + sortable.join('<br>');
            i++
        }
    } else if (toggles.statsDisplay == 'speed') {
        let i = 1;
        let speed = {
            letters: {},
            bigrams: {},
            words: {},
            wordpairs: {}
        };
        for (item in stats.time) {
            for (ngram in stats.time[item]) {

                if (stats.correct[item][ngram] < toggles.minAmount) {
                    continue
                }
                
                let words = ( stats.correct[item][ngram] * ngram.length ) / 5;
                let minutes = stats.time[item][ngram] / 60
                wpm = words / minutes
                wpm = wpm.toFixed(0);
                speed[item][ngram] = parseInt(wpm);
            }
        }
        for (item in speed) {
            var sortable = []
            for (ngram in speed[item]) {
                var displayNgram = ngram;
                if ((i == 2 || i == 1) && ngram.includes(" ")) {
                displayNgram = ngram.replace(" ", "⎵");
                }
                sortable.push([displayNgram, speed[item][ngram]])
            }

            if (toggles.sorting == "ascending") {
                sortable.sort(function(a, b) {return a[1] - b[1]})
            } else if (toggles.sorting == "descending") {
                sortable.sort(function(a, b) {return b[1] - a[1]})
            }

            for (let i = 0; i < sortable.length; i++) {
                sortable[i] = sortable[i][0] + ' ' + sortable[i][1] + 'WPM';
            }


            document.getElementById("analysis-" + i).innerHTML = item + '<br><br>' + sortable.join('<br>');
            i++;
        }
    }
}

function updateStatus() {
    let status = "No Data Found!";
    for (let item in stats) {
        if (Object.keys(stats[item])) {
            status = "";
        }
    }
    document.getElementById('statsstatus').innerHTML = status;
}

function clearStats() {
    response = confirm('Are you sure you want to clear/reset all your stats?')
    if (response == false) {
        return;
    }
    if ('caches' in window) {
        caches.open('new-cache').then(function(cache) {
            for (item in stats) {
                cache.delete(item + '.json');
            }
        })
    }
    for (item in stats) {
        for (ngram in stats[item]) {
            stats[item][ngram] = {};
        }
    }

    for (let i = 1; i <= 4; i++) {
        document.getElementById("analysis-" + i).innerHTML = "";
    }
    focusInput();
    updateStatus();
}

function hideStats() { //toggle stats visibility

    if (hide == false) {
        document.getElementById('analysis-container').style.display = "none";
        document.getElementById('statsstatus').style.display = "none";
        document.getElementById('hidestatsbutton').value = "show stats";
        hide = true;
    } else {
        document.getElementById('analysis-container').style.display = "block";
        document.getElementById('statsstatus').style.display = "block";
        document.getElementById('hidestatsbutton').value = "hide stats";
        hide = false;
    }
    focusInput();
}

function addWrongLetter(letter) {
    letter = letter.innerHTML;
    if (stats.wrong.letters[letter]) {
        stats.wrong.letters[letter] += 1;
    } else {
        stats.wrong.letters[letter] = 1;
    }
}
function addWrongBigram(previousletter, current) {
    if (obj.lettercounter > 0) {
        var bigram = previousletter.innerHTML + current.innerHTML;
        if (stats.wrong.bigrams[bigram]) {
            stats.wrong.bigrams[bigram] += 1;
        } else {
            stats.wrong.bigrams[bigram] = 1;
        }
    }
}
function addWrongWord(letter, wordTag) {
    if (letter.innerHTML == ' ') {
        return;
    }
    var word = "";
    for (letterTag of wordTag.childNodes) {
        word += letterTag.innerHTML;
    }
    if (stats.wrong.words[word]) {
        stats.wrong.words[word] += 1;
    } else {
        stats.wrong.words[word] = 1;
    }
}
function addWrongWordpairs(letter, previouswordTag, wordTag) {
    if (obj.wordcounter == 0 || letter.innerHTML == ' ') {
        return;
    }
    var previous = "";
    var word = "";
    for (letterTag of previouswordTag.childNodes) {
        previous += letterTag.innerHTML;
    }
    for (letterTag of wordTag.childNodes) {
        word += letterTag.innerHTML;
    }

    wordpair = previous + ' ' + word;
    
    if (stats.wrong.wordpairs[wordpair]) {
        stats.wrong.wordpairs[wordpair] += 1;
    } else {
        stats.wrong.wordpairs[wordpair] = 1;
    }
}