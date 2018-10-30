# Class Inheritance

- By creating a new class that extends an existing class, you may gain access to a slew of inherited primitives, objects, and methods.
- By designing a standard interface for your application, you ensure that any class that implements the interface has certain required methods defined.
- By creating abstract class definitions, you’re defining a platform that other developers can extend and build on top of.

## Introducing Class Inheritance

Inheritance is the process by which the new child subclass automatically includes any **public** or **protected primitives**, **objects**, or **methods** defined in the parent class.

Java supports single inheritance, by which a class may inherit from only one direct parent class.

Java also supports multiple levels of inheritance, by which one class may extend another class, which in turn extends another class.

It is possible in Java to prevent a class from being extended by marking the class with the final modifer.

## Extending a Class

In Java, you can extend a class by adding the parent class name in the defnition using the extends keyword:

!["Defining and extending a class"](resources/extend.png)

you can apply access modifers (public, private, protected, default) to class definitions. For the OCA exam, you should only be familiar with **public** and **default** (package-level) class access modifiers.

- The **public** access modifer applied to a class indicates that it can be referenced and used in any class. There can be **at most** one public class or interface in a Java file.
- The **default package private modifer**, which is the lack of any access modifer, indicates the class can be accessed only by a subclass or class within the same package.

## Defining Constructors

In Java, the first statement of every constructor is either a call to another constructor within the class, using this(), or a call to a constructor in the direct parent class, using super():

```Java
public class Animal {
    private int age;
    public Animal(int age) {
        super();
        this.age = age;
    }
}
public class Zebra extends Animal {
    public Zebra(int age) {
    super(age);
    }
    public Zebra() {
    this(4);
    }
}
```

- In the first class, Animal, the first statement of the constructor is a call to the parent constructor defined in java.lang.Object, which takes no arguments.
- In the second class, Zebra, the first statement of the first constructor is a call to Animal’s constructor, which takes a single argument.
- The class Zebra also includes a second no-argument constructor that doesn’t call super() but instead calls the other constructor within the Zebra class using this(4)

The super() command may only be used as the first statement of the constructor. If the parent class has more than one constructor, the child class may use any valid parent constructor in its defnition, as shown in the following example:

```Java
public class Animal {
    private int age;
    private String name;
    public Animal(int age, String name) {
        super();
        this.age = age;
        this.name = name;
    }
public Animal(int age) {
    super();
    this.age = age;
    this.name = null;
    }
}

public class Gorilla extends Animal {
    public Gorilla(int age) {
    super(age,"Gorilla");
    }
    public Gorilla() {
    super(5);
    }
}
```

In this example, the first child constructor takes one argument, age, and calls the parent constructor, which takes two arguments, age and name. The second child constructor takes no arguments, and it calls the parent constructor, which takes one argument, age. In this example, notice that the child constructors are not required to call matching parent constructors. Any valid parent constructor is acceptable as long as the appropriate input parameters to the parent constructor are provided.

The Java compiler automatically inserts a call to the no-argument constructor super() if the first statement is not a call to the parent constructor. The compiler tries to insert a default no-argument constructor with a super() call, but if there is no parent constructor that takes no arguments the compiler stops. So we must create at least one constructor in our child class that explicitly calls a parent constructor via the super() command.

For example, the following three class and constructor defnitions are equivalent, because the compiler will automatically convert them all to the last example:

```Java
public class Donkey {
}

public class Donkey {
    public Donkey() {
    }
}

public class Donkey {
    public Donkey() {
        super();
    }
}
```

The next code doesn’t compile, because the compiler tries to insert the *noargument* super() as the first statement of the constructor in the Elephant class, and there is no such constructor in the parent class:

```Java
public class Mammal {
    public Mammal(int age) {
    }
}
public class Elephant extends Mammal { // DOES NOT COMPILE
}
```

## Reviewing Constructor Rules

Let’s review the rules we covered in this section:

1. The first statement of every constructor is a call to another constructor within the class using this(), or a call to a constructor in the direct parent class using super().
1. The super() call may not be used after the first statement of the constructor.
1. If no super() call is declared in a constructor, Java will insert a no-argument super() as the first statement of the constructor.
1. If the parent doesn’t have a no-argument constructor and the child doesn’t define any constructors, the compiler will throw an error and try to insert a default no-argument constructor into the child class.
1. If the parent doesn’t have a no-argument constructor, the compiler requires an explicit call to a parent constructor in each child constructor.

Make sure you understand these rules; the exam will often provide code that breaks one or many of these rules and therefore doesn’t compile.

## Calling Constructors

In Java, the parent constructor is always executed before the child constructor:

```Java
class Primate {
    public Primate() {
        System.out.println("Primate");
    }
}
class Ape extends Primate {
    public Ape() {
        System.out.println("Ape");
    }
}
public class Chimpanzee extends Ape {
    public static void main(String[] args) {
        new Chimpanzee();
    }
}
```

- The compiler first inserts the super() command as the first statement of both the Primate and Ape constructors.
- Next, the compiler inserts a default no-argument constructor in the Chimpanzee class with super() as the first statement of the constructor. The code will execute with the parent constructors called first and yields the following output:

  - Primate
  - Ape

## Calling Inherited Class Members

Java classes may use any public or protected member of the parent class, including methods, primitives, or object references. If the parent class and child class are part of the same package, the child class may also use any default members defined in the parent class. Finally, a child class may never access a private member of the parent class. To reference a member in a parent class, you can just call it directly, as in the following example with the output function displaySharkDetails():

```Java
class Fish {
    protected int size;
    private int age;
    public Fish(int age) {
        this.age = age;
    }
    public int getAge() {
        return age;
    }
}
public class Shark extends Fish {
    private int numberOfFins = 8;
    public Shark(int age) {
        super(age);
        this.size = 4;
}
public void displaySharkDetails() {
    System.out.print("Shark with age: "+ getAge());
    System.out.print(" and "+ size +" meters long");
    System.out.print(" with "+ numberOfFins +" fins");
    }
}
```

In the child class, we use the public method getAge() and protected member size to access values in the parent class. You may also use this to access members of the parent class that are accessible from the child class, since a child class inherits all of its parent members.

### super() vs super.

The exam may try to trick you by using both super() and super in a constructor. 

- **super()** is a statement that explicitly calls a parent constructor and may only be used in the first line of a constructor of a child class.
- **super.** is a keyword used to reference a member defined in a parent class and may be used throughout the child class.

exemple:

```Java
public Rabbit(int age) {
    super; // DOES NOT COMPILE
    super().setAge(10); // DOES NOT COMPILE
}
```