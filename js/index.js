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
    selectionEnd: 1,
    selectionMiddle: 0,
    new_input: '',
    updateInput: false
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

console.log(style.background);


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

document.documentElement.style.setProperty('--your-variable', '#YOURCOLOR');


function keydown(e) {
    let keyCode = e.which || e.keyCode;
    if (keyCode == 13) {
        refresh();
    }
    
    if (keyCode == 8 && states.ctrl && obj.highlight && isFirefox) { //make it so ctrl + backspace on highlight acts like normal backspace
        input = document.getElementById('typing-input').value;
        len = input.length;
        obj.new_input = input.slice(0, obj.selectionStart) + input.slice(obj.selectionEnd, len); //good
        caret.currentPos = obj.selectionStart;
        if (caret.currentPos > 0) {
            obj.updateInput = true;
        } else {
            obj.updateInput = true;
            getValue();
            return; //stuff below already happens in getValue() function
        }
        removeHighlight();
        flash.caretChange = true;
        stopFlash();
        startFlash();
        flash.caretChange = false;
        checkOffset();
        updateCaret();
        caret.previousPos = caret.currentPos;
    }
    switch(keyCode) {
        case 16:
            if (states.shift == false) {
                //console.log('holding shift');
                states.shift = true;
            }
            break;
        case 17:
            if (states.ctrl == false) {
                //console.log('holding control');
                states.ctrl = true;
            }
            break;
        case 35:
            if (states.ctrl == true && states.shift == true) {
                console.log('ctrl + shift + end')
                input = document.getElementById('typing-input').value;
                let len = input.length;
                if (obj.highlight == false) {
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) { //left to middle, handle cross overs here
                    obj.selectionStart = obj.selectionEnd;
                    caret.currentPos = obj.selectionStart;
                }
                obj.selectionEnd = len;
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                //console.log(obj.selectionStart + ' ' + obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else if (states.shift == true) {
                console.log('shift + end');
                letters = document.querySelectorAll("letter");
                input = document.getElementById('typing-input').value;
                let len = input.length;
                console.log(obj.highlight);
                if (obj.highlight == false) {
                    obj.selectionStart = caret.currentPos;
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart;
                    for (i = caret.currentPos; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                        obj.selectionEnd++;
                    }
                } else if (obj.highlight == true) {
                    if (obj.selectionMiddle == obj.selectionStart) {
                        for (i = obj.selectionEnd; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                            obj.selectionEnd++;
                        }
                    } else if (obj.selectionMiddle == obj.selectionEnd) {
                        obj.selectionStart = obj.selectionEnd;
                        caret.currentPos = obj.selectionStart;
                        for (i = obj.selectionEnd; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                            obj.selectionEnd++;
                        }
                    }
                    //bla bla bla (this is gonna be more difficult)
                    removeHighlight();
                }
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                //console.log(obj.selectionStart + ' ' + obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                input_box = document.getElementById('typing-input');
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else if (states.ctrl == true) {
                console.log('ctrl + end')
                input = document.getElementById('typing-input').value;
                len = input.length;
                caret.currentPos = len;
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else {
                console.log('end');
                letters = document.querySelectorAll("letter");
                input = document.getElementById('typing-input').value;
                let len = input.length;
                if (obj.highlight == false) {
                    for (i = caret.currentPos; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                        caret.currentPos++;
                    }
                } else {
                    if (obj.selectionMiddle == obj.selectionStart) {
                        caret.currentPos = obj.selectionEnd;
                        for (i = caret.currentPos; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                            caret.currentPos++;
                        }
                    } else if (obj.selectionMiddle = obj.selectionEnd) {
                        caret.currentpos = obj.selectionStart;
                        for (i = caret.currentPos; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                            caret.currentPos++;
                        }
                    }
                    //bla bla bla (this is gonna be more difficult)
                    removeHighlight();
                }
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                if (caret.previousPos > 0) {
                    e.preventDefault();
                    setCaretPosition("typing-input", caret.currentPos);
                } else {
                    console.log('test');
                    input = document.getElementById('typing-input').value
                    document.getElementById('typing-input').value = ' ' + input;
                    e.preventDefault();
                    setCaretPosition("typing-input", caret.currentPos);
                    document.getElementById('typing-input').value = input;
                    setCaretPosition("typing-input", caret.currentPos);
                }
                caret.previousPos = caret.currentPos;

            }
            break;
        case 36:
            if (states.ctrl == true && states.shift == true) {
                console.log('ctrl + shift + home');
                if (obj.highlight == false) {
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd;
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) {  //handle cross overs here
                    obj.selectionEnd = obj.selectionStart;                  
                }
                caret.currentPos = 0;
                obj.selectionStart = caret.currentPos 
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                //console.log(obj.selectionStart + ' ' + obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else if (states.shift == true) {
                console.log('shift + home')
                letters = document.querySelectorAll("letter");
                input = document.getElementById('typing-input').value;
                let len = input.length;
                if (obj.highlight == false) {
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd;
                    for (i = caret.currentPos; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                        obj.selectionStart--;
                        caret.currentPos--;
                    }
                } else {
                    if (obj.selectionMiddle == obj.selectionStart) {//wfhen it's highlighted and you do it again it's not supposed to remove the highlight
                        obj.selectionEnd = obj.selectionStart;
                        for (i = obj.selectionStart; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                            obj.selectionStart--;
                        }
                    } else if (obj.selectionMiddle = obj.selectionEnd) {
                        for (i = obj.selectionStart; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                            obj.selectionStart--;
                        }
                    }
                    removeHighlight();
                    //bla bla bla (this is gonna be more difficult)
                }
                console.log(caret.currentPos)
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                //console.log(obj.selectionStart + ' ' + obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                input_box = document.getElementById('typing-input');
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else if (states.ctrl == true) {
                console.log('ctrl + home');
                caret.currentPos = 0;
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else {
                console.log('home'); //current problem: input box doesn't change caret position the same as my test, since my test is multiline and the input box is 1 line.
                letters = document.querySelectorAll("letter");
                if (obj.highlight == false) {
                    for (i = caret.currentPos; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                        caret.currentPos--;
                    }
                } else {
                    if (obj.selectionMiddle == obj.selectionStart) {
                        caret.currentPos = obj.selectionEnd;
                        for (i = caret.currentPos; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                            caret.currentPos--;
                        }
                    } else if (obj.selectionMiddle = obj.selectionEnd) {
                        caret.currentpos = obj.selectionStart;
                        for (i = caret.currentPos; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                            caret.currentPos--;
                        }
                    }
                    //bla bla bla (this is gonna be more difficult)
                    removeHighlight();
                }
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                adjustCaret(e, caret.currentPos, caret.previousPos);
                //e.preventDefault();
                //setCaretPosition("typing-input", caret.currentPos);
                caret.previousPos = caret.currentPos;
            }
            break;
        case 37:
            if (states.ctrl == true && states.shift == true) {
                console.log('ctrl + shift + left');
                if (obj.highlight == false) {
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd
                    if (caret.currentPos > 0) {
                        let previousLetter = document.querySelectorAll("letter")[caret.currentPos-1];
                        if (previousLetter.innerHTML == ' ') {
                            caret.currentPos -= 1;
                            previousLetter = document.querySelectorAll("letter")[caret.currentPos-1];
                        }
                        while (previousLetter.innerHTML != ' ' && caret.currentPos >= 1) {
                            caret.currentPos -= 1;
                            if (caret.currentPos > 0) {
                                previousLetter = document.querySelectorAll("letter")[caret.currentPos-1]
                            }
                        }
                    }
                    obj.selectionStart = caret.currentPos;
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) {
                    if (caret.currentPos > 0) {
                        let previousLetter = document.querySelectorAll("letter")[caret.currentPos-1];
                        if (previousLetter.innerHTML == ' ') {
                            caret.currentPos -= 1;
                            previousLetter = document.querySelectorAll("letter")[caret.currentPos-1];
                        }
                        while (previousLetter.innerHTML != ' ' && caret.currentPos >= 1) {
                            caret.currentPos -= 1;
                            if (caret.currentPos > 0) {
                                previousLetter = document.querySelectorAll("letter")[caret.currentPos-1]
                            }
                        }
                    }
                    obj.selectionStart = caret.currentPos;
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) {  //handle cross overs here
                    let previousLetter = document.querySelectorAll("letter")[obj.selectionEnd-1];
                    if (previousLetter.innerHTML == ' ') {
                        obj.selectionEnd -= 1;
                        previousLetter = document.querySelectorAll("letter")[obj.selectionEnd-1];
                    }
                    while (previousLetter.innerHTML != ' ' && obj.selectionEnd >= 1) {
                        obj.selectionEnd -= 1;
                        if (obj.selectionEnd > 0) {
                            previousLetter = document.querySelectorAll("letter")[obj.selectionEnd-1]
                        }
                    }
                    if (obj.selectionStart > obj.selectionEnd) {
                        let temp = obj.selectionStart;
                        obj.selectionStart = obj.selectionEnd;
                        obj.selectionEnd = temp;     
                    }
                }
                caret.currentPos = obj.selectionStart;
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                //console.log(obj.selectionStart + ' ' + obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                input_box = document.getElementById('typing-input');
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                //adjustCaret(e, caret.currentPos, caret.previousPos);
                caret.previousPos = caret.currentPos;
            } else if (states.shift == true) {
                console.log('shift + left');
                input = document.getElementById('typing-input').value;
                //caret.currentPos = document.getElementById('typing-input').selectionStart-1;
                if (obj.highlight == false && caret.currentPos-1 >= 0) {
                    caret.currentPos -= 1;
                    obj.selectionStart = caret.currentPos;
                    obj.selectionEnd = caret.currentPos + 1;
                    obj.selectionMiddle = caret.currentPos + 1;
                    //obj.selectionEnd = caret.previousPos;
                    //obj.selectionStart = caret.currentPos;
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) { //right to middle
                    //obj.selectionStart = caret.currentPos;
                    obj.selectionEnd -= 1;
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle && obj.selectionStart-1 >= 0) { //middle to left
                    caret.currentPos -= 1;
                    obj.selectionStart -= 1;
                    //obj.selectionEnd = caret.currentPos;
                }

            

                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else if (states.ctrl == true) {
                console.log('ctrl + left')
                if (caret.currentPos > 0) {
                    let previousLetter = document.querySelectorAll("letter")[caret.currentPos-1];
                    if (previousLetter.innerHTML == ' ') {
                        caret.currentPos -= 1;
                        previousLetter = document.querySelectorAll("letter")[caret.currentPos-1];
                    }
                    while (previousLetter.innerHTML != ' ' && caret.currentPos >= 1) {
                        caret.currentPos -= 1;
                        if (caret.currentPos > 0) {
                            previousLetter = document.querySelectorAll("letter")[caret.currentPos-1]
                        }
                    }
                }
                if (isFirefox == true && obj.highlight == true) {
                    caret.currentPos = obj.selectionStart;
                }
                if (obj.highlight == true) {
                    removeHighlight();
                    obj.selectionStart = 0;
                    obj.selectionEnd = 0;
                }
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                adjustCaret(e, caret.currentPos, caret.previousPos)
                caret.previousPos = caret.currentPos;
            } else {
                console.log('left');
                if (obj.highlight == true) {
                    caret.currentPos = obj.selectionStart;
                    removeHighlight();
                    obj.selectionStart = 0;
                    obj.selectionEnd = 0;
                } else if (caret.currentPos-1 >= 0) {
                    caret.currentPos -= 1;
                }
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            }
            break;
        case 38:
            if (states.ctrl == true && states.shift == true) {
                console.log('ctrl + shift + up')
                if (obj.highlight == false) {
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd;
                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) {  //handle cross overs here
                    obj.selectionEnd = obj.selectionStart;                  
                }
                caret.currentPos = 0;
                obj.selectionStart = caret.currentPos 
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                //console.log(obj.selectionStart + ' ' + obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else if (states.shift == true) {
                console.log('shift + up')
                e.preventDefault();
                //first go to the right until you detect a offsetTop change (same as End)
                //then on the new line check each offsetLeft, and as soon as offsetLeftCurrent - offsetLeftOriginal >= 0, place the caret there
                //then set a new offsetLeftOriginal
                input = document.getElementById('typing-input').value;
                len = input.length;
                letters = document.querySelectorAll("letter");
                if (obj.highlight == false) { //middle
                    obj.selectionEnd = caret.currentPos;
                    obj.selectionMiddle = obj.selectionEnd;

                    let offsetLeftOriginal = letters[caret.currentPos].offsetLeft;
                    console.log(caret.currentPos);
                    for (i = caret.currentPos; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {   
                        caret.currentPos--; //after this caret.currentPos is either at len or at the end of line
                    }
                    console.log(caret.currentPos);//if it's at len we can't increase it
                    let differences = {};
                    if (caret.currentPos -1 >= 0) {
                        let j = caret.currentPos-1;
                        differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                        for (i = caret.currentPos-1; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                            j--
                            differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal);
                            //we need the last one to be len or the last character of the line, depending on what is longer
                            //but we can't check letters[i + 1] if i is len
                        } 
                    }
                    if (!(Object.keys(differences).length === 0 && obj.constructor === Object)) { //if object not empty
                        console.log('exe');
                        keys = Object.keys(differences);
                        let min = keys[0];
                        console.log(typeof min)
                        for (k in differences) {
                            if (differences[k] < differences[min]) {
                                min = k
                            }
                        }
                        caret.currentPos = parseInt(min);
                    }

                    obj.selectionStart = caret.currentPos;

                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) { //right to middle

                    let offsetLeftOriginal = letters[obj.selectionEnd].offsetLeft;
                    console.log(caret.currentPos);
                    for (i = obj.selectionEnd; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {   
                        obj.selectionEnd--; //after this caret.currentPos is either at len or at the end of line
                    }
                    let differences = {};
                    if (obj.selectionEnd -1 >= 0) {
                        let j = obj.selectionEnd-1;
                        differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                        for (i = obj.selectionEnd-1; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                            j--
                            differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal);
                            //we need the last one to be len or the last character of the line, depending on what is longer
                            //but we can't check letters[i + 1] if i is len
                        } 
                    }
                    if (!(Object.keys(differences).length === 0 && obj.constructor === Object)) { //if object not empty
                        console.log('exe');
                        keys = Object.keys(differences);
                        let min = keys[0];
                        console.log(typeof min)
                        for (k in differences) {
                            if (differences[k] < differences[min]) {
                                min = k
                            }
                        }
                        obj.selectionEnd = parseInt(min);
                    }
                    if (obj.selectionEnd < obj.selectionStart) {
                        temp = obj.selectionStart;
                        obj.selectionStart = obj.selectionEnd;
                        obj.selectionEnd = temp;
                        obj.selectionMiddle = obj.selectionEnd;
                    }
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) {//middle to left
                    let offsetLeftOriginal = letters[caret.currentPos].offsetLeft;
                    console.log(caret.currentPos);
                    for (i = caret.currentPos; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {   
                        caret.currentPos--; //after this caret.currentPos is either at len or at the end of line
                    }
                    console.log(caret.currentPos);//if it's at len we can't increase it
                    let differences = {};
                    if (caret.currentPos -1 >= 0) {
                        let j = caret.currentPos-1;
                        differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                        for (i = caret.currentPos-1; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                            j--
                            differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal);
                            //we need the last one to be len or the last character of the line, depending on what is longer
                            //but we can't check letters[i + 1] if i is len
                        } 
                    }
                    if (!(Object.keys(differences).length === 0 && obj.constructor === Object)) { //if object not empty
                        console.log('exe');
                        keys = Object.keys(differences);
                        let min = keys[0];
                        console.log(typeof min)
                        for (k in differences) {
                            if (differences[k] < differences[min]) {
                                min = k
                            }
                        }
                        caret.currentPos = parseInt(min);
                    }
                    obj.selectionStart = caret.currentPos;
                }
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                //console.log(obj.selectionStart + ' ' + obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                input_box = document.getElementById('typing-input');
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
                flash.caretChange = true;
                
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else if (states.ctrl == true) {
                console.log('ctrl + up')
                caret.currentPos = 0;
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else {
                console.log('up');
                e.preventDefault();
                input = document.getElementById('typing-input').value;
                len = input.length;
                letters = document.querySelectorAll("letter");
                let offsetLeftOriginal = letters[caret.currentPos].offsetLeft;
                console.log(caret.currentPos);
                for (i = caret.currentPos; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {   
                    caret.currentPos--; //after this caret.currentPos is either at len or at the end of line
                }
                console.log(caret.currentPos);//if it's at len we can't increase it
                let differences = {};
                if (caret.currentPos -1 >= 0) {
                    let j = caret.currentPos-1;
                    differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                    for (i = caret.currentPos-1; i > 0 && letters[i].offsetTop == letters[i-1].offsetTop; i--) {
                        j--
                        differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal);
                        //we need the last one to be len or the last character of the line, depending on what is longer
                        //but we can't check letters[i + 1] if i is len
                    } 
                }
                if (!(Object.keys(differences).length === 0 && obj.constructor === Object)) { //if object not empty
                    console.log('exe');
                    keys = Object.keys(differences);
                    let min = keys[0];
                    console.log(typeof min)
                    for (k in differences) {
                        if (differences[k] < differences[min]) {
                            min = k
                        }
                    }
                    caret.currentPos = parseInt(min);
                }
                flash.caretChange = true;
                console.log(caret.currentPos);
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                adjustCaret(e, caret.currentPos, caret.previousPos);
                caret.previousPos = caret.currentPos;
            }
            break;
        case 39:
            if (states.ctrl == true && states.shift == true) {
                console.log('ctrl + shift + right');
                input = document.getElementById('typing-input').value;
                let len = input.length;
                if (obj.highlight == false) {
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart
                    obj.selectionEnd = caret.currentPos;
                    if (obj.selectionEnd < len) {
                        let previousLetter = document.querySelectorAll("letter")[obj.selectionEnd-1];
                        if (obj.selectionEnd == 0 || previousLetter.innerHTML == ' ') {
                            obj.selectionEnd += 1;
                            previousLetter = document.querySelectorAll("letter")[obj.selectionEnd-1]
                        }
                        while (obj.selectionEnd < len && previousLetter.innerHTML != ' ') {
                            obj.selectionEnd += 1;
                            previousLetter = document.querySelectorAll("letter")[obj.selectionEnd-1]
                        }
                    }
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) { //left to middle, handle cross overs here
                    if (caret.currentPos < len) {
                        let previousLetter = document.querySelectorAll("letter")[caret.currentPos-1];
                        if (caret.currentPos == 0 || previousLetter.innerHTML == ' ') {
                            caret.currentPos += 1;
                            previousLetter = document.querySelectorAll("letter")[caret.currentPos-1]
                        }
                        while (caret.currentPos < len && previousLetter.innerHTML != ' ') {
                            caret.currentPos += 1;
                            previousLetter = document.querySelectorAll("letter")[caret.currentPos-1]
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
                    if (obj.selectionEnd < len) {
                        let previousLetter = document.querySelectorAll("letter")[obj.selectionEnd-1];
                        if (obj.selectionEnd == 0 || previousLetter.innerHTML == ' ') {
                            obj.selectionEnd += 1;
                            previousLetter = document.querySelectorAll("letter")[obj.selectionEnd-1]
                        }
                        while (obj.selectionEnd < len && previousLetter.innerHTML != ' ') {
                            obj.selectionEnd += 1;
                            previousLetter = document.querySelectorAll("letter")[obj.selectionEnd-1]
                        }
                    }
                }
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                input_box = document.getElementById('typing-input');
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset(obj.selectionEnd);
                updateCaret();
                //adjustCaret(e, caret.currentPos, caret.previousPos); if this was on then it would remove the highlight again
                caret.previousPos = caret.currentPos;
            } else if (states.shift == true) {
                console.log('shift + right');
                input = document.getElementById('typing-input').value;
                let len = input.length;
                if (obj.selectionEnd <= len) {
                    if (obj.highlight == false) { //middle
                        if (caret.currentPos == len) {
                            return;
                        }
                        obj.selectionStart = caret.currentPos;
                        obj.selectionEnd = caret.currentPos + 1;
                        obj.selectionMiddle = caret.currentPos;
                    } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) { //middle+1 to right
                        if (obj.selectionEnd < len) {
                            obj.selectionEnd += 1
                        }
                    } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) {//left to middle-1
                        obj.selectionStart += 1
                        caret.currentPos += 1
                    }
    
                    removeHighlight();
                    obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                    addHighlight(obj.selectedText, "right");
                    flash.caretChange = true;
                    stopFlash();
                    startFlash();
                    flash.caretChange = false;
                    checkOffset(obj.selectionEnd);
                    updateCaret();
                    caret.previousPos = caret.currentPos;
                }
            } else if (states.ctrl == true) {
                console.log('ctrl + right')
                input = document.getElementById('typing-input').value;
                len = input.length;
                if (caret.currentPos < len) {
                    let previousLetter = document.querySelectorAll("letter")[caret.currentPos-1];
                    if (caret.currentPos == 0 || previousLetter.innerHTML == ' ') {
                        caret.currentPos += 1;
                        previousLetter = document.querySelectorAll("letter")[caret.currentPos-1]
                    }
                    while (caret.currentPos < len && previousLetter.innerHTML != ' ') {
                        caret.currentPos += 1;
                        previousLetter = document.querySelectorAll("letter")[caret.currentPos-1]
                    }
                }
                if (isFirefox == true && obj.highlight == true) {
                    caret.currentPos = obj.selectionEnd;
                }
                if (obj.highlight == true) {
                    removeHighlight();
                }
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                adjustCaret(e, caret.currentPos, caret.previousPos)
                caret.previousPos = caret.currentPos;
            } else {
                console.log('right');
                input = document.getElementById('typing-input').value;
                let len = input.length;
                if (obj.highlight == true) {
                    caret.currentPos = obj.selectionEnd;
                    removeHighlight();
                    obj.selectionStart = 0;
                    obj.selectionEnd = 0
                } else if (caret.currentPos+1 <= len) {
                    caret.currentPos += 1
                }
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos; 
            }
            break;
        case 40:
            if (states.ctrl == true && states.shift == true) {
                console.log('ctrl + shift + down'); //same as ctrl + shift + end
                input = document.getElementById('typing-input').value;
                let len = input.length;
                if (obj.highlight == false) {
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) { //left to middle, handle cross overs here
                    obj.selectionStart = obj.selectionEnd;
                    caret.currentPos = obj.selectionStart;
                }
                obj.selectionEnd = len;
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                //console.log(obj.selectionStart + ' ' + obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else if (states.shift == true) {
                console.log('shift + down');
                e.preventDefault();
                //first go to the right until you detect a offsetTop change (same as End)
                //then on the new line check each offsetLeft, and as soon as offsetLeftCurrent - offsetLeftOriginal >= 0, place the caret there
                //then set a new offsetLeftOriginal
                input = document.getElementById('typing-input').value;
                len = input.length;
                letters = document.querySelectorAll("letter");
                if (obj.highlight == false) { //middle
                    obj.selectionStart = caret.currentPos;
                    obj.selectionMiddle = obj.selectionStart;
                    obj.selectionEnd = caret.currentPos;

                    let offsetLeftOriginal = letters[obj.selectionEnd].offsetLeft;
                    for (i = caret.currentPos; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {   
                        obj.selectionEnd++; //after this caret.currentPos is either at len or at the end of line
                    }
                    //if it's at len we can't increase it
                    let differences = {};
                    if (obj.selectionEnd + 1 <= len) {
                        let j = obj.selectionEnd+1;
                        differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                        for (i = obj.selectionEnd+1; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                            j++
                            differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                            //we need the last one to be len or the last character of the line, depending on what is longer
                            //but we can't check letters[i + 1] if i is len
                        } 
                    }
                    if (!(Object.keys(differences).length === 0 && obj.constructor === Object)) { //if object not empty
                        console.log('exe');
                        keys = Object.keys(differences);
                        let min = keys[0];
                        for (k in differences) {
                            if (differences[k] < differences[min]) {
                                min = k
                            }
                        }
                        obj.selectionEnd = parseInt(min);
                    }
                    console.log(obj.selectionEnd);


                } else if (obj.highlight == true && obj.selectionStart == obj.selectionMiddle) { //middle+1 to right
                    let offsetLeftOriginal = letters[obj.selectionEnd].offsetLeft;
                    for (i = obj.selectionEnd; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {   
                        obj.selectionEnd++; //after this caret.currentPos is either at len or at the end of line
                    }
                    //if it's at len we can't increase it
                    let differences = {};
                    if (obj.selectionEnd + 1 <= len) {
                        let j = obj.selectionEnd+1;
                        differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                        for (i = obj.selectionEnd+1; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                            j++
                            differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                            //we need the last one to be len or the last character of the line, depending on what is longer
                            //but we can't check letters[i + 1] if i is len
                        } 
                    }
                    if (!(Object.keys(differences).length === 0 && obj.constructor === Object)) { //if object not empty
                        console.log('exe');
                        keys = Object.keys(differences);
                        let min = keys[0];
                        for (k in differences) {
                            if (differences[k] < differences[min]) {
                                min = k
                            }
                        }
                        obj.selectionEnd = parseInt(min);
                    }
                } else if (obj.highlight == true && obj.selectionEnd == obj.selectionMiddle) {//left to middle-1
                    let offsetLeftOriginal = letters[caret.currentPos].offsetLeft;
                    for (i = caret.currentPos; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {   
                        caret.currentPos++; //after this caret.currentPos is either at len or at the end of line
                    }
                    //if it's at len we can't increase it
                    let differences = {};
                    if (caret.currentPos + 1 <= len) {
                        let j = caret.currentPos+1;
                        differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                        for (i = caret.currentPos+1; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                            j++
                            differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                            //we need the last one to be len or the last character of the line, depending on what is longer
                            //but we can't check letters[i + 1] if i is len
                        } 
                    }
                    if (!(Object.keys(differences).length === 0 && obj.constructor === Object)) { //if object not empty
                        console.log('exe');
                        keys = Object.keys(differences);
                        let min = keys[0];
                        for (k in differences) {
                            if (differences[k] < differences[min]) {
                                min = k
                            }
                        }
                        caret.currentPos = parseInt(min);
                    }
                    obj.selectionStart = caret.currentPos;
                }
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                //console.log(obj.selectionStart + ' ' + obj.selectionEnd);
                addHighlight(obj.selectedText, "left");
                input_box = document.getElementById('typing-input');
                e.preventDefault();
                input_box.setSelectionRange(obj.selectionStart, obj.selectionEnd) //add highlight on input box
                flash.caretChange = true;
                
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else if (states.ctrl == true) {
                console.log('ctrl + down'); //same as ctrl + end
                input = document.getElementById('typing-input').value;
                len = input.length;
                caret.currentPos = len;
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            } else {
                console.log('down');
                e.preventDefault();
                //first go to the right until you detect a offsetTop change (same as End)
                //then on the new line check each offsetLeft, and as soon as offsetLeftCurrent - offsetLeftOriginal >= 0, place the caret there
                //then set a new offsetLeftOriginal
                input = document.getElementById('typing-input').value;
                len = input.length;
                letters = document.querySelectorAll("letter");
                let offsetLeftOriginal = letters[caret.currentPos].offsetLeft;
                for (i = caret.currentPos; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {   
                    caret.currentPos++; //after this caret.currentPos is either at len or at the end of line
                }
                //if it's at len we can't increase it
                let differences = {};
                if (caret.currentPos + 1 <= len) {
                    let j = caret.currentPos+1;
                    differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                    for (i = caret.currentPos+1; i < len && letters[i].offsetTop == letters[i+1].offsetTop; i++) {
                        j++
                        differences[j] = Math.abs(letters[j].offsetLeft - offsetLeftOriginal)
                        //we need the last one to be len or the last character of the line, depending on what is longer
                        //but we can't check letters[i + 1] if i is len
                    } 
                }
                if (!(Object.keys(differences).length === 0 && obj.constructor === Object)) { //if object not empty
                    console.log('exe');
                    keys = Object.keys(differences);
                    let min = keys[0];
                    for (k in differences) {
                        if (differences[k] < differences[min]) {
                            min = k
                        }
                    }
                    caret.currentPos = parseInt(min);
                }
                flash.caretChange = true;
                
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                adjustCaret(e, caret.currentPos, caret.previousPos);
                caret.previousPos = caret.currentPos;
            }
            //down puts the caret to the end if it's the last line, and else it just moves the caret down one line
            //ctrl + down moves the cursor to the end of the text, regardless at what line
            //vice versa for up
            //end puts the cursor always to the end of the line
            //home puts the cursor always to the start of the line
            //ctrl end puts the cursor always to the end of the whole text
            //ctrl home puts the cursor always to the start of the whole text
            break;
        case 65:// notes: reset colors / move caret to start
            if (states.ctrl == true) {
                console.log('CTRL + A')
                input = document.getElementById('typing-input').value;
                let len = input.length;
                obj.selectionStart = 0;
                obj.selectionEnd = len;
                caret.currentPos = 0;
                removeHighlight();
                obj.selectedText = input.slice(obj.selectionStart, obj.selectionEnd);
                addHighlight(obj.selectedText, "right");
                flash.caretChange = true;
                stopFlash();
                startFlash();
                flash.caretChange = false;
                checkOffset();
                updateCaret();
                caret.previousPos = caret.currentPos;
            }
    }
}

function keyup(e) {
    let keyCode = e.which || e.keyCode;

    switch(keyCode) {
        case 16:
            //console.log('releasing shift');
            states.shift = false;
            break;
        case 17:
            //console.log('releasing control');
            states.ctrl = false;
            break;
    }
}

function adjustCaret(e, currentPos, previousPos) {
    if (previousPos > 0) {
        if (e) {
            e.preventDefault(); 
        }
        setCaretPosition("typing-input", currentPos);
    } else {
        input = document.getElementById('typing-input').value
        document.getElementById('typing-input').value = ' ' + input;
        if (e) {
            e.preventDefault(); 
        }
        setCaretPosition("typing-input", currentPos);
        document.getElementById('typing-input').value = input;
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
}

function setPreviousOffset(letter) {
    if (letter != undefined) {
        obj.previousOffset = letter.offsetTop;
    }
}

function checkOffset(selectionEnd) {
    let letter;
    if (selectionEnd) {
        letter = document.querySelectorAll("letter")[selectionEnd];
    } else {
        letter = document.querySelectorAll("letter")[caret.currentPos];
    }
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



        pixel_per_em = Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
        scrollBy(0, 3*pixel_per_em*difference);
    }
    obj.previousOffset = letter.offsetTop;
    document.getElementById('typing-input').style.top = style.top + 'em';
}

function getValue() {
    if (obj.updateInput == true) {
        document.getElementById('typing-input').value = obj.new_input;
        obj.updateInput = false;
    }
    input = document.getElementById('typing-input').value;
    len = input.length;
    addedChars = 0;
    if (obj.highlight == true) {
        removeHighlight();
        addedChars = len - (obj.previousLen - obj.selectedText.length);
    }
    caret.currentPos = document.getElementById('typing-input').selectionStart;
    if (len-addedChars <= obj.mistakeIdx || caret.currentPos < len) {
        obj.mistake = false;
        obj.mistakeIdx = obj.lettercount;
    }
    flash.caretChange = true;
    stopFlash();
    startFlash();
    flash.caretChange = false;

    if (obj.mobile == true) {
        verifyInput(6, len, input);
    } else if (addedChars == 0) {
        if ((len > obj.previousLen) && (len == caret.currentPos)) {
            verifyInput(1, len, input);
        } else if ((len < obj.previousLen) && (len == caret.currentPos)) {
            verifyInput(2, len, input);
        } else if ((len > obj.previousLen) && (len > caret.currentPos)) {
            verifyInput(3, len, input);
        } else if ((len < obj.previousLen) && (len > caret.currentPos)) {
            verifyInput(4, len, input);
        }
    } else {
        verifyInput(5, len, input)
    }
    checkOffset();
    updateCaret();
    caret.previousPos = caret.currentPos;
    obj.previousLen = len;
}

function verifyInput(Case, len, input) {
    if (Case == 1) {
        setCounters(input, caret.previousPos);
        previousletter = document.querySelectorAll("letter")[obj.lettercounter-1];
        nextletter = document.querySelectorAll("letter")[obj.lettercounter+1];
        word = document.querySelectorAll("word")[obj.wordcounter];
        previousword = document.querySelectorAll("word")[obj.wordcounter-1];
        let start = caret.previousPos;
        let end = len;
        for (let i = start; i < end; i++) {
            let letter = document.querySelectorAll("letter")[i];
            let typedLetter = input[i];
            if (typedLetter == letter.innerHTML && i <= obj.mistakeIdx) {
                letter.classList.add("correct");
                countCorrectLetters(letter.innerHTML);
                countCorrectBigrams(previousletter, letter.innerHTML);
                countCorrectWords(letter.innerHTML, nextletter.innerHTML, word);
                countCorrectWordpairs(nextletter.innerHTML, previousword, word);
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

        let letter = document.querySelectorAll("letter")[start]; 
        if (letter.classList.contains("correct")) {
            times.letters.startTime = startTimer()
        }


        for (let i = start; i < end; i++) {
            let letter = document.querySelectorAll("letter")[i];
            if (letter.classList.length > 0) {
                letter.classList.remove(...letter.classList);
            }
        }

    } else if (Case == 3) {
        setCounters(input, caret.previousPos);
        let start = caret.previousPos;
        let end = len;
        for (let i = start; i < end; i++) {
            let letter = document.querySelectorAll("letter")[i];
            let typedLetter = input[i];
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
                    previousletter = document.querySelectorAll("letter")[obj.lettercounter-1];
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
        let between = len;
        let end = obj.previousLen;
        for (let i = between; i < end; i++) {
            let letter = document.querySelectorAll("letter")[i];
            if (letter.classList.length > 0) {
                letter.classList.remove(...letter.classList);
            }
        }
        for (let i = start; i < between; i++) {
            let letter = document.querySelectorAll("letter")[i];
            let typedLetter = input[i];
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
            let letter = document.querySelectorAll("letter")[i];
            if (letter.classList.length > 0) {
                letter.classList.remove(...letter.classList);
            }
        }
        setCounters(input, caret.previousPos);
        start = caret.previousPos;
        end = len;
        for (let i = start; i < end; i++) {
            let letter = document.querySelectorAll("letter")[i];
            let typedLetter = input[i];
            if (typedLetter == letter.innerHTML && i <= obj.mistakeIdx) {
                letter.classList.add("correct");
            } else {
                if (letter.innerHTML == " ") {
                    letter.classList.add("space-error");
                } else {
                    letter.classList.add("error");
                }
                if (obj.mistake == false && (i < caret.currentPos)) {
                    previousletter = document.querySelectorAll("letter")[obj.lettercounter-1];
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
            let letter = document.querySelectorAll("letter")[i];
            if (letter.classList.length > 0) {
                letter.classList.remove(...letter.classList);
            }
        }
        start = 0;
        //end = len;
        end = len;
        for (let i = start; i < end; i++) {
            let letter = document.querySelectorAll("letter")[i];
            let typedLetter = input[i];
            if (typedLetter == letter.innerHTML /*&& i <= obj.mistakeIdx*/) {
                letter.classList.add("correct");
            } else {
                if (letter.innerHTML == " ") {
                    letter.classList.add("space-error");
                } else {
                    letter.classList.add("error");
                }
                
                if (obj.mistake == false) {
                    previousletter = document.querySelectorAll("letter")[obj.lettercounter-1];
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
                times.words.endTime = stopTimer();
                calculateTimes(times.words.startTime, times.words.endTime, "words", word)
            }
    
            if (stats.correct.words[word]) {
                stats.correct.words[word] += 1;
            } else {
                stats.correct.words[word] = 1;
            }
        } else if (letter == ' ') {
            times.words.startTime = startTimer();
        } 
    }
}

function countCorrectWordpairs(nextLetter, previousWordTag, currentWordTag) {
    if (obj.wordcounter == 0) {
        times.wordpairs.cooldown = 0;
    }
    if (nextLetter == ' ' && obj.wordcounter > 0) {
        let previousWord = "";
        let currentWord = "";
        for (letterTag of currentWordTag.childNodes) {
            currentWord += letterTag.innerHTML;
        }
        for (letterTag of previousWordTag.childNodes) {
            previousWord += letterTag.innerHTML;
        }
        let wordpair = previousWord + ' ' + currentWord

        if (times.wordpairs.cooldown == 0) {
            times.wordpairs.startTime1 = startTimer();
            times.wordpairs.cooldown = 3;
            if (obj.wordcounter > 3) {
                times.wordpairs.endTime2 = stopTimer();
                calculateTimes(times.wordpairs.startTime2, times.wordpairs.endTime2, "wordpairs", wordpair)
            }
        }
        if (times.wordpairs.cooldown == 1) {
            times.wordpairs.startTime3 = startTimer();
            times.wordpairs.endTime1 = stopTimer();
            calculateTimes(times.wordpairs.startTime1, times.wordpairs.endTime1, "wordpairs", wordpair)
        }
        if (times.wordpairs.cooldown == 2) {
            times.wordpairs.startTime2 = startTimer();
            if (obj.wordcounter > 4) {
                times.wordpairs.endTime3 = stopTimer();
                calculateTimes(times.wordpairs.startTime3, times.wordpairs.endTime3, "wordpairs", wordpair)
            }
        }

        times.wordpairs.cooldown--;


        if (obj.wordcounter > 1) {
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

    //console.log('added the ngram: ' + ngram + ' to the times.');

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
    let letter = document.querySelectorAll("letter")[caret.currentPos];
    letter.setAttribute("id", "caret");
}

function addHighlight(selectedText, arrow) {
    stopFlash();
    letters = document.querySelectorAll("letter");
    obj.highlight = false;

    if (arrow == "right" || arrow == "left") {
        for (let i = obj.selectionStart; i < obj.selectionEnd; i++) {
            letters[i].classList.add("highlight");
            obj.highlight = true;
        }
    } else { //normal
        for (let i = caret.currentPos; i < caret.currentPos + selectedText.length; i++) {
            letters[i].classList.add("highlight");
            obj.highlight = true;
        }
    }
    
    
}

function removeHighlight() {
    if (obj.highlight == false) {
        return;
    }
    letters = document.querySelectorAll("letter");

    for (let i = 0; i < obj.lettercount; i++) {
        if (letters[i].classList.contains("highlight")) {
            letters[i].classList.remove("highlight");
        }
    }
    obj.highlight = false;
}

function updateCaret() { //note that due to the change of the textdisplay having a space at the end, there is no need for border right anymore
    //also note that due to the max-length attribute of the input field, there is also no need to check for when to stop (it's impossible to go over the limit)
    let letter = document.querySelectorAll("letter")[caret.currentPos];
    let previous = document.querySelectorAll("letter")[caret.previousPos]; //note: replace currentPos+1 with caret.previousPos
    if (previous) {
        previous.style.borderLeft = "0.1px solid transparent";
    }
    if (letter) { //letter = letter to the right of the caret
        letter.style.borderLeft = "0.1px solid " + style.caretColor;
    }
}

function focusInput() {
    inputValue = document.getElementById('typing-input').value;
    document.getElementById('typing-input').focus();
    document.getElementById('typing-input').value = "";
    document.getElementById('typing-input').value = inputValue;
    adjustCaret('', caret.previousPos, caret.currentPos);
    checkOffset();
    obj.focusCounter += 1;
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
    let refresh = document.getElementById("refresh");
    refreshOffset = refresh.offsetTop;
    window.scrollTo(0, refreshOffset);
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
    obj.scrolldowncounter = 0;
    obj.scrollupcounter = 0;
    offsetList = [];
    document.getElementById('typing-input').value = "";
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
        /* NOTE: hide 100% accuracy, since it takes up too much space, and it's better to know your mistakes, than words with 100% acc.
        for (item in stats.correct) { //in case an item has 100% accuracy
            for (ngram in stats.correct[item]) {
                if (accuracy[item][ngram]) {
                    continue
                } else {
                    let incorrect = 0
                    let correct = stats.correct[item][ngram]
                    let acc = ( ( correct / (incorrect + correct) ) * 100 ).toFixed(0)
                    accuracy[item][ngram] = acc;
                }
            }
        }
        */
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
                
                /*
                console.log('========================')
                console.log('item: ' + item)
                console.log('ngram: '+ ngram)
                console.log('correct amount: ' + stats.correct[item][ngram])
                console.log('seconds: ' + stats.time[item][ngram])
                */

                if (stats.correct[item][ngram] < toggles.minAmount) {
                    continue
                }
                

                let words = ( stats.correct[item][ngram] * ngram.length ) / 5;
                let minutes = stats.time[item][ngram] / 60

                wpm = words / minutes

                wpm = wpm.toFixed(0);

                /*
                console.log('WPM: ' + wpm);
                console.log('========================')
                */
                

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
