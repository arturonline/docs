# Abstract Methods and Multiple inheritance

Since Java allows for multiple inheritance via interfaces, you might be wondering what will happen if you define a class that inherits from two interfaces that contain the same abstract method.

- **Case 1:** Two methods with same method signature:

```Java
public interface Herbivore {
    public void eatPlants();
}
public interface Omnivore {
    public void eatPlants();
    public void eatMeat();
}
```

In this case, creating a class that implements one of the two methods automatically implements the second method.

```Java
public class Bear implements Herbivore, Omnivore {
    public void eatMeat() {
        System.out.println("Eating meat");
    }
    public void eatPlants() {
        System.out.println("Eating plants");
    }
}
```

- **Case 2:** Two methods with the same name but the input parameters are different:

```Java
public interface Herbivore {
    public int eatPlants(int quantity);
}
public interface Omnivore {
    public void eatPlants();
}
public class Bear implements Herbivore, Omnivore {
    public int eatPlants(int quantity) {
        System.out.println("Eating plants: "+quantity);
        return quantity;
    }
    public void eatPlants() {
        System.out.println("Eating plants");
    }
}
```

In this example, we see that the class that implements both interfaces must provide implements of both versions of eatPlants(), since they are considered separate methods.

- **Case 3:** The method name and input parameters are the same but the return types are different between the two methods. In this case the class or interface attempting to inherit both interfaces will not compile.

```Java
public interface Herbivore {
    public int eatPlants();
}
public interface Omnivore {
    public void eatPlants();
}
public interface Supervore extends Herbivore, Omnivore {} // DOES NOT COMPILE

public abstract class AbstractBear implements Herbivore, Omnivore {} // DOES NOT COMPILE
```