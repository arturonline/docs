# WildCards vs Regular Expressions

## Wildcards

In software, a wildcard character is a kind of placeholder represented by a single character, such as an asterisk (\*), which can be interpreted as a number of literal characters or an empty string. It is often used in file searches so the full name need not be typed.

| wildcard | definition                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| \*       | matches any number of any characters including none. Ex `a*` => arbol, as, asimetria, etc...                   |
| ?        | matches any single character . Ex: `h?r` => hora, horonabilidad, har...                                        |
| [abc]    | matches one character given in the bracket.                                                                    |
| [.,_]    | specifies character `.`, `,` or `_`                                                                            |
| [a-z]    | matches one character from the range given in the bracket. In this case any lowercase letter                   |
| [0-9]    | any number                                                                                                     |
| [a-zA-Z] | any letter                                                                                                     |
| [!]      | matches one character that is not given in the bracket. Ex: `[!0-9]` represents any character except numbers   |
| {}       | to point out some string of characters (at least 2). Ex: `P{lota, lotero, lazo}` => pelota, pelotero, pelotazo |

### Wildcard examples

| Example     | Matches                                 | Does not match              |
| ----------- | --------------------------------------- | --------------------------- |
| Law\*       | Law, Laws, Lawyer                       | GrokLaw, La, aw             |
| _Law_       | Law, GrokLaw, Lawyer                    | La, aw                      |
| ?at         | Cat, cat, Bat, bat                      | at                          |
| [CB]at      | Cat, Bat                                | cat, bat                    |
| Letter[0-9] | Letter0, Letter1, Letter2 up to Letter9 | Letters, Letter or Letter10 |
