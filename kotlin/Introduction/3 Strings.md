# Strings

Strings are represented by the type `String`. Elements of a string are characters that can be accessed by the indexing operation: `s[i]`.

Like Java, strings are **immutable** in Kotlin. This means, you cannot change individual character of a string.

However, you can reassign a string variable again if you declared the variable using keyword var:

```Java
fun main(args: Array<String>) {
    var myString = "Hey!"
    println("myString  = $myString")

    myString = "Hello!"
    println("myString  = $myString")
}
// myString  = Hey!
// myString  = Hello!
```

Kotlin has two types of string literals:

## Escaped string literals

Escaped strings may have escaped characters in them.

```Java
val s = "Hello, world!\n"
```

Here is a list of escape characters supported in Kotlin:

`
\t - Inserts tab

\b - Inserts backspace

\n - Inserts newline

\r - Inserts carriage return

\' - Inserts single quote character

\" - Inserts double quote character

\\ - Inserts backslash

\$ - Inserts dollar character
`

## Raw string literals

Raw strings can contain newlines and arbitrary text.

```Java
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """
```

By default | is used as margin prefix, but you can choose another character and pass it as a parameter, like `trimMargin(">")`.

## String templates

Strings may contain template expressions, i.e. pieces of code that are evaluated and whose results are concatenated into the string. A template expression starts with a dollar sign ($) and consists of either a simple name:

```Java
val i = 10
val s = "i = $i" // evaluates to "i = 10"
```

or an arbitrary expression in curly braces:

```Java
val s = "abc"
val str = "$s.length is ${s.length}" // evaluates to "abc.length is 3"
```

Templates are supported both inside raw strings and inside escaped strings.