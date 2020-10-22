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

obj = {
    i: 0,
    lettercount: 0,
    previouslen: -1
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

wordlist = ['hello', 'my', 'friend']
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

//keyup for mobile
//keydown for pc

