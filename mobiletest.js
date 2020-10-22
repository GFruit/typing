if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)) {
    document.getElementById('input').addEventListener("keydown", getValue);
 } else {
    document.getElementById('input').addEventListener("keypress", getValue);
 }

obj = {
    i: 0,
    lettercount: 0
}

function getValue() {
    if (obj.i-1 > obj.lettercount) {
        return;
    }
    input = document.getElementById('input').value;
    document.getElementById('result').innerHTML = input;
    len = input.length;
    text = document.querySelector('letter').innerHTML;
    letter = document.querySelectorAll('letter')[obj.i];
    if (input[obj.i] == letter.innerHTML) {
        letter.style.color = "green";
    } else {
        letter.style.color = "red";
    }
    obj.i++;
}

wordlist = ['hello', 'my', 'friend']
for (word of wordlist) {
    for (letter of word) {
        obj.lettercount++;
    }
}

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

