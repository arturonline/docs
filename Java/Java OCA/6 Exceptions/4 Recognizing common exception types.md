# Recognizing Common Exception Types

You need to recognize three types of exceptions for the OCA exam: runtime exceptions,
checked exceptions, and errors and you’ll need to recognize which type of an exception it is and whether it’s thrown by the JVM or a programmer.

## Runtime Exceptions

Runtime exceptions extend RuntimeException. They don’t have to be handled or declared.
They can be thrown by the programmer or by the JVM. Common runtime exceptions
include the following:

- **ArithmeticException** Thrown by the JVM when code attempts to divide by zero
- **ArrayIndexOutOfBoundsException** Thrown by the JVM when code uses an illegal index to access an array
- **ClassCastException** Thrown by the JVM when an attempt is made to cast an exception to a subclass of which it is not an instance
- **NullPointerException** Thrown by the JVM when there is a null reference where an object is required

- **NumberFormatException** Thrown by the programmer when an attempt is made to convert a string to a numeric type but the string doesn’t have an appropriate format
- **IllegalArgumentException** Thrown by the programmer to indicate that a method has been passed an illegal or inappropriate argument

## Checked Exceptions

Checked exceptions have Exception in their hierarchy but not RuntimeException. They must be handled or declared. They can be thrown by the programmer or by the JVM.

Common runtime exceptions include the following:

- **FileNotFoundException** Thrown programmatically when code tries to reference a file that does not exist.
- **IOException** Thrown programmatically when there’s a problem reading or writing a file.

## Errors

Errors extend the Error class. They are thrown by the JVM and should not be handled or declared. Errors are rare, but you might see these:

- **ExceptionInInitializerError** Thrown by the JVM when a static initializer throws an exception and doesn’t handle it
- **StackOverflowError** Thrown by the JVM when a method calls itself too many times (this is called infi nite recursion because the method typically calls itself without end).
- **NoClassDefFoundError** Thrown by the JVM when a class that the code uses is available at compile time but not runtime