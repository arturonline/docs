# Polimorphic Parameters

One of the most useful applications of polymorphism is the ability to pass instances of a subclass or interface to a method. For example, you can define a method that takes an
instance of an interface as a parameter. In this manner, any class that implements the interface can be passed to the method. Since you’re casting from a subtype to a supertype, an explicit cast is not required. This property is referred to as polymorphic parameters of a method, and we demonstrate it in the following example:

```Java
public class Reptile {
    public String getName() {
        return "Reptile";
    }
}
public class Alligator extends Reptile {
    public String getName() {
        return "Alligator";
    }
}
public class Crocodile extends Reptile {
    public String getName() {
        return "Crocodile";
    }
}
public class ZooWorker {
    public static void feed(Reptile reptile) {
        System.out.println("Feeding reptile "+ reptile.getName());
    }
    public static void main(String[] args) {
        feed(new Alligator());
        feed(new Crocodile());
        feed(new Reptile());
    }
}
```

This code compiles and executes without issue, yielding the following output:

Feeding: Alligator

Feeding: Crocodile

Feeding: Reptile