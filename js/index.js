var wordset;
var wordlist;
var amount;
var hide = false;
flash = {};
textdisplay = document.getElementById('textdisplay');
stats = {
    wrong_letters : {},
    wrong_bigrams : {},
    wrong_words : {},
    wrong_wordpairs : {}
}
obj = {
    lettercounter: 0,
    lettercount: 0,
    wordcounter: 0,
    wordcount: 0,
    mistake: false, //does the typed text contain any mistakes
    mistakeIdx: -1,
    itemcounter: 0,
    ctrlBefore: false,
    highlight: false
}

var caretColor = "white";
document.body.style.setProperty("--caret-color", caretColor);

function setWordset (value) { 
    if (value == "Top 200") {
        wordlist = words.top200;
        document.getElementById('top200').style.color = "#F66E0D";
        document.getElementById('top1000').style.color = "white";
        document.getElementById('quotes').style.color = "white";
    } else if (value == "Top 1000") {
        wordlist = words.top1000;
        document.getElementById('top200').style.color = "white";
        document.getElementById('top1000').style.color = "#F66E0D";
        document.getElementById('quotes').style.color = "white";
    } else if (value == "Quotes") {
        wordlist = quotes;
        document.getElementById('top200').style.color = "white";
        document.getElementById('top1000').style.color = "white";
        document.getElementById('quotes').style.color = "#F66E0D";
    }
    wordset = value;
    reset();
    loadWords();
    focusInput();
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
    obj.itemcounter += 1
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
    lastspace = textdisplay.lastChild;
    textdisplay.removeChild(lastspace);
    obj.lettercount -= 1;
    document.querySelectorAll("letter")[obj.lettercounter].style.borderLeft = "0.1px solid " + caretColor;
}

function textDisplayColors(event) {
    if (obj.lettercounter >= obj.lettercount && obj.highlight == false) {
        return;
    }
    var x = event.which || event.keyCode;
    if (x == 13) {
        return;
    }
    if (x == 1 && obj.ctrlBefore == true) {
        return
    }
    if (obj.highlight == true) {
        removeHighlight();
        resetColors();
        obj.lettercounter = 0;
        obj.wordcounter = 0;
        obj.mistake = false;
    }
    var pressedKey = String.fromCharCode(x);
    letter = document.querySelectorAll("letter")[obj.lettercounter];
    previousletter = document.querySelectorAll("letter")[obj.lettercounter-1];
    next = document.querySelectorAll("letter")[obj.lettercounter+1];
    word = document.querySelectorAll("word")[obj.wordcounter];
    previousword = document.querySelectorAll("word")[obj.wordcounter-1];
    if (flash.firstLetterTyped == false) {
        flash.firstLetterTyped = true;
        stopFlash();
    }
    updateCaret(x, letter, next);
    if (pressedKey == letter.innerHTML && obj.mistake == false) {
        letter.classList.add("correct");
    } else {
        if (letter.innerHTML == ' ') {
            letter.classList.add("space-error")
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
    obj.lettercounter++
}

function handleNonletters(event) {
    var x = event.which || event.keyCode;
    if (x == 8  && obj.lettercounter > 0 && obj.ctrlBefore == true && obj.highlight == false) {
        letter = document.querySelectorAll("letter")[obj.lettercounter-1];
        next = document.querySelectorAll("letter")[obj.lettercounter];
        if (letter.innerHTML == ' ') {
            obj.lettercounter--;
            if (obj.mistakeIdx == obj.lettercounter) {
                obj.mistake = false;
            }
            obj.wordcounter--;
            updateCaret(x, letter, next);
            letter.classList.remove(letter.classList.item(0));
            letter = document.querySelectorAll("letter")[obj.lettercounter-1];
            next = document.querySelectorAll("letter")[obj.lettercounter];
        }
        while (obj.lettercounter > 0 && letter.innerHTML != ' ') {
            obj.lettercounter--;
            if (obj.mistakeIdx == obj.lettercounter) {
                obj.mistake = false;
            }
            updateCaret(x, letter, next);
            letter.classList.remove(letter.classList.item(0));
            letter = document.querySelectorAll("letter")[obj.lettercounter-1];
            next = document.querySelectorAll("letter")[obj.lettercounter];
        }
    }
    if (x == 8 && obj.lettercounter > 0 && obj.ctrlBefore == false && obj.highlight == false) {
        letter = document.querySelectorAll("letter")[obj.lettercounter-1];
        next = document.querySelectorAll("letter")[obj.lettercounter];
        letter.classList.remove(letter.classList.item(0));
        if (flash.firstLetterBackspaced == false && flash.firstLetterTyped == false) {
            flash.firstLetterBackspaced = true;
            stopFlash();
        }
        if (letter.innerHTML == ' ') {
            obj.wordcounter--
        }
        obj.lettercounter--
        if (obj.mistakeIdx == obj.lettercounter) {
            obj.mistake = false;
        }
        updateCaret(x, letter, next)
        return;
    } else if (x == 8 && obj.highlight == true) {
        removeHighlight();
        resetColors();
        obj.lettercounter = 0;
        obj.wordcounter = 0;
        obj.mistake = false;
        showCaret();
    } else if (x == 13) {
        refresh();
    }else if (x == 17) {
        obj.ctrlBefore = true;
    } else if (x == 65 && obj.ctrlBefore == true) {
        addHighlight();
    }
}

function updateCaret(keycode, letter, next) {
    if (keycode == 8) {
        if (obj.lettercounter+1 >= obj.lettercount) {
            letter.style.borderRight = "0.1px solid transparent";
        } else {
            next.style.borderLeft =  "0.1px solid transparent";
        }
        letter.style.borderLeft = "0.1px solid " + caretColor;
    }
    else {
        if (obj.lettercounter+1 < obj.lettercount) {
            next.style.borderLeft = "0.1px solid " + caretColor;
        } else {
            letter.style.borderRight = "0.1px solid " + caretColor;
        }
        letter.style.borderLeft = "0.1px solid transparent";
    }
}

function stopStates(event) {
    var x = event.which || event.keyCode;;
    if (obj.ctrlBefore == true && x == 17) {
        obj.ctrlBefore = false;
    }
}

function addWrongLetter(letter) {
    letter = letter.innerHTML;
    if (letter in stats.wrong_letters) {
        stats.wrong_letters[letter] += 1;
    } else {
        stats.wrong_letters[letter] = 1;
    }
}
function addWrongBigram(previousletter, current) {
    if (obj.lettercounter > 0) {
        var bigram = previousletter.innerHTML + current.innerHTML;
        if (bigram in stats.wrong_bigrams) {
            stats.wrong_bigrams[bigram] += 1;
        } else {
            stats.wrong_bigrams[bigram] = 1;
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
    if (word in stats.wrong_words) {
        stats.wrong_words[word] += 1;
    } else {
        stats.wrong_words[word] = 1;
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
    
    if (wordpair in stats.wrong_wordpairs) {
        stats.wrong_wordpairs[wordpair] += 1;
    } else {
        stats.wrong_wordpairs[wordpair] = 1;
    }
    
}

function focusInput() {
    document.getElementById('typing-input').focus();
    removeHighlight();
}

function blurInput() {
    document.getElementById('typing-input').blur();
}

function refresh() {
    blurInput();
    reset();
    loadWords();
    focusInput();
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

function reset() {
    obj.lettercounter = 0;
    obj.lettercount = 0;
    obj.wordcounter = 0;
    obj.wordcount = 0;
    obj.mistake = false;
    obj.mistakeIdx = -1;
    textdisplay.innerHTML = "";
    document.getElementById('typing-input').value = "";
}

function resetColors() {
    letters = document.querySelectorAll("letter");
    for (let i = 0; i < obj.lettercounter; i++) {
        letters[i].classList.remove(letters[i].classList.item(0));
    }
}

function displayStats() {
    var i = 1;
    for (item in stats) {
        var sortable = [];
        for (letter in stats[item]) {
	    var displayletter = letter;
	    if (i == 2 && letter.includes(" ")) {
		displayletter = letter.replace(" ", "_");
	    }
            sortable.push([displayletter, stats[item][letter]])
        }

        sortable.sort(function(a, b) {return b[1] - a[1]})

        for (let i = 0; i < sortable.length; i++) {
            sortable[i] = sortable[i][0] + ' ' + sortable[i][1];
        }

        document.getElementById("analysis-" + i).innerHTML = sortable.join('<br>');
        i++
    }
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
        stats[item] = {};
    }
    len = Object.keys(stats).length;
    for (let i = 1; i <= len; i++) {
        document.getElementById("analysis-" + i).innerHTML = "";
    }
    focusInput();
    updateStatus();
}
function updateStatus() {
    if (Object.keys(stats.wrong_letters) == false && Object.keys(stats.wrong_bigrams) == false && Object.keys(stats.wrong_words) == false && Object.keys(stats.wrong_wordpairs) == false) {
        document.getElementById('statsstatus').innerHTML = "No Data Found!";
    } else {
        document.getElementById('statsstatus').innerHTML = "";
    }
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

function stopFlash() {
    if (document.getElementById('caret') != null) {
        document.getElementById('caret').removeAttribute('id');
    }
}

function startFlash() {
    letter = document.querySelectorAll("letter")[obj.lettercounter];
    if (obj.lettercounter < obj.lettercount) {
        letter.setAttribute("id", "caret");
        flash.firstLetterTyped = false;
        flash.firstLetterBackspaced = false;
    }
}

function hideCaret() {
    letter = document.querySelectorAll("letter")[obj.lettercounter];
    if (obj.lettercounter < obj.lettercount) {
        letter.style.borderLeft = "0.1px solid transparent";
    } else {
        letter = document.querySelectorAll("letter")[obj.lettercounter-1];
        letter.style.borderRight = "0.1px solid transparent";
    }
    if (flash.firstLetterTyped == false && flash.firstLetterBackspaced == false) {
        stopFlash();
    }
}

function showCaret() {
    letter = document.querySelectorAll("letter")[obj.lettercounter];
    if (obj.lettercounter < obj.lettercount) {
        letter.style.borderLeft = "0.1px solid " + caretColor;
    } else {
        letter = document.querySelectorAll("letter")[obj.lettercounter-1];
        letter.style.borderRight = "0.1px solid " + caretColor;
    }
    startFlash();
}

function addHighlight() {
    hideCaret();
    letters = document.querySelectorAll("letter");
    for (let i = 0; i < obj.lettercounter; i++) {
        letters[i].style.backgroundColor = "#0078D7";
    }
    obj.highlight = true;
}

function removeHighlight() {
    letters = document.querySelectorAll("letter");
    for (let i = 0; i < obj.lettercounter; i++) {
        letters[i].style.backgroundColor = "inherit";
    }
    obj.highlight = false;
}

//to do:

/*
What should I use? 
Here's a general recommendation for storing resources:

For the network resources necessary to load your app and file-based content, use the Cache Storage API (part of service workers).
For other data, use IndexedDB (with a promises wrapper).

https://web.dev/storage-for-the-web/
https://javascript.info/callbacks and further lessons to learn about awaits etc.
*/
