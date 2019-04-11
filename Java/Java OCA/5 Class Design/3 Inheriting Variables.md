# Inheriting Variables

Java doesn’t allow variables to be overridden but instead hidden.

## Hiding Variables

When you hide a variable, you define a variable with the same name as a variable in a parent class. This creates two copies of the variable within an instance of the child class: one instance defined for the parent reference and another defined for the child reference.

As when hiding a static method, you can’t override a variable; you can only hide it. Also
similar to hiding a static method, the rules for accessing the parent and child variables are quite similar.

- If you’re referencing the variable from within the parent class, the variable defined in the parent class is used. 
- Alternatively, if you’re referencing the variable from within a child class, the variable defined in the child class is used. Likewise, you can reference the parent value of the variable with an explicit use of the super keyword.

Consider the following example:

```Java
public class Rodent {
    protected int tailLength = 4;
    public void getRodentDetails() {
        System.out.println("[parentTail="+ tailLength +"]");
    }
}
public class Mouse extends Rodent {
    protected int tailLength = 8;
    public void getMouseDetails() {
        System.out.println("[tail="+ tailLength +",parentTail=" + super.tailLength +"]");
    }
    public static void main(String[] args) {
        Mouse mouse = new Mouse();
        mouse.getRodentDetails();
        mouse.getMouseDetails();
    }
}
```

This code compiles without issue and outputs the following when executed:

[parentTail=4]

[tail=8,parentTail=4]

Notice that the instance of Mouse contains two copies of the tailLength variables: one
defined in the parent and one defined in the child. These instances are kept separate from
each other, allowing our instance of Mouse to reference both tailLength values independently. In the first method call, getRodentDetails(), the parent method outputs the parent value of the tailLength variable. In the second method call, getMouseDetails(), the child method outputs both the child and parent version of the tailLength variables, using the super keyword to access the parent variable’s value.

The important thing to remember is that there is no notion of overriding a member variable. For example, there is no code change that could be made to cause Java to override the
value of tailLength, making it the same in both parent and child. These rules are the same
regardless of whether the variable is an instance variable or a static variable.