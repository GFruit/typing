let stats = {
    wrong_letters : {},
    wrong_bigrams : {},
    wrong_words : {},
    wrong_wordpairs : {}
}

let hide = false;

let obj = {
    lettercounter: 0,
    lettercount: 0,
    wordcounter: 0,
    wordcount: 0,
    highlight: false,
    previousOffset: -1,
    previousLen: -1,
    mistake: false,
    mistakeIdx: -1
}
let flash = {
    caretChange: false
}

let caret = {
    previousPos: 0, //so we know where to remove the flashing animation
    currentPos: 0, //so we know where to add the flashing animation
    caretColor: "white",
}

let style = {
    top: 25
}

document.getElementById('typing-input').addEventListener("input", getValue);
document.addEventListener("selectionchange", selectionChange);
document.getElementById('typing-input').addEventListener("keydown", keydown);

function selectionChange() {
    caret.currentPos = document.getElementById('typing-input').selectionStart;
    
    removeHighlight();
    obj.selection = window.getSelection();
    obj.selectedText = obj.selection.toString()
    addHighlight(obj.selectedText);

    stopFlash();
    startFlash();
    updateCaret();

    checkOffset();
    caret.previousPos = caret.currentPos;
}

function keydown(e) {
    let keyCode = e.which || e.keyCode;
    if (keyCode == 13) {
        refresh();
    }
}

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
    setPreviousOffset();
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
    startFlash();
    document.getElementById('typing-input').setAttribute("maxlength", obj.lettercount-1);
    obj.mistakeIdx = obj.lettercount;
}

function setPreviousOffset(letter) {
    if (letter != undefined) {
        obj.previousOffset = letter.offsetTop;
    }
}

function checkOffset(x) {
    let letter = document.querySelectorAll("letter")[caret.currentPos];
    console.log(letter.offsetTop);
    document.getElementById('typing-input').style.top = style.top + 'em';
    if (letter.offsetTop < obj.previousOffset) {
        console.log('scroll up')
        style.top -= 3;
        pixel_per_em = Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
        scrollBy(0, -3*pixel_per_em);
    } else if (letter.offsetTop > obj.previousOffset) {
        console.log('scroll down')
        style.top += 3;
        //pixel_per_em = Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
        //scrollBy(0, +3*pixel_per_em);
    }
    obj.previousOffset = letter.offsetTop;
    document.getElementById('typing-input').style.top = style.top + 'em';
}

function getValue() {
    if (obj.highlight == true) {
        removeHighlight();
    }
    caret.currentPos = document.getElementById('typing-input').selectionStart;
    input = document.getElementById('typing-input').value;
    let len = input.length;
    flash.caretChange = true;
    stopFlash();
    startFlash();
    flash.caretChange = false;
    for (let i = 0; i < obj.lettercount; i++) {
        let letter = document.querySelectorAll("letter")[i];
        if (letter.classList.item(0)) {
            letter.classList.remove(letter.classList.item(0));
        }
    }
    obj.lettercounter = 0;
    obj.wordcounter = 0;
    for (let i = 0; i < len; i++) {
        let letter = document.querySelectorAll("letter")[i];
        typedLetter = input[i];
        if (typedLetter == letter.innerHTML && i <= obj.mistakeIdx) {
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
    if (obj.lettercounter <= obj.mistakeIdx) {
        obj.mistake = false;
        obj.mistakeIdx = obj.lettercount;
    }
    checkOffset();
    updateCaret();
    caret.previousPos = caret.currentPos;
    obj.previousLen = len;
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

function updateCaret() { //note that due to the change of the textdisplay having a space at the end, there is no need for border right anymore
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

function focusInput() {
    inputValue = document.getElementById('typing-input').value;
    document.getElementById('typing-input').focus();
    document.getElementById('typing-input').value = "";
    document.getElementById('typing-input').value = inputValue;
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
    caret.currentPos = 0;
    caret.previousPos = 0;
    document.getElementById('typing-input').value = "";
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

function updateStatus() {
    if (Object.keys(stats.wrong_letters) == false && Object.keys(stats.wrong_bigrams) == false && Object.keys(stats.wrong_words) == false && Object.keys(stats.wrong_wordpairs) == false) {
        document.getElementById('statsstatus').innerHTML = "No Data Found!";
    } else {
        document.getElementById('statsstatus').innerHTML = "";
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
    let len = Object.keys(stats).length;
    for (let i = 1; i <= len; i++) {
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
