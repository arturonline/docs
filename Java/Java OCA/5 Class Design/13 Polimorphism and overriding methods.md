# polymorphism and Method Overriding

Let’s conclude this chapter by returning to the last three rules for method overriding to
demonstrate how polymorphism requires them to be included as part of the Java specifcation. You’ll see that without such rules in place, it is easy to construct an example with polymorphism in Java.

- **The first rule is that an overridden method must be at least as accessible as the method it is overriding.** Let’s assume this rule is not necessary and consider the following example:

```Java
public class Animal {
    public String getName() {
        return "Animal";
    }
}
public class Gorilla extends Animal {
    protected String getName() { // DOES NOT COMPILE
        return "Gorilla";
    }
}
public class ZooKeeper {
    public static void main(String[] args) {
        Animal animal = new Gorilla();
        System.out.println(animal.getName());
    }
}
```

*For the purpose of this discussion, we’ll ignore the fact that the implementation of getName() in the Gorilla class doesn’t compile because it is less accessible than the version it is overriding in the Animal class.*

As you can see, this example creates an ambiguity problem in the ZooKeeper class. The reference animal.getName() is allowed because the method is public in the Animal class, but due to polymorphism, the Gorilla object itself has been overridden with a less accessible version, not available to the ZooKeeper class. This creates a contradiction in that the compiler should not allow access to this method, but because it is being referenced as an instance of Animal, it is allowed. Therefore, Java eliminates this contradiction, thus disallowing a method from being overridden by a less accessible version of the method.

- **Aa subclass cannot declare an overridden method with a new or broader exception than in the superclass**, since the method may be accessed using a reference to the superclass. For example, if an instance of the subclass is passed to a method using a superclass reference, then the enclosing method would not know about any new checked exceptions that exist on methods for this object, potentially leading to compiled code with “unchecked” checked exceptions. Therefore, the Java compiler disallows overriding methods with new or broader exceptions.

- **Finally, overridden methods must use covariant return types** for the same kinds of reasons as just discussed. If an object is cast to a superclass reference and the overridden method is called, the return type must be compatible with the return type of the parent method. If the return type in the child is too broad, it will result an inherent cast exception when accessed through the superclass reference.

For example, if the return type of a method is Double in the parent class and is overridden in a subclass with a method that returns Number, a superclass of Double, then the subclass method would be allowed to return any valid Number, including Integer, another subclass of Number. If we are using the object with a reference to the superclass, that means an Integer could be returned when a Double was expected. Since Integer is not a subclass of Double, this would lead to an implicit cast exception as soon as the value was referenced. Java solves this problem by only allowing covariant return types for overridden methods.
