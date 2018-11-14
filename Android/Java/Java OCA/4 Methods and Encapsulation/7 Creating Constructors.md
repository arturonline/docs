# Creating Constructors

A constructor is a special method that matches the name of the class and has no return type:

```Java
public class Bunny {
    public Bunny() {
        System.out.println("constructor");
    }
}
```

Now let's look at some examples that aren't common but that you might see on the
exam:

```Java
1: public class Bunny {
2:  private String color;
3:  private int height;
4:  private int length;
5:  public Bunny(int length, int theHeight) {
6:      length = this.length; // backwards – no good!
7:      height = theHeight; // fine because a different name
8:      this.color = "white"; // fine, but redundant
9:  }
10: public static void main(String[] args) {
11:     Bunny b = new Bunny(1, 2);
12:     System.out.println(b.length + " " + b.height + " " + b.color);
13:    } }
```

- Line 6 is incorrect and you should watch for it on the exam. The instance variable length starts out with a 0 value. That 0 is assigned to the method parameter length. The instance variable stays at 0. 
- Line 7 is more straightforward. The parameter the Height and instance variable height have different names. Since there is no naming collision, this is not required.
- Finally, line 8 shows that it is allowed to use this even when there is no duplication of variable names.

## Default Constructor

Every class in Java has a constructor whether you code one or not. If you don’t include any constructors in the class, Java will create one for you without any parameters. The default constructor has an empty parameter list and an empty body.

Having a private constructor in a class tells the compiler not to provide a default no-argument constructor. It also prevents other classes from instantiating the class.

```Java
class Rabbit4 {
    private Rabbit4() { }
    }
// some code
    public static void main(String[] args) {
        Rabbit4 r4 = new Rabbit4(); // DOES NOT COMPILE
// ...
```

## Overloading Constructors

You can have multiple constructors in the same class as long as they have different parameters.

```Java
public class Hamster {
    private String color;
    private int weight;
    public Hamster(int weight) { // first constructor
        this.weight = weight;
        color = "brown";
    }
    public Hamster(int weight, String color) { // second constructor
        this.weight = weight;
        this.color = color;
    }
}
```

Overloaded constructors often call each other. One common technique is to have each constructor add one parameter until getting to the constructor that does all the work:

```Java
public Hamster(int weight) {
this(weight, "brown");
}
```

**this()** has one special rule you need to know. If you choose to call it, the this() call
must be the frst noncommented statement in the constructor.

## Order of Initialization

1. If there is a superclass, initialize it first.
1. Static variable declarations and static initializers in the order they appear in the file.
1. Instance variable declarations and instance initializers in the order they appear in the file.
1. The constructor.

Exemple 1:

```Java
1: public class InitializationOrderSimple {
2:  private String name = "Torchie";
3:  { System.out.println(name); }
4:  private static int COUNT = 0;
5:  static { System.out.println(COUNT); }
6:  static { COUNT += 10; System.out.println(COUNT); }
7:  public InitializationOrderSimple() {
8:  System.out.println("constructor");
9: } }
1: public class CallInitializationOrderSimple {
2:  public static void main(String[] args) {
3:      InitializationOrderSimple init = new InitializationOrderSimple();
4: } }
```

The output is:
0
10
Torchie
constructor

- Rule 1 doesn't apply because there is no superclass. 
- Rule 2 says to run the static variable declarations and static initializers—in this case, lines 5 and 6, which output 0 and 10.
- Rule 3 says to run the instance variable declarations and instance initializers—here, lines 2 and 3, which output Torchie.
- Finally, rule 4 says to run the constructor—here, lines 7–9, which output constructor.

Exemple 2: 

The next example is a little harder. Keep in mind that the four rules apply only if an object is instantiated. If the class is referred to without a new call, only rules 1 and 2 apply. The other two rules relate to instances and constructors. They have to wait until there is code to instantiate the object. What do you think happens here?

```java
1: public class InitializationOrder {
2:   private String name = "Torchie";
3:  { System.out.println(name); }
4:  private static int COUNT = 0;
5:  static { System.out.println(COUNT); }
6:  { COUNT++; System.out.println(COUNT); }
7:  public InitializationOrder() {
8:      System.out.println("constructor");
9: }
10: public static void main(String[] args) {
11:     System.out.println("read to construct");
12:     new InitializationOrder();
13:     }
14: }
```

The output looks like this:

0

read to construct

Torchie

1

constructor

- Again, rule 1 doesn’t apply because there is no superclass.
- Rule 2 tells us to look at the static variables and static initializers—lines 4 and 5, in that order. Line 5 outputs 0. Now that the statics are out of the way, the main() method can run.
- Next, we can use rule 3 to run the instance variables and instance initializers. Here that is lines 2 and 3, which output Torchie.
- Finally, rule 4 says to run the constructor—in this case, lines 7–9, which output constructor.

Exemple 3: 

```Java
1: public class YetMoreInitializationOrder {
2:  static { add(2); }
3:  static void add(int num) { System.out.print(num + " "); }
4:  YetMoreInitializationOrder() { add(5); }
5:  static { add(4); }
6:  { add(6); }
7:  static { new YetMoreInitializationOrder(); }
8:  { add(8); }
9:  public static void main(String[] args) { } }
```

The correct answer is 2 4 6 8 5.

- There is no superclass, so we jump right to rule 2—the statics.
- There are three static blocks: on lines 2, 5, and 7. They run in that order. The static block on line 2 calls the add() method, which prints 2.
- The static block on line 5 calls the add() method, which prints 4.
- The last static block, on line 7, calls new to instantiate the object. This means we can go on to rule 3 to look at the instance variables and instance initializers. There are two of those: on lines 6 and 8. They both call the add() method and print 6 and 8, respectively.
- Finally, we go on to rule 4 and call the constructor, which calls the add() method one more time and prints 5.