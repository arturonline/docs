# Calling Methods That Throw Exceptions

```Java
class NoMoreCarrotsException extends Exception {}
public class Bunny {
    public static void main(String[] args) {
        eatCarrot();// DOES NOT COMPILE
    }
    private static void eatCarrot() throws NoMoreCarrotsException {
    }
}
```

Checked exceptions must be handled or declared. The code would compile if we changed the main()
method to either of these:

```Java
public static void main(String[] args) throws NoMoreCarrotsException {// declare exception
    eatCarrot();
}
public static void main(String[] args) {
    try {
        eatCarrot();
    } catch (NoMoreCarrotsException e ) {// handle exception
        System.out.print("sad rabbit");
    }
}
```

You might have noticed that *eatCarrot()* didn’t actually throw an exception; it just declared that it could. This is enough for the compiler to require the caller to handle or declare the exception.

The compiler is still on the lookout for unreachable code. Declaring an unused exception
isn’t considered unreachable code. It gives the method the option to change the implementation to throw that exception in the future. Do you see the issue here?

```Java
public void bad() {
    try {
        eatCarrot();
    } catch (NoMoreCarrotsException e ) {// DOES NOT COMPILE
        System.out.print("sad rabbit");
    }
}
public void good() throws NoMoreCarrotsException {
    eatCarrot();
}
private static void eatCarrot() { }
```

Java knows that eatCarrot() can’t throw a checked exception—which means there’s no way for the catch block in bad() to be reached. In comparison, good() is free to declare other exceptions.

## Subclasses

### With checked Exceptions

When a class overrides a method from a superclass or implements a method from an interface, it’s not allowed to add new **checked exceptions** to the method signature. For example, this code isn’t allowed:

```Java
class CanNotHopException extends Exception { }
class Hopper {
    public void hop() { }
}
class Bunny extends Hopper {
    public void hop() throws CanNotHopException { } // DOES NOT COMPILE
}
```

Java knows hop() isn’t allowed to throw any checked exceptions because the superclass Hopper doesn’t declare any.

A subclass is allowed to declare fewer exceptions than the superclass or interface. This is
legal because callers are already handling them.

```Java
class Hopper {
    public void hop() throws CanNotHopException { }
}
class Bunny extends Hopper {
    public void hop() { }
}
```

A subclass not declaring an exception is similar to a method declaring it throws an exception that it never actually throws. This is perfectly legal. Similarly, a class is allowed to declare a subclass of an exception type. The idea is the same. The superclass or interface has already taken care of a broader type. Here’s an example:

```Java
class Hopper {
    public void hop() throws Exception { }
}
class Bunny extends Hopper {
    public void hop() throws CanNotHopException { }
}
```

### With unchecked exceptions

Methods are free to throw any **runtime exceptions** they want without mentioning them in the method declaration.

```Java
class Hopper {
    public void hop() { }
}
class Bunny extends Hopper {
    public void hop() throws IllegalStateException { }
}
```

