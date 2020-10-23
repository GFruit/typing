obj = {
    i: 0,
    lettercount: 0,
    previouslen: -1,
}




if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)) {
    document.getElementById('input').addEventListener("keyup", getValue);
 } else {
    document.getElementById('input').addEventListener("keyup", getValue);
 }


function getValue() {
    input = document.getElementById('input').value;
    document.getElementById('result').innerHTML = input;
    letter = document.querySelectorAll('letter')[obj.i];
    len = input.length;
    if (obj.previouslen > len) {
        while (obj.previouslen > len) {
            obj.previouslen--
            obj.i--
            console.log('test');
            letter = document.querySelectorAll('letter')[obj.i];
            letter.classList.remove(letter.classList.item(0));
        }
    } else if (input[obj.i] != undefined) {
        if (obj.i < obj.lettercount) {
            console.log('test2');
            if (input[obj.i] == letter.innerHTML) {
                letter.classList.add("correct");
            } else {
                letter.classList.add("error");
            }
        }
        obj.i++;
    }
    obj.previouslen = len;
}

wordlist = ['helLo', 'my', 'friend.?*#ā']
for (word of wordlist) {
    for (letter of word) {
        obj.lettercount++;
    }
    obj.lettercount++;
}
obj.lettercount--;
document.getElementById('input').setAttribute("maxlength", obj.lettercount)

text = document.getElementById('text');

for (var i=0; i<wordlist.length; i++) {
    wordTag = document.createElement('word');
    for (let x=0; x<wordlist[i].length; x++) {
        letterTag = document.createElement('letter');
        letter = document.createTextNode(wordlist[i][x]);
        letterTag.appendChild(letter);
        wordTag.appendChild(letterTag);
    }
    text.appendChild(wordTag);
    letterTag = document.createElement('letter');
    letter = document.createTextNode(' ');
    letterTag.appendChild(letter);
    text.appendChild(letterTag);
}
lastspace = text.lastChild;
text.removeChild(lastspace);

function updateCaret(letter, next) {
    if (obj.previouslen > len) {
        while (obj.previouslen > len) {
            if (obj.i+1 >= obj.lettercount) {
                letter.style.borderRight = "0.1px solid transparent";
            } else {
                next.style.borderLeft =  "0.1px solid transparent";
            }
            letter.style.borderLeft = "0.1px solid " + caretColor;
        }
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
