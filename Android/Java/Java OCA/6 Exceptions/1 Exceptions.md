# The role of exceptions

An exception is Java’s way of saying, “I give up. I don’t know what to do right now. You deal with it.” When you write a method, you can either deal with the exception or make it the calling code’s problem. These are the two approaches Java uses when dealing with exceptions. A method can handle the exception case itself or make it the caller’s responsibility.

The key point to remember is that exceptions alter the program ﬂow.

## Understanding Exception Types

![Categories of exceptions](resources/exceptions.png)

- **Error** means something went so horribly wrong that your program should not attempt to recover from it.
- **Unchecked exception** (or runtime exception) represent conditions that, generally speaking, reflect errors in your program's logic and cannot be reasonably recovered from at run time.
- **Checked exception** represent invalid conditions in areas outside the immediate control of the program (invalid user input, database problems, network outages, absent files). For checked exceptions, Java requires the code to either handle them or declare them in the method signature.

## Throwing an Exception

On the exam, you will see two types of code that result in an exception. 

The first is code that’s wrong. For example:

```Java
String[] animals = new String[0];
System.out.println(animals[0]);
```

This code throws an *ArrayIndexOutOfBoundsException*. That means questions about exceptions can be hidden in questions that appear to be about something else.

The second way for code to result in an exception is to explicitly request Java to throw one. Java lets you write statements like these:

```Java
throw new Exception();
throw new Exception("Ow! I fell.");
throw new RuntimeException();
throw new RuntimeException("Ow! I fell.");
```

The first two examples create a new object of type Exception and throw it. The last two show that the code looks the same regardless of which type of exception you throw.

![](resources/exceptions_type.png "Types of exceptions")