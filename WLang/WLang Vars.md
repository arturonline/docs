# WLanguage

## Basic Types

boolean (True or False),
string ("Doe"),
integer (1234),
currency (12,32),
numeric
real (7,766666),
buffer
date, time, datetime, duration
variant

## Scope

By default, variables are global when they are declared:

- in the "**Initializing**" event of the project (or in the "Declaration" event of the set of procedures). The variable is global to the project.
- in the "**Global declarations**" event of the window, page or report. The variable is global to the element (window, page or report) where it was declared.
- In all other cases, a variable is local to the process or event where it is declared.

## Strings

[Documentación](https://help.windev.com/?1410087588&name=lesson_33_the_variables)

```python
gsBuiltString is string
gsProductName is string = "WINDEV Mobile"

// Concatenation
gsBuiltString = gsProductName + "is my go-to development tool!"
Trace("Concatenation: " + gsBuiltString)

// StringBuild
gsBuiltString = StringBuild("%1 is my go-to development tool!", gsProductName)
Trace("StringBuild: " + gsBuiltString)

// Direct input of the variable ([% %] syntax)
gsBuiltString = "[%gsProductName%] is my go-to development tool!"
Trace("Direct input: " + gsBuiltString)
```

## array

- An array is a structured type that is used to group a set of elements of the same type.
- Each array element can be directly accessed by its index.