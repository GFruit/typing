let obj = {
    lettercounter: 0,
    lettercount: 0,
    wordcounter: 0,
    wordcount: 0,
    highlight: false,
    previouslen: 0
}
let flash = {
    caretChange: false
}

let caret = {
    previousPos: 0, //so we know where to remove the flashing animation
    currentPos: 0, //so we know where to add the flashing animation
    caretColor: "red",
    update: function() {
        let letter = document.querySelectorAll("letter")[caret.currentPos];
        let previous = document.querySelectorAll("letter")[caret.previousPos];
        //console.log(letter.innerHTML);
        if (obj.lettercounter+1 < obj.lettercount) {
            letter.style.borderLeft = "0.1px solid " + caret.caretColor;
        }
        previous.style.borderLeft = "0.1px solid transparent";
    }
}

document.getElementById('typing-input').addEventListener("input", getValuev2);
document.getElementById('typing-input').addEventListener("select", select);

function loadWords() {
    document.getElementById('textdisplay').innerHTML = "";
    wordlist = ["hello", "how", "are", "you", "doing"]
    for (var i=0; i<wordlist.length; i++) {
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
}

function select() {
    /*
    removeHighlight();
    obj.selection = window.getSelection();
    obj.selectedText = obj.selection.toString()
    addHighlight(obj.selectedText);
    */
}

document.addEventListener('selectionchange', () => {
    caret.currentPos = document.getElementById('typing-input').selectionStart;

    removeHighlight();
    obj.selection = window.getSelection();
    obj.selectedText = obj.selection.toString()
    addHighlight(obj.selectedText);

    //caret.currentPos = document.getElementById('typing-input').selectionStart;
    stopFlash();
    startFlash();
    updateCaretv2();
    caret.previousPos = caret.currentPos;
  });

function getValue(e) {
    caret.currentPos = document.getElementById('typing-input').selectionStart;
    addedChars = 0;
    input = document.getElementById('typing-input').value;
    let len = input.length;
    if (obj.highlight == true) {
        removeHighlight();
        addedChars = len - (obj.previouslen - obj.selectedText.length);
        len -= addedChars //so we decrease fully
    }
    if (obj.previouslen < len && input[obj.lettercounter] != undefined) {
        while (obj.previouslen < len) {
            if (obj.lettercounter < obj.lettercount) {
                input = document.getElementById('typing-input').value;
                letter = document.querySelectorAll("letter")[obj.lettercounter];
                previousletter = document.querySelectorAll("letter")[obj.lettercounter-1];
                next = document.querySelectorAll("letter")[obj.lettercounter+1];
                word = document.querySelectorAll("word")[obj.wordcounter];
                previousword = document.querySelectorAll("word")[obj.wordcounter-1];
                obj.previouslen++
                flash.caretChange = true;
                stopFlash();
                startFlash(next);
                //updateCaret(9, letter, next);
                //caret.update()
                flash.caretChange = false;
                if (input[obj.lettercounter] == letter.innerHTML) {
                    letter.classList.add("correct");
                } else {
                    if (letter.innerHTML == ' ') {
                        letter.classList.add("space-error");
                    } else {
                        letter.classList.add("error");
                    }
                }
                if (letter.innerHTML == ' ') {
                    obj.wordcounter++
                }
                obj.lettercounter++;
            }       
        }  
    } else {
        while (obj.previouslen > len) {
            obj.previouslen--
            letter = document.querySelectorAll("letter")[obj.lettercounter-1];
            next = document.querySelectorAll("letter")[obj.lettercounter];
            letter.classList.remove(letter.classList.item(0));
            if (letter.innerHTML == ' ') {
                obj.wordcounter--
            }
            obj.lettercounter--
            stopFlash();
            startFlash(next);
            //updateCaret(8, letter, next)
            //updateCaretv2(true);
            //caret.update();
            //caret.currentPos = document.getElementById('typing-input').selectionStart;
        }
        caret.currentPos = document.getElementById('typing-input').selectionStart;
        updateCaretv2();
        caret.previousPos = caret.currentPos;
    }
    obj.previouslen = len;
    //caret.previousPos = caret.currentPos;
    if (addedChars > 0) {
        for (let i = 0; i < addedChars; i++) {
            getValue();
        } 
    }
}

function getValuev2() {
    if (obj.highlight == true) {
        removeHighlight();
    }
    caret.currentPos = document.getElementById('typing-input').selectionStart;
    addedChars = 0;
    input = document.getElementById('typing-input').value;
    let len = input.length;
    flash.caretChange = true;
    stopFlash();
    startFlash();
    flash.caretChange = false;
    for (let i = 0; i < obj.lettercount; i++) {
        letter = document.querySelectorAll("letter")[i];
        if (letter.classList.item(0)) {
            letter.classList.remove(letter.classList.item(0));
        }
    }
    obj.lettercounter = 0;
    obj.wordcounter = 0;
    for (let i = 0; i < len; i++) {
        letter = document.querySelectorAll("letter")[i];
        typedLetter = input[i];
        if (typedLetter == letter.innerHTML) {
            letter.classList.add("correct");
        } else {
            if (letter.innerHTML == " ") {
                letter.classList.add("space-error");
            } else {
                letter.classList.add("error");
            }
        }
        if (letter.innerHTML == ' ') {
            obj.wordcounter++
        }
        obj.lettercounter++;
    }
    caret.currentPos = document.getElementById('typing-input').selectionStart;
    updateCaretv2();
    caret.previousPos = caret.currentPos;
    if (addedChars > 0) {
        for (let i = 0; i < addedChars; i++) {
            getValue();
        } 
    }
}

function stopFlash() {
    if (document.getElementById('caret') != null) {
        document.getElementById('caret').removeAttribute('id');
    }
}

function startFlash() {
    let letter = document.querySelectorAll("letter")[caret.currentPos];
    if (flash.caretChange == true) {
        letter.setAttribute("id", "caret");
    } else if (flash.caretChange == false) {
        letter.setAttribute("id", "caret");
    }
}


function updateCaret(keycode, letter, next) {
    if (keycode == 8) {
        if (obj.lettercounter+1 >= obj.lettercount) {
            letter.style.borderRight = "0.1px solid transparent";
        } else {
            next.style.borderLeft =  "0.1px solid transparent";
        }
        letter.style.borderLeft = "0.1px solid " + caret.caretColor;
    }
    else {
        if (obj.lettercounter+1 < obj.lettercount) {
            next.style.borderLeft = "0.1px solid " + caret.caretColor;
        } else {
            letter.style.borderRight = "0.1px solid " + caret.caretColor;
        }
        letter.style.borderLeft = "0.1px solid transparent";
    }
}

function addHighlight() {
    stopFlash();
    letters = document.querySelectorAll("letter");
    obj.highlight = false;
    for (let i = caret.currentPos; i < caret.currentPos + obj.selectedText.length; i++) {
        letters[i].classList.add("highlight");
        obj.highlight = true;
    }
}

function removeHighlight() {
    if (obj.highlight == false) {
        return;
    }
    letters = document.querySelectorAll("letter");

    for (let i = 0; i < obj.lettercount; i++) {
        if (letters[i].classList.item(1)) {
            letters[i].classList.remove(letters[i].classList.item(1));
        }
    }
    obj.highlight = false;
}

function updateCaretv2() { //note that due to the change of the textdisplay having a space at the end, there is no need for border right anymore
    //also note that due to the max-length attribute of the input field, there is also no need to check for when to stop (it's impossible to go over the limit)
    let letter = document.querySelectorAll("letter")[caret.currentPos];
    let previous = document.querySelectorAll("letter")[caret.previousPos]; //note: replace currentPos+1 with caret.previousPos
    if (previous) {
        previous.style.borderLeft = "0.1px solid transparent";
    }
    if (letter) { //letter = letter to the right of the caret
        letter.style.borderLeft = "0.1px solid " + caret.caretColor;
    }
}
