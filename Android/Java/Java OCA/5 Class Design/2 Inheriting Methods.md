# Inheriting Methods

Inheriting a class grants us access to the public and protected members of the parent class.

## Overriding a Method

What if there is a method defined in both the parent and child class?

```Java
public class Canine {
    public double getAverageWeight() {
    return 50;
    }
}
public class Wolf extends Canine {
    public double getAverageWeight() {
        return super.getAverageWeight() + 20;
    }
    public static void main(String[] args) {
        System.out.println(new Canine().getAverageWeight());
        System.out.println(new Wolf().getAverageWeight());
        }
}
// 50.00
// 70.00
```

Overriding a method is not without limitations, though. The compiler performs the following checks when you override a nonprivate method:

1. The method in the child class must have the same signature as the method in the parent class.
1. The method in the child class must be at least as accessible or more accessible than the method in the parent class.
1. The method in the child class may not throw a checked exception that is new or broader than the class of any exception thrown in the parent class method.
1. If the method returns a value, it must be the same or a subclass of the method in the parent class, known as covariant return types

### Overloading vs Overriding

Overloading a method and overriding differ in that an overloaded method will use a different signature than an overridden method (the name and list of input parameters.)

```Java
public class Bird {
    public void fly() {
        System.out.println("Bird is flying");
    }
    public void eat(int food) {
        System.out.println("Bird is eating "+food+" units of food");
    }
}
public class Eagle extends Bird {
    public int fly(int height) {
        System.out.println("Bird is flying at "+height+" meters");
        return height;
    }
    public int eat(int food) { // DOES NOT COMPILE
        System.out.println("Bird is eating "+food+" units of food");
        return food;
    }
}
```

- The first method, **fly()**, is overloaded in the subclass Eagle, since the signature changes from a no-argument constructor to a constructor with one int argument. Because the method is being overloaded and not overridden, the return type can be changed from void to int without issue.
- The second method, **eat()**, is overridden in the subclass Eagle, since the signature is the same as it is in the parent class Bird—they both take a single argument int. Because the method is being overridden, the return type of the method in Eagle must be a subclass of the return type of the method in Bird.
- In this example, the return type void is not a subclass of int; therefore, the compiler will throw an exception on this method definition.

Any time you see a method on the exam with the same name as a method in the parent class, determine whether the method is being overloaded or overridden first; doing so will help you with questions about whether the code will compile.

### Redeclaring private methods

Java permits you to redeclare a new method in the child class with the same or modifed signature as the method in the parent class. This method in the child class is a separate and independent method, unrelated to the parent version’s method, so none of the rules for overriding methods are invoked.

### Hiding Static Methods

A hidden method occurs when a child class defines a static method with the same name and signature as a static method defined in a parent class. Method hiding is similar but not exactly the same as method overriding. First, the four previous rules for overriding a method must be followed when a method is hidden. In addition, a new rule is added for hiding a method, namely that the usage of the static keyword must be the same between parent and child classes. The following list summarizes the five rules for hiding a method:

1. The method in the child class must have the same signature as the method in the parent class.
1. The method in the child class must be at least as accessible or more accessible than the method in the parent class.
1. The method in the child class may not throw a checked exception that is new or broader than the class of any exception thrown in the parent class method.
1. If the method returns a value, it must be the same or a subclass of the method in the parent class, known as covariant return types.
1. The method defined in the child class must be marked as static if it is marked as static in the parent class (method hiding). Likewise, the method must not be marked as static in the child class if it is not marked as static in the parent class (method overriding).

Note that the first four are the same as the rules for overriding a method.
Let’s review some examples of the new rule:

```Java
public class Bear {
    public static void eat() {
        System.out.println("Bear is eating");
    }
}
public class Panda extends Bear {
    public static void eat() {
        System.out.println("Panda bear is chewing");
    }
    public static void main(String[] args) {
        Panda.eat();
    }
}
```

In this example, the code compiles and runs without issue. The eat() method in the child class hides the eat() method in the parent class. Because they are both marked as static, this is not considered an overridden method. Let’s contrast this with examples that violate the fifth rule:

```Java
public class Bear {
    public static void sneeze() {
        System.out.println("Bear is sneezing");
    }
    public void hibernate() {
        System.out.println("Bear is hibernating");
    }
}
public class Panda extends Bear {
    public void sneeze() { // DOES NOT COMPILE
        System.out.println("Panda bear sneezes quietly");
    }
    public static void hibernate() { // DOES NOT COMPILE
        System.out.println("Panda bear is going to sleep");
    }
}
```

- In this example, sneeze() is marked as static in the parent class but not in the child class. The compiler detects that you’re trying to override a method that should be hidden and generates a compiler error.
- In the second method, hibernate() is an instance member in the parent class but a static method in the child class. In this scenario, the compiler thinks that you’re trying to hide a method that should be overridden and also generates a compiler error.

## Overriding vs. Hiding Methods

 Unlike overriding a method, in which a child method replaces the parent method in calls defined in both the parent and child, hidden methods only replace parent methods in the calls defined in the child class.

At runtime the child version of an overridden method is always executed for an instance regardless of whether the method call is defined in a parent or child class method. In this manner, the parent method is never used unless an explicit call to the parent method is referenced, using the syntax parentClassName.method(). Alternatively, at runtime the parent version of a hidden method is always executed if the call to the method is defined in the parent class. Let’s take a look at an example:

```Java
public class Marsupial {
    public static boolean isBiped() {
        return false;
    }
    public void getMarsupialDescription() {
        System.out.println("Marsupial walks on two legs: "+isBiped());
    }
}
public class Kangaroo extends Marsupial {
    public static boolean isBiped() {
        return true;
    }
    public void getKangarooDescription() {
        System.out.println("Kangaroo hops on two legs: "+isBiped());
    }
    public static void main(String[] args) {
        Kangaroo joey = new Kangaroo();
        joey.getMarsupialDescription();
        joey.getKangarooDescription();
    }
}
```

In this example, the code compiles and runs without issue, outputting the following:

- Marsupial walks on two legs: false
- Kangaroo hops on two legs: true

Notice that isBiped() returns false in the parent class and true in the child class.

In the first method call, the parent method getMarsupialDescription() is used. The Marsupial class only knows about isBiped() from its own class defnition, so it outputs false. In the second method call, the child executes a method of isBiped(), which hides the parent method’s version and returns true.
Contrast this first example with the following example, which uses an overridden version of isBiped() instead of a hidden version:

```Java
class Marsupial {
public boolean isBiped() {
return false;
}
public void getMarsupialDescription() {
System.out.println("Marsupial walks on two legs: "+isBiped());
}
}
public class Kangaroo extends Marsupial {
public boolean isBiped() {
return true;
}
public void getKangarooDescription() {
System.out.println("Kangaroo hops on two legs: "+isBiped());
}
public static void main(String[] args) {
Kangaroo joey = new Kangaroo();
joey.getMarsupialDescription();
joey.getKangarooDescription();
}
}
```

This code also compiles and runs without issue, but it outputs slightly different text:

- Marsupial walks on two legs: true
- Kangaroo hops on two legs: true

In this example, the isBiped() method is overridden, not hidden, in the child class. Therefore, it is replaced at runtime in the parent class with the call to the child class’s method. Make sure you understand these examples as they show how hidden and overridden methods are fundamentally different.