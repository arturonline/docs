# Creating Abstract Classes

An abstract class is a class that is marked with the abstract keyword and cannot be instantiated. An abstract method is a method marked with the abstract keyword defined in an
abstract class, for which no implementation is provided in the class in which it is declared.

```Java
public abstract class Animal {
    protected int age;
    public void eat() {
        System.out.println("Animal is eating");
    }
    public abstract String getName();
    }

public class Swan extends Animal {
    public String getName() {
        return "Swan";
    }
}
```

The first thing to notice about this sample code is that the Animal class is declared
abstract and Swan is not. Next, the member age and the method eat() are marked as
protected and public, respectively; therefore, they are inherited in subclasses such as Swan. Finally, the abstract method getName() is terminated with a semicolon and doesn’t provide a body in the parent class Animal. This method is implemented with the same name and
signature as the parent method in the Swan class.

## Defining an Abstract Class

- An abstract class is not required to include any abstract methods.
- An abstract method may only be defined in an abstract class.
- An abstract method does not provide an implementation in the class in which it is declared.
- Although you can’t provide a default implementation to an abstract method in an abstract class, you can still define a method with a body you just can’t mark it as abstract.
- An abstract class (or method) cannot be marked as final.
- An abstract method may not be marked as private

## Concrete Class

A concrete class is the **first** nonabstract subclass that extends an abstract class and is required to implement **all** inherited abstract methods.

## Extending an Abstract Class with another abstract

Abstract classes can extend other abstract classes and are not required to provide implementations for any of the abstract methods. It follows, then, that a concrete class that extends an abstract class must implement all inherited abstract methods.

For example, the following concrete class Lion must implement two methods, getName() and roar():

```Java
public abstract class Animal {
    public abstract String getName();
    }
public abstract class BigCat extends Animal {
    public abstract void roar();
    }
public class Lion extends BigCat {
    public String getName() {
        return "Lion";
    }
    public void roar() {
    System.out.println("The Lion lets out a loud ROAR!");
    }
}
```

In this sample code, BigCat extends Animal but is marked as abstract; therefore, it is
not required to provide an implementation for the getName() method. The class Lion is
not marked as abstract, and as the first concrete subclass, it must implement all inherited
abstract methods not defined in a parent class.

There is one exception to the rule for abstract methods and concrete classes: a concrete
subclass is not required to provide an implementation for an abstract method if an intermediate abstract class provides the implementation. 

For example, take a look at the following variation on our previous example:

```Java
public abstract class Animal {
    public abstract String getName();
    }
public abstract class BigCat extends Animal {
    public String getName() {
        return "BigCat";
    }
    public abstract void roar();
    }
public class Lion extends BigCat {
    public void roar() {
        System.out.println("The Lion lets out a loud ROAR!");
    }
}
```

In this example, BigCat provides an implementation for the abstract method getName() defined in the abstract Animal class. Therefore, Lion inherits only one abstract method,
roar(), and is not required to provide an implementation for the method getName().
Here’s one way to think about this: if an intermediate class provides an implementation
for an abstract method, that method is inherited by subclasses as a concrete method, not
as an abstract one. In other words, the subclasses do not consider it an inherited abstract
method because it is no longer abstract by the time it reaches the subclasses.

## Rules for abstract Classes and methods.

Abstract Class Definition Rules:

1. Abstract classes cannot be instantiated directly.
1. Abstract classes may be defined with any number, including zero, of abstract and nonabstract methods.
1. Abstract classes may not be marked as private or final.
1. An abstract class that extends another abstract class inherits all of its abstract methods as its own abstract methods.
1. The first concrete class that extends an abstract class must provide an implementation for all of the inherited abstract methods.

Abstract Method Definition Rules:

1. Abstract methods may only be defined in abstract classes.
1. Abstract methods may not be declared private or final.
1. Abstrac