# words-filter

Words Filter allows you to filter words based on certain rules that you can make yourself.

## Guide:

### Wordset

Decide from which wordset you want to filter the words. You can also choose a set of quotes.
- Top 200: Top 200 most common English words
- Top 1000: Top 1000 most common English words
- Top 10k: Top 10,000 most common English words
- Top 30k: Top 30,000 most common English words
- Top 370k: Top 370,000 most common English words
- Quotes: 5000 quotes from Typeracer.com

### Layout

Decide which layout should be used for the words filter. This influences the Hands, Rows, Home Position, Fingers and Alternate filters.
- Qwerty: Standard US Keyboard Layout
- Qwertz: Y and Z swapped, default layout in Germany and Switzerland.
- Colemak: Alternative Keyboard Layout created by Shai Coleman in 2006, optimised for the English language.
- Dvorak: Alternative Keyboard Layout created by August Dvorak in 1936, optimised for the English language.

### Hand/s

Decide by which Hand/s you want to filter the words.
- Both: Filters by words that are typed with the left hand, or right hand or both.
- Left: Filters by words that are typed with the left hand only.
- Right: Filters by words that are typed with the right hand only.

### Rows...

Decide by which Rows you want to filter the words.
If the checkbox is checked then...
- Top: Filtered words are allowed to contain letters from the top row
- Home: Filtered words are allowed to contain letters from the home row
- bottom: Filtered words are allowed to contain letters from the bottom row

### Home Position

Decide if you only want to include words that can be typed in home position. (asdf jkl; on qwerty)

### Fingers

Decide by which Fingers you want to filter the words.
If the checkbox is checked then...
- lp: Filtered words are allowed to contain letters that are typed by left pinky finger.
- lr: Filtered words are allowed to contain letters that are typed by left ring finger.
- lm: Filtered words are allowed to contain letters that are typed by left middle finger.
- li: Filtered words are allowed to contain letters that are typed by left index finger.
- rp: Filtered words are allowed to contain letters that are typed by right pinky finger.
- rr: Filtered words are allowed to contain letters that are typed by right ring finger.
- rm: Filtered words are allowed to contain letters that are typed by right middle finger.
- ri: Filtered words are allowed to contain letters that are typed by right index finger.

### Min-Length / Max-Length

Decide the length of the filtered words

### Excluding/Including Letters

Decide which letters you (don't) want the filtered words to include.

Usage:
- groups of letters without spaces between the commas mean that all these letters (need to / shouldn't) be contained in the word.
- letters or groups of letters separated by commas mean that the word is denied/accepted if any of the letters or groups of letters between the commas are contained in the word in any order.
(no space = AND operator)
(comma = OR operator)

Example 1: aa = If a word/quote (doesn't) include(s) at least 2x "a" then it is ex-/included from the list (again, afraid, always, appear, area, paragraph)
Example 2: ab, ed = If a/quote word ex-/includes at least 1 "a" and 1 "b" OR 1 "e" and 1 "d" then it is ex-/included from the list (about, back, because, consider, develop, end, head, lead, need, order, under)

### Excluding/Including Strings

Decide which strings you (don't) want the filtered words to include

Usage
- groups of wordparts (=strings/n-grams) separated by 1 space between the commas mean that all these wordparts (shouldn't / need to) be contained in the word.
- wordparts or groups of wordparts separated by commas mean that the word is denied/accepted if any of the wordparts or groups of wordparts between the commas are contained in the word in any order.
(one space = AND operator)
(comma = OR operator)

Example 1: he he, st, en in on = If a word/quote (doesn't) include(s) at least 2x "he" OR 1x "st" OR 1x "en" and "in" and "on" then it is ex-/included from the list (whether, strange, continent)

Example 2: you you you you are = If a word/quote (doesn't) include(s) at least 4x "you" and 1x "are" then it is ex-/included from the list. Quote: (If you don't know what you want, how are you doing to know when you get it?)

### Alternate...
- Hands: Filtered words have to contain letters in an order so the hands alternate after each letter.
- Fingers: Filtered words have to contain letters in an order so the fingers alternate after each letter.
- Rows: Filtered words have to contain letters in an order so the rows alternate after each letter.
