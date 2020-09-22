with open("30k.txt", "r") as f:
    lines = f.readlines()
wordlist = []
for line in lines:
    line = line.strip('\n')
    line = line.strip()
    wordlist.append(line)
with open("30k_list.txt", "w") as f:
    f.write('[\n')
    for word in wordlist:
        f.write('"')
        f.write(word)
        f.write('"')
        f.write(',')
        f.write('\n')
    f.write(']')
