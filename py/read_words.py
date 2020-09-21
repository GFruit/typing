with open("words_alpha.txt", "r") as f:
    lines = f.readlines()
wordlist = []
for line in lines:
    wordlist.append(line.strip('\n'))
with open("words_list.txt", "w") as f:
    f.write('[\n')
    for word in wordlist:
        f.write('"')
        f.write(word)
        f.write('"')
        f.write(',')
        f.write('\n')
    f.write(']')
