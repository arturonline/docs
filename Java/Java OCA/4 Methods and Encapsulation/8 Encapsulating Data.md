# Encapsulating Data

Encapsulation means we set up the class so only methods in the class can refer to the instance variables. For encapsulation, data (an instance variable) is private and getters/setters are public:

```Java
1: public class Swan {
2:  private int numberEggs; // private
3:  public int getNumberEggs() { // getter
4:      return numberEggs;
5: }
6: public void setNumberEggs(int numberEggs) { // setter
7:  if (numberEggs >= 0) // guard condition
8:      this.numberEggs = numberEggs;
9: } }
```

In this exemple the setter has an if statement to prevent setting the instance variable to an invalid value.

![](resources/naming.png "Java components naming conventions")

## Creating inmutable Classes

Encapsulating data prevents callers from making changes to your class so you know they will always be the same.

```Java
public class ImmutableSwan {
    private int numberEggs;
    public ImmutableSwan(int numberEggs) {
        this.numberEggs = numberEggs;
}
public int getNumberEggs() {
    return numberEggs;
} }
```

In this example, we don't have a setter. We do have a constructor that allows a value to be set. Remember, immutable is only measured after the object is constructed. Immutable classes are allowed to have values. They just can't change after instantiation.

To review, encapsulation refers to preventing callers from changing the instance variables
directly. Immutability refers to preventing callers from changing the instance variables at all.