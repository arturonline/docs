# Intro to regex in Python

## Character Classes

`\d` could stand for any numeric digit, that is, `\d` is shorthand for the regular expression `(0|1|2|3|4|5|6|7|8|9)`. There are many such shorthand character classes:

| Shorthand character class | Represents                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| `\d`                      | Any numeric digit from 0 to 9.                                                                         |
| `\D`                      | Any character that is not a numeric digit from 0 to 9.                                                 |
| `\w`                      | Any letter, numeric digit, or the underscore character. (Think of this as matching “word” characters.) |
| `\W`                      | Any character that is not a letter, numeric digit, or the underscore character.                        |
| `\s`                      | Any space, tab, or newline character. (Think of this as matching “space” characters.)                  |
| `\S`                      | Any character that is not a space, tab, or newline.                                                    |

## Creating Regex Objects

1. Import the regex module with `import re`.
1. Create a Regex object with the `re.compile()` function. (Remember to use a raw string.)
1. Pass the string you want to search into the Regex object’s `search()` method. This returns a `Match object`.
1. Call the Match object’s `group()` method to return a string of the actual matched text.

```python
# Pattern: 515-445-3436
import re

phoneNumRegex = re.compile(r'\d\d\d-\d\d\d-\d\d\d\d')
mo = phoneNumRegex.search('My number is 415-555-4242.')
print('Phone number found: ' + mo.group())
>>> Phone number found: 415-555-4242
```

>💡 Typing `r'\d\d\d-\d\d\d-\d\d\d\d'` is much easier than typing `'\\d\\d\\d-\\d\\d\\d-\\d\\d\\d\\d'`.

## Grouping with Parentheses

```python
### Pattern: 515-345-9608

phoneNumRegex = re.compile(r'(\d\d\d)-(\d\d\d-\d\d\d\d)')
mo = phoneNumRegex.search('My number is 415-555-4242.')
mo.group(1)
>>> '415'
mo.group(2)
>>> '555-4242'
mo.group(0)
>>> '415-555-4242'
mo.group()
>>> '415-555-4242'

# If you would like to retrieve all the groups at once, use the groups() method—note the plural form for the name.

mo.groups()
>>> ('415', '555-4242')
areaCode, mainNumber = mo.groups()
print(areaCode)
>>> 415
print(mainNumber)
>>> 555-4242
```

## The pipe

The `|` character is called a pipe and you can use it anywhere you want to match one of many expressions. For example, the regular expression `r'Batman|Tina Fey'` will match either 'Batman' or 'Tina Fey'.

When both Batman and Tina Fey occur in the searched string, the first occurrence of matching text will be returned as the Match object:

```python
heroRegex = re.compile (r'Batman|Tina Fey')
mo1 = heroRegex.search('Batman and Tina Fey.')
mo1.group()
>>> 'Batman'

mo2 = heroRegex.search('Tina Fey and Batman.')
mo2.group()
>>> 'Tina Fey'
```

```python
batRegex = re.compile(r'Bat(man|mobile|copter|bat)')
mo = batRegex.search('Batmobile lost a wheel')
mo.group()
>>> 'Batmobile'
mo.group(1)
>>> 'mobile'
```

## Optional Matching

```python
batRegex = re.compile(r'Bat(wo)?man')
mo1 = batRegex.search('The Adventures of Batman')
mo1.group()
>>> 'Batman'

mo2 = batRegex.search('The Adventures of Batwoman')
mo2.group()
>>> 'Batwoman'
```

## Matching Zero or More with `*`

```python
batRegex = re.compile(r'Bat(wo)*man')
mo1 = batRegex.search('The Adventures of Batman')
mo1.group()
>>> 'Batman'

mo2 = batRegex.search('The Adventures of Batwoman')
mo2.group()
>>> 'Batwoman'

mo3 = batRegex.search('The Adventures of Batwowowowoman')
mo3.group()
>>> 'Batwowowowoman'
```

## Matching One or More with the `+`

```python
batRegex = re.compile(r'Bat(wo)+man')
mo1 = batRegex.search('The Adventures of Batwoman')
mo1.group()
>>> 'Batwoman'

mo2 = batRegex.search('The Adventures of Batwowowowoman')
mo2.group()
>>> 'Batwowowowoman'

mo3 = batRegex.search('The Adventures of Batman')
mo3 == None
>>> True
```

## Repetitions with `{ }`

(Ha){3} == (Ha)(Ha)(Ha)

```python
haRegex = re.compile(r'(Ha){3}')
mo1 = haRegex.search('HaHaHa')
mo1.group()
>>> 'HaHaHa'

mo2 = haRegex.search('Ha')
mo2 == None
>>> True
```

Instead of one number, you can specify a range by writing a minimum, a comma, and a maximum in between the curly brackets. For example, the regex `(Ha){3,5}` will match `'HaHaHa'`, `'HaHaHaHa'`, and `'HaHaHaHaHa'`.

>⚠ Python’s regular expressions are greedy by default, which means that in ambiguous situations they will match the longest string possible.

## `search()` and `findall()' Method

`search()` will return a Match object of the first matched text in the searched string, the `findall()` method will return the strings of every match in the searched string.

```python
phoneNumRegex = re.compile(r'\d\d\d-\d\d\d-\d\d\d\d')
mo = phoneNumRegex.search('Cell: 415-555-9999 Work: 212-555-0000')
mo.group()
>>> '415-555-9999'
```

```python
phoneNumRegex = re.compile(r'\d\d\d-\d\d\d-\d\d\d\d') # has no groups
phoneNumRegex.findall('Cell: 415-555-9999 Work: 212-555-0000')
>>> ['415-555-9999', '212-555-0000']
```

If there are groups in the regular expression, then findall() will return a list of tuples.

```python
phoneNumRegex = re.compile(r'(\d\d\d)-(\d\d\d)-(\d\d\d\d)') # has groups
phoneNumRegex.findall('Cell: 415-555-9999 Work: 212-555-0000')
>>> [('415', '555', '9999'), ('212', '555', '0000')]
```

## The Caret `^` and Dollar `$` sign Characters

You can also use the caret symbol (`^`) at the start of a regex to indicate that a match must occur at the beginning of the searched text. Likewise, you can put a dollar sign (`$`) at the end of the regex to indicate the string must end with this regex pattern. And you can use the `^` and `$` together to indicate that the entire string must match the regex that is, it’s not enough for a match to be made on some subset of the string.

```python
beginsWithHello = re.compile(r'^Hello')
beginsWithHello.search('Hello world!')
>>> <_sre.SRE_Match object; span=(0, 5), match='Hello'>
beginsWithHello.search('He said hello.') == None
>>> True
```

```python
endsWithNumber = re.compile(r'\d$')
endsWithNumber.search('Your number is 42')
>>> <_sre.SRE_Match object; span=(16, 17), match='2'>
endsWithNumber.search('Your number is forty two.') == None
>>> True
```

```python
wholeStringIsNum = re.compile(r'^\d+$')
wholeStringIsNum.search('1234567890')
>>> <_sre.SRE_Match object; span=(0, 10), match='1234567890'>
wholeStringIsNum.search('12345xyz67890') == None
>>> True
wholeStringIsNum.search('12 34567890') == None
>>> True
```

## The Wildcard Character `.`

The `.` character in a regular expression is called a wildcard and will match any character except for a newline.

```python
atRegex = re.compile(r'.at')
atRegex.findall('The cat in the hat sat on the flat mat.')
>>> ['cat', 'hat', 'sat', 'lat', 'mat']
```

## Matching Everything with Dot-Star `.*`

```python
nameRegex = re.compile(r'First Name: (.*) Last Name: (.*)')
mo = nameRegex.search('First Name: Al Last Name: Sweigart')
mo.group(1)
>>> 'Al'
mo.group(2)
>>> 'Sweigart'
```

The dot-star uses greedy mode: It will always try to match as much text as possible. To match any and all text in a nongreedy fashion, use the dot, star, and question mark (`.*?`). Like with curly brackets, the question mark tells Python to match in a nongreedy way.

```python
nongreedyRegex = re.compile(r'<.*?>')
mo = nongreedyRegex.search('<To serve man> for dinner.>')
mo.group()
>>> '<To serve man>'

greedyRegex = re.compile(r'<.*>')
mo = greedyRegex.search('<To serve man> for dinner.>')
mo.group()
>>> '<To serve man> for dinner.>'
```

## Matching newlines with the Dot Character

The dot-star will match everything except a newline. By passing re.DOTALL as the second argument to re.compile(), you can make the dot character match all characters, including the newline character.

```python
noNewlineRegex = re.compile('.*')
noNewlineRegex.search('Serve the public trust.\nProtect the innocent.
\nUphold the law.').group()
>>> 'Serve the public trust.'
```

```python
newlineRegex = re.compile('.*', re.DOTALL)
newlineRegex.search('Serve the public trust.\nProtect the innocent.
\nUphold the law.').group()
>>> 'Serve the public trust.\nProtect the innocent.\nUphold the law.'
```

## Case-Insensitive Matching

Normally, regular expressions match text with the exact casing you specify. To make your regex case-insensitive, you can pass `re.IGNORECASE` or `re.I` as a second argument to `re.compile()`.

```python
robocop = re.compile(r'robocop', re.I)
robocop.search('Robocop is part man, part machine, all cop.').group()
>>> 'Robocop'

robocop.search('ROBOCOP protects the innocent.').group()
>>> 'ROBOCOP'

robocop.search('Al, why does your programming book talk about robocop so much?').group()
>>> 'robo
```

## Substituting Strings with the `sub()` method

The `sub()` method for Regex objects is passed two arguments. The first argument is a string to replace any matches. The second is the string for the regular expression. The `sub()` method returns a string with the substitutions applied.

```python
namesRegex = re.compile(r'Agent \w+')
namesRegex.sub('CENSORED', 'Agent Alice gave the secret documents to Agent Bob.')
>>> 'CENSORED gave the secret documents to CENSORED.'

agentNamesRegex = re.compile(r'Agent (\w)\w*')
agentNamesRegex.sub(r'\1****', 'Agent Alice told Agent Carol that Agent Eve knew Agent Bob was a double agent.')
>>> A**** told C**** that E**** knew B**** was a double agent.'
```

## Verbose Mode

Regular expressions are fine if the text pattern you need to match is simple. But matching complicated text patterns might require long, convoluted regular expressions.

```python
phoneRegex = re.compile(r'((\d{3}|\(\d{3}\))?(\s|-|\.)?\d{3}(\s|-|\.)\d{4}
(\s*(ext|x|ext.)\s*\d{2,5})?)')
```

You can mitigate this by enabling `verbose mode` telling the `re.compile()` function to ignore whitespace and comments inside the regular expression string:

```python
phoneRegex = re.compile(r'''(
    (\d{3}|\(\d{3}\))?            # area code
    (\s|-|\.)?                    # separator
    \d{3}                         # first 3 digits
    (\s|-|\.)                     # separator
    \d{4}                         # last 4 digits
    (\s*(ext|x|ext.)\s*\d{2,5})?  # extension
    )''', re.VERBOSE)
```

## Combining re.IGNORECASE, re.DOTALL, and re.VERBOSE

What if you want to use `re.VERBOSE` to write comments in your regular expression but also want to use `re.IGNORECASE` to ignore capitalization? Unfortunately, the `re.compile()` function takes only a single value as its second argument. You can get around this limitation by combining the `re.IGNORECASE`, `re.DOTALL`, and `re.VERBOSE` variables using the pipe character (`|`), which in this context is known as the **bitwise** or operator.

So if you want a regular expression that’s case-insensitive and includes newlines to match the dot character, you would form your `re.compile()` call like this:

```python
>>> someRegexValue = re.compile('foo', re.IGNORECASE | re.DOTALL)
All three options for the second argument will look like this:


>>> someRegexValue = re.compile('foo', re.IGNORECASE | re.DOTALL | re.VERBOSE)
```
