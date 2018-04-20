# Using try Statement

!["The syntax of a try statement"](resources/exceptions_syntax.png)

If any of the statements throw an exception that can be caught by the exception type listed in the catch block, the try block stops running and execution goes to the catch statement. If none of the statements in the try block throw an exception that can be caught, the catch clause is not run.

The order for the catch blocks is the order they appear. If it is impossible for one of the catch blocks to be executed, a compiler error about unreachable code occurs. This happens when a superclass is caught before a subclass. Remember, we warned you to pay attention to any subclass exceptions.

Exemple:

```Java
3: void explore() {
4:  try {
5:      fall();
6:      System.out.println("never get here");
7:  } catch (RuntimeException e) {
8:      getUp();
9:  }
10: seeAnimals();
11: }
12: void fall() { throw new RuntimeException(); }
```

- First, line 5 calls the fall() method.
- Line 12 throws an exception. This means Java jumps straight to the catch block, skipping line 6.
- The girl gets up on line 8.
- Now the try statement is over and execution proceeds normally with line 10.

Try statements are like methods in that the curly braces are required even if there is only one statement inside the code blocks. if statements and loops are special in this respect as they allow you to omit the curly braces.

What about this one?

```Java
try {// DOES NOT COMPILE
fall();
}
```

This code doesn’t compile because the try block doesn’t have anything after it. Remember, the point of a try statement is for something to happen if an exception is thrown. Without another clause, the try statement is lonely.

## Adding a finally block

![](resources/exceptions_finally.png "The syntax of a try statement with finally")

- order: try - catch - finally
- There must be a catch or finally block.
- Catch is not required if finally is present.

There are two paths through code with both a catch and a finally. If an exception is thrown, the finally block is run after the catch block. If no exception is thrown, the finally block is run after the try block completes.

```Java
12: void explore() {
13:     try {
14:         seeAnimals();
15:         fall();
16:     } catch (Exception e) {
17:         getHugFromDaddy();
18:     } finally {
19:         seeMoreAnimals();
20:     }
21:     goHome();
22: }
```

The girl falls on line 15:

1. If she gets up by herself, the code goes on to the finally block and runs line 19. Then the try statement is over and the code proceeds on line 21.
1. If the girl doesn’t get up by herself, she throws an exception. The catch block runs and she gets a hug on line 17. Then the try statement is over and the code proceeds on line 21.

Either way, the ending is the same. The finally block is executed and the try statement ends.

Expect to see examples like this on the OCA exam:

```Java
String s = "";
try {
    s += "t";
} catch(Exception e) {
    s += "c";
} finally {
    s += "f";
}
s += "a";
System.out.print(s);

// tfa
```

## System.exit

System.exit tells Java, “Stop. End the program right now. When System.exit is called in the try or catch block, finally does not run.