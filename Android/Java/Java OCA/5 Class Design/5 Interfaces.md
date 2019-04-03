# Implementing Interfaces

An interface is an abstract data type that defines a list of abstract public methods that any class implementing the interface must provide. An interface can also include a list of constant variables and default methods.

**Definition**:
![](resources/interfaces1.png "Defining an interface")
**Implementation**:
![](resources/interfaces2.png "Implementing an interface")

Notice that the method modifers in this example, abstract and public, are assumed. In other words, whether or not you provide them, the compiler will automatically insert them as part of the method definition.

## Defining an Interface

The following is a list of rules for creating an interface, many of which you should recognize as adaptions of the rules for defining abstract classes.

1. Interfaces cannot be instantiated directly.
1. An interface is not required to have any methods.
1. An interface can not be marked as final.
1. All top-level interfaces are assumed to have public or default access, and they must include the abstract modifier in their definition. Therefore, marking an interface as private, protected, or final will trigger a compiler error, since this is incompatible with these assumptions.
1. All nondefault methods in an interface are assumed to have the modifiers abstract and public in their definition. Therefore, marking a method as private, protected, or final will trigger compiler errors as these are incompatible with the abstract and public keywords.

The first three rules are identical to the first three rules for creating an abstract class.

Exemple:

```java
public interface WalksOnTwoLegs {}

public class TestClass {
    public static void main(String[] args) {
        // an interface and cannot be instantiated directly.
        WalksOnTwoLegs example = new WalksOnTwoLegs(); // DOES NOT COMPILE
    }
}
public final interface WalksOnEightLegs { // DOES NOT COMPILE
}
```

The following two interface definitions are equivalent, as the compiler will convert them both to the second example:

```Java
public interface CanFly {
    void fly(int speed);
    abstract void takeoff();
    public abstract double dive();
}
```

```Java
public abstract interface CanFly {
    public abstract void fly(int speed);
    public abstract void takeoff();
    public abstract double dive();
}
```

## Inheriting an Interface

- An Interface may be extended using the extend keyword.
- An interface may extend multiple interfaces.

There are two inheritance rules you should keep in mind when extending an interface:

1. An interface that extends another interface, as well as an abstract class that implements an interface, inherits all of the abstract methods as **its own** abstract methods.
1. The first concrete class that implements an interface, or extends an abstract class that implements an interface, must provide an implementation for all of the inherited abstract methods.

Exemple:

```Java
public interface HasTail {
    public int getTailLength();
}
public interface HasWhiskers {
    public int getNumberOfWhiskers();
}
public interface Seal extends HasTail, HasWhiskers {
}
```

Any class that implements the Seal interface must provide an implementation for all methods in the parent interfaces—in this case, **getTailLength()** and **getNumberOfWhiskers()**.

## Abstract class implementing an interface

When an abstract class implements an interface, the abstract class is treated in the same way as an interface extending another interface. In other words, the abstract class inherits the abstract methods of the interface but is not required to implement them. That said, like an abstract class, the first concrete class to extend the abstract class must implement all the inherited abstract methods of the interface.

Exemple:

```Java
public interface HasTail {
    public int getTailLength();
}
public interface HasWhiskers {
    public int getNumberOfWhiskers();
}
public abstract class HarborSeal implements HasTail, HasWhiskers {
}
public class LeopardSeal implements HasTail, HasWhiskers { // DOES NOT COMPILE
}
```

In this example, we see that HarborSeal is an abstract class and compiles without issue. Any class that extends HarborSeal will be required to implement all of the methods in the HasTail and HasWhiskers interface. Alternatively, LeopardSeal is not an abstract class, so it must implement all the interface methods within its defnition. In this example, LeopardSeal doesn’t provide an implementation for the interface methods, so the code doesn’t compile.

## Tips n tricks

Although a class can implement an interface, a class cannot extend an interface. Likewise, whereas an interface can extend another interface, an interface cannot implement another interface.

```Java
public interface CanRun {}
public class Cheetah extends CanRun {} // DOES NOT COMPILE
public class Hyena {}
public interface HasFur extends Hyena {} // DOES NOT COMPILE
```

The first example shows a class trying to extend an interface that doesn’t compile. The second example shows an interface trying to extend a class, which also doesn’t compile.