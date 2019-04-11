# Memoria

![Logical Operator](C:\Users\artur\OneDrive\Dev\MD\Java OCA\2 Operators and Statements\resources\logical_operator.png)

Here are some tips to help remember this table:

* AND is only true if both operands are true.
* Inclusive OR is only false if both operands are false. 
* Exclusive OR is only true if the operands are different.

## Overloading Methods

Method overloading occurs when there are different methods with the same name but different type parameters.

Everything other than the method signature can vary for overloaded methods. This means there can be different access modifers, specifers (like static), return types, and exception lists:

```Java
public void fly(int numMiles) { }
public void fly(short numFeet) { }
public boolean fly() { return false; }
void fly(int numMiles, short numFeet) { }
public void fly(short numFeet, int numMiles) throws Exception { }
```

## Defining an Interface

The following is a list of rules for creating an interface, many of which you should recognize as adaptions of the rules for defining abstract classes.

1. Interfaces cannot be instantiated directly.
1. An interface is not required to have any methods.
1. An interface can not be marked as final.
1. All top-level interfaces are assumed to have **public** or **default access**, and they must include the **abstract** modifier in their definition. Therefore, marking an interface as private, protected, or final will trigger a compiler error, since this is incompatible with these assumptions.
1. All nondefault methods in an interface are assumed to have the modifiers abstract and public in their definition. Therefore, marking a method as private, protected, or final will trigger compiler errors as these are incompatible with the abstract and public keywords.

## sep

A. private instance methods
B. protected instance methods
C. public instance methods
D. static methods
E. public variables
F. private variables

A, D, E, F. First off, options B and C are incorrect because protected and public methods
may be overridden, not hidden. Option A is correct because private methods are
always hidden in a subclass. Option D is also correct because static methods cannot
be overridden, only hidden. Options E and F are correct because variables may only be
hidden, regardless of the access modifier.

## Adding a finally block

!["The syntax of a try statement with finally"](resources/exceptions_finally.png)

- order: try - catch - finally
- There must be a catch or finally block.
- Catch is not required if finally is present.

## exceptions thrown by whom

jvm:

- **ArithmeticException** run
- **ArrayIndexOutOfBoundsException** run
- **ClassCastException** run
- **NullPointerException** run

programmer:

- **NumberFormatException** run
- **IllegalArgumentException** run

- **FileNotFoundException** exc
- **IOException** exc