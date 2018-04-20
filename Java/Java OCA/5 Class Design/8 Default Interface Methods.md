# Default Interface Methods

A default method is a method defined within an interface with the default keyword in which a method body is provided.

A default method within an interface defines an abstract method with a default implementation. In this manner, classes have the option to override the default method if they need to, but they are not required to do so.

The following are the default interface method rules you need to be familiar with:

1. A default method may only be declared within an interface and not within a class or abstract class.
1. A default method must be marked with the default keyword. If a method is marked as default, it must provide a method body.
1. A default method is not assumed to be static, final, or abstract, as it may be used or overridden by a class that implements the interface.
1. Like all methods in an interface, a default method is assumed to be public and will not compile if marked as private or protected.

## Default Methods and Multiple Inheritance

If a class implements two interfaces that have default methods with the same name and signature, the compiler will throw an error:

```Java
public interface Walk {
    public default int getSpeed() {
        return 5;
    }
}
public interface Run {
    public default int getSpeed() {
        return 10;
    }
}
public class Cat implements Walk, Run { // DOES NOT COMPILE
    public static void main(String[] args) {
        System.out.println(new Cat().getSpeed());
    }
}
```

There is an exception to this rule, though: if the subclass overrides the duplicate default methods, the code will compile without issue:

```Java
public class Cat implements Walk, Run {
    public int getSpeed() {
        return 1;
    }
public static void main(String[] args) {
    System.out.println(new Cat().getSpeed());
    }
}
```

