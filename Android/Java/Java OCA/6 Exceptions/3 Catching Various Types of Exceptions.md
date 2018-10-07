# Catching various types of exceptions

The OCA exam can define basic exceptions to show you the hierarchy. You only need to do two things with this information:

- First, you must be able to recognize if the exception is a checked or an unchecked exception.
- Second, you need to determine if any of the exceptions are subclasses of the others.

```Java
class AnimalsOutForAWalk extends RuntimeException { }
class ExhibitClosed extends RuntimeException { }
class ExhibitClosedForLunch extends ExhibitClosed { }
```

In this example, there are three custom exceptions. All are unchecked exceptions because they directly or indirectly extend RuntimeException. Now we catch both types of exceptions and handle them by printing out the appropriate message:

```Java
public void visitPorcupine() {
    try {
        seeAnimal();
    } catch (AnimalsOutForAWalk e) {// first catch block
        System.out.print("try back later");
    } catch (ExhibitClosed e) {// second catch block
        System.out.print("not today");
    }
}

```

There are three possibilities for when this code is run:

- If seeAnimal() doesn’t throw an exception, nothing is printed out.
- If the animal is out for a walk, only the first catch block runs.
- If the exhibit is closed, only the second catch block runs.

A rule exists for the order of the catch blocks. Java looks at them in the order they
appear. If it is impossible for one of the catch blocks to be executed, a compiler error
about unreachable code occurs. This happens when a superclass is caught before a subclass.

```Java
public void visitMonkeys() {
    try {
        seeAnimal();
    } catch (ExhibitClosedForLunch e) {// subclass exception
        System.out.print("try back later");
    } catch (ExhibitClosed e) {// superclass exception
        System.out.print("not today");
    }
}
```

If the more specific ExhibitClosedForLunch exception is thrown, the first catch block runs. If not, Java checks if the superclass ExhibitClosed exception is thrown and catches it.

```Java
public void visitMonkeys() {
    try {
        seeAnimal();
    } catch (ExhibitClosed e) {
        System.out.print("not today");
    } catch (ExhibitClosedForLunch e) {// DOES NOT COMPILE
        System.out.print("try back later");
    }
}
```

If the more specific ExhibitClosedForLunch exception is thrown, the catch block for ExhibitClosed runs which means there is no way for the second catch block to ever run. Java correctly tells us there is an unreachable catch block.

## Throwing a Second Exception

A catch or finally block can have any valid Java code in it including another try statement. Only the last exception to be thrown matters.

```Java
16: public static void main(String[] args) {
17:     FileReader reader = null;
18:     try {
19:         reader = read();
20:     } catch (IOException e) {
21:         try {
22:             if (reader != null) reader.close();
23:         } catch (IOException inner) {
24:         }
25:     }
26: }
27: private static FileReader read() throws IOException {
28: // CODE GOES HERE
29: }
```

- The easiest case is if line 28 doesn’t throw an exception. Then the entire catch block on lines 20–25 is skipped.
- Next, consider if line 28 throws a NullPointerException. That isn’t an IOException, so the catch block on lines 20–25 will still be skipped.
- If line 28 does throw an IOException, the catch block on lines 20–25 does get run. 
- Line 22 tries to close the reader. If that goes well, the code completes and the main() method ends normally. If the close() method does throw an exception, Java looks for more catch blocks. There aren’t any, so the main method throws that new exception. Regardless, the exception on line 28 is handled. A different exception might be thrown, but the one from line 28 is done.

```Java
26: try {
27: throw new RuntimeException();
28: } catch (RuntimeException e) {
29: throw new RuntimeException();
30: } finally {
31: throw new Exception();
32: }
```

- Line 27 throws an exception, which is caught on line 28.
- The catch block then throws an exception on line 29.
- If there were no finally block, the exception from line 29 would be thrown. However, the finally block runs after the try block. **Since the finally block throws an exception of its own on line 31, this one gets thrown. The exception from the catch block gets forgotten about.** This is why you often see another try/catch inside a finally block—to make sure it doesn’t mask the exception from the catch block.

Next we are going to show you the hardest example you can be asked related to exceptions. What do you think this method returns? Go slowly. It’s tricky.

```Java
30: public String exceptions() {
31:     String result = "";
32:     String v = null;
33:     try {
34:         try {
35:             result += "before";
36:             v.length();
37:             result += "after";
38:         } catch (NullPointerException e) {
39:             result += "catch";
40:             throw new RuntimeException();
41:         } finally {
42:             result += "finally";
43:             throw new Exception();
44:         }
45:     } catch (Exception e) {
46:             result += "done";
47:     }
48:     return result;
49: }

// before catch finally done
```

- Everything is normal up until line 35, when "before" is added.
- Line 36 throws a NullPointerException.
- Line 37 is skipped as Java goes straight to the catch block.
- Line 38 does catch the exception, and "catch" is added on line 39.
- Then line 40 throws a RuntimeException.
- The finally block runs after the catch regardless of whether an exception is thrown; it adds "finally" to result.
- At this point, we have completed the inner try statement that ran on lines 34–44.
- The outer catch block then sees an exception was thrown and catches it on line 45; it adds "done" to result.