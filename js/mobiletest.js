var wordlist;
var amount;
var hide = false;
flash = {
    caretChange: false
};
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
    highlight: false,
    previouslen: -1
}

var caretColor = "white";
document.body.style.setProperty("--caret-color", caretColor);


if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)) {
    document.getElementById('typing-input').addEventListener("keyup", getValue);
 } else {
    console.log('test');
    document.getElementById('typing-input').addEventListener("keyup", getValue);
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
    console.log(obj.lettercount);
    document.querySelectorAll("letter")[obj.lettercounter].style.borderLeft = "0.1px solid " + caretColor;
    document.getElementById('typing-input').setAttribute("maxlength", obj.lettercount);
}

function getValue() {
    input = document.getElementById('typing-input').value;
    letter = document.querySelectorAll("letter")[obj.lettercounter];
    previousletter = document.querySelectorAll("letter")[obj.lettercounter-1];
    next = document.querySelectorAll("letter")[obj.lettercounter+1];
    word = document.querySelectorAll("word")[obj.wordcounter];
    previousword = document.querySelectorAll("word")[obj.wordcounter-1];
    len = input.length;
    if (obj.previouslen <= len && input[obj.lettercounter] != undefined) {
        if (obj.lettercounter < obj.lettercount) {
            flash.caretChange = true;
            hideCaret();
            showCaret(letter, next);
            updateCaret(9, letter, next);
            flash.caretChange = false;
            if (input[obj.lettercounter] == letter.innerHTML && obj.mistake == false) {
                letter.classList.add("correct");
            } else {
                if (letter.innerHTML == ' ') {
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
        }
        if (letter.innerHTML == ' ') {
            obj.wordcounter++
        }
        obj.lettercounter++;
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
            if (obj.mistakeIdx >= obj.lettercounter) {
                obj.mistake = false;
            }
            hideCaret();
            showCaret(letter, next);
            updateCaret(8, letter, next)
        }
    }
    obj.previouslen = len;
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

function stopFlash() {
    if (document.getElementById('caret') != null) {
        document.getElementById('caret').removeAttribute('id');
    } else if (document.getElementById('rightcaret') != null) {
        document.getElementById('rightcaret').removeAttribute('id');
    }
}

function startFlash(letter, next) {
    if (obj.lettercounter < obj.lettercount-1 && flash.caretChange == true) {
        next.setAttribute("id", "caret");
    } else if (obj.lettercounter < obj.lettercount && flash.caretChange == false) {
        letter.setAttribute("id", "caret");
    } else {
        letter.setAttribute("id", "rightcaret");
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
    stopFlash();
}

function showCaret(letter, next) {
    letter = document.querySelectorAll("letter")[obj.lettercounter];
    if (obj.lettercounter < obj.lettercount) {
        letter.style.borderLeft = "0.1px solid " + caretColor;
    } else {
        letter = document.querySelectorAll("letter")[obj.lettercounter-1];
        letter.style.borderRight = "0.1px solid " + caretColor;
    }
    startFlash(letter, next);
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
    //removeHighlight();
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
    obj.previouslen = -1
    textdisplay.innerHTML = "";
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


//keyup for mobile
//keydown/keypress for pc

//find solution so keydown works for PC with this solution here
//This would be a better solution because dead keys work and I wouldn't
//Have to write 2 different codes twice for mobile and PC
//I would just have to change keyup and keydown

//note: this solution works with keyup (ON MOBILE)

//On mobile it's a good solution because on PC it would lag behind
//on mobile there are only keyups basically (the key isn't sent until
//keyup / also you can't hold a letter on mobile to spam it)

//so I should detect mobile then use this solution, but first i'll try
//to implement the caret and all the other stuff that I got so far
//on the main site

//and I use the other solution that I got so far for PC (if I can't
//figure out how to make keydown work for PC with this solution here)
