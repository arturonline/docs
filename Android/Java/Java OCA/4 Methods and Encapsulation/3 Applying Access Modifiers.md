# Applying Access Modifiers

You already saw that there are four access modifers: public, private, protected, and
default access. We are going to discuss them in order from most restrictive to least restrictive:

- **private**: Only accessible within the same class.
- *default (package private) access*: private and other classes in the same package.
- **protected**: default access and child classes.
- **public**: protected and classes in the other packages.

Example of Protected:

```Java
package pond.goose;
import pond.shore.Bird;

public class Goose extends Bird {
    public void helpGooseSwim() {
        Goose other = new Goose();
        other.floatInWater();
        System.out.println(other.text);
}
public void helpOtherGooseSwim() {
    Bird other = new Goose();
    other.floatInWater(); // DOES NOT COMPILE
    System.out.println(other.text); // DOES NOT COMPILE
    }
}
```

The first method is fine. In fact, it is equivalent to the Swan example. Goose extends Bird. Since we are in the Goose subclass and referring to a Goose reference, it can access protected members.
The second method is a problem. Although the object happens to be a Goose, it is stored in a Bird reference. We are not allowed to refer to members of the Bird class since we are not in the same package and Bird is not a subclass of Bird.