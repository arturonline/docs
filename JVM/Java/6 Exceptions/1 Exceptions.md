# The role of exceptions

An exception is Java’s way of saying, “I give up. I don’t know what to do right now. You deal with it.” When you write a method, you can either deal with the exception or make it the calling code’s problem. These are the two approaches Java uses when dealing with exceptions. A method can handle the exception case itself or make it the caller’s responsibility.

The key point to remember is that exceptions alter the program ﬂow.

## How JVM handle an Exception

Whenever inside a method, if an exception has occurred, the method creates an Object known as Exception Object and hands it off to the run-time system(JVM). The exception object contains name and description of the exception, and current state of the program where exception has occurred. Creating the Exception Object and handling it to the run-time system is called throwing an Exception.There might be the list of the methods that had been called to get to the method where exception was occurred. This ordered list of the methods is called **Call Stack**.Now the following procedure will happen.

- The run-time system searches the call stack to find the method that contains block of code that can handle the occurred exception. The block of the code is called **Exception handler**.
- The run-time system starts searching from the method in which exception occurred, proceeds through call stack in the reverse order in which methods were called.
- If it finds  appropriate handler then it passes the occurred exception to it. Appropriate handler means the type of the exception object thrown matches the type of the exception object it can handle.
- If run-time system searches all the methods on call stack and couldn’t have found the appropriate handler then run-time system handover the Exception Object to **default exception handler** , which is part of run-time system. This handler prints the exception information in the following format and terminates program **abnormally**.

## Understanding Exception Types

![Categories of exceptions](resources/exceptions.png)

- **Error** means something went so horribly wrong that your program should not attempt to recover from it.
- **Unchecked exception** (or runtime exception) represent conditions that, generally speaking, reflect errors in your program's logic and cannot be reasonably recovered from at run time.
- **Checked exception** represent invalid conditions in areas outside the immediate control of the program (invalid user input, database problems, network outages, absent files). For checked exceptions, Java requires the code to either handle them or declare them in the method signature.

>⚠ It is up to the programmers to be civilized, and specify or catch the exceptions.
In Java exceptions under Error and RuntimeException classes are unchecked exceptions, everything else under throwable is checked.

![](resources/exceptions_type.png "Types of exceptions")