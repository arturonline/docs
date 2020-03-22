# Recognizing Common Exception Types

There are three types of exceptions:
- runtime exceptions
- checked exceptions
- and errors

## Understanding Exception Types

![Categories of exceptions](resources/exceptions.png)

- **Error** means something went so horribly wrong that your program should not attempt to recover from it.
- **Unchecked exception** (or runtime exception) represent conditions that, generally speaking, reflect errors in your program's logic and cannot be reasonably recovered from at run time.
- **Checked exception** represent invalid conditions in areas outside the immediate control of the program (invalid user input, database problems, network outages, absent files). For checked exceptions, Java requires the code to either handle them or declare them in the method signature.

>⚠ It is up to the programmers to be civilized, and specify or catch the exceptions.
In Java exceptions under Error and RuntimeException classes are unchecked exceptions, everything else under throwable is checked.

![Exception types](resources/exceptions_type.png "Types of exceptions")

## Runtime Exceptions

Runtime exceptions extend `RuntimeException`. They don’t have to be handled or declared.
They can be thrown by the programmer or by the JVM. Common runtime exceptions
include the following:

- **ArithmeticException** Thrown by the JVM when code attempts to divide by zero
- **ArrayIndexOutOfBoundsException** Thrown by the JVM when code uses an illegal index to access an array
- **ClassCastException** Thrown by the JVM when an attempt is made to cast an exception to a subclass of which it is not an instance
- **NullPointerException** Thrown by the JVM when there is a null reference where an object is required

- **NumberFormatException** Thrown by the programmer when an attempt is made to convert a string to a numeric type but the string doesn’t have an appropriate format
- **IllegalArgumentException** Thrown by the programmer to indicate that a method has been passed an illegal or inappropriate argument

## Checked Exceptions

Checked exceptions have `Exception` in their hierarchy but not `RuntimeException`. They must be handled or declared. They can be thrown by the programmer or by the JVM.

Common runtime exceptions include the following:

- **FileNotFoundException** Thrown programmatically when code tries to reference a file that does not exist.
- **IOException** Thrown programmatically when there’s a problem reading or writing a file.

## Errors

Errors extend the Error class. They are thrown by the JVM and should not be handled or declared. Errors are rare, but you might see these:

- **ExceptionInInitializerError** Thrown by the JVM when a static initializer throws an exception and doesn’t handle it
- **StackOverflowError** Thrown by the JVM when a method calls itself too many times (this is called infi nite recursion because the method typically calls itself without end).
- **NoClassDefFoundError** Thrown by the JVM when a class that the code uses is available at compile time but not runtime