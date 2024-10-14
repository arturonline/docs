---
title: Tutorial de Markdown
author: Artur Badenes Puig 
date: 15/09/2022
---

# Tutorial de Markdown

- [Tutorial de Markdown](#tutorial-de-markdown)
  - [Basics](#basics)
  - [Code](#code)
  - [Inline](#inline)
  - [blocks](#blocks)
    - [code fences](#code-fences)
    - [Blocks of code](#blocks-of-code)
  - [Images](#images)
  - [Create Links](#create-links)
    - [Links without title](#links-without-title)
    - [Links inside document](#links-inside-document)
  - [Lists](#lists)
    - [Ordered list](#ordered-list)
    - [Unordered list](#unordered-list)
  - [Tables](#tables)

## Basics

```md
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

```md
Write the paragraph and type "return".
```

```md
Hard returns:  
Start a new line within a given paragraph and write two "spaces" followed by "return".
```

```md
italics, with *asterisks* 
```

```md
bold, with **asterisks**
```

```md
Combined emphasis with **asterisks 
```

```md
Subrayado <u>subrayado</u>
```

```md
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.
```

```md
Horizontal rule:

----
```

## Code

## Inline

```md
Inline `code` has `back-ticks around` it.
```

## blocks

### code fences

```md
  ```
    Roses are red
    Violets are blue
  ```
```

### Blocks of code

```md
    ```Swift
    struct Person {
        var name: String
    }
    ```
```

## Images

```md
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")
```

With HTML:

```html
<img src="resources/funcInvocation.png" width="400">
```

## Create Links

There are several ways to create links.

```md
[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]
```

### Links without title

Or leave it empty and use the `[link text itself]`.

URLs and URLs in angle brackets will automatically get turned into links.

<http://www.example.com> or <http://www.example.com> and sometimes
<example.com> (but not on Github, for example).

Some text to show that the reference links can follow later.

`[arbitrary case-insensitive reference text]: https://www.mozilla.org`
`[1]: http://slashdot.org`
`[link text itself]: http://www.reddit.com`

### Links inside document

`[Back to top](#Create-Links)`<br>
[Back to top](#Create-Links)

## Lists

### Ordered list

```md
1. item1
1. item2
   + Item 1.1 (<- 3 spaces)
   + Item 1.2
     + Item 221
   + item 1.3
1. item3
```

### Unordered list

```md
+ Item 1
  + Item 2
    + Item 3
  + Item 4
+ Item 4
  + Item 5
```

## Tables

Colons can be used to align columns.

```markdown
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

- There must be at least 3 dashes separating each header cell.
- The outer pipes (|) are optional.
- You don't need to make the raw Markdown line up prettily.
- You can also use inline Markdown.

```markdown
Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3
```
