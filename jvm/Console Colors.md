# TIP: add console colors

If your terminal supports it, you can use ANSI escape codes to use color in your output.

For example, you could define constants like these for the colors:

```java
public static final String ANSI_RESET = "\u001B[0m";
public static final String ANSI_BLACK = "\u001B[30m";
public static final String ANSI_RED = "\u001B[31m";
public static final String ANSI_GREEN = "\u001B[32m";
public static final String ANSI_YELLOW = "\u001B[33m";
public static final String ANSI_BLUE = "\u001B[34m";
public static final String ANSI_PURPLE = "\u001B[35m";
public static final String ANSI_CYAN = "\u001B[36m";
public static final String ANSI_WHITE = "\u001B[37m";
```

Then, you could reference those as necessary.

For example, using the above constants, you could make the following red text output on supported terminals:

```java
System.out.println(ANSI_RED + "This text is red!" + ANSI_RESET);
```