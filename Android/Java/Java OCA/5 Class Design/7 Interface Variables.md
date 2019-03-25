# Interface Variables

Interface variables are essentially constant variables defined on the interface level.

1. Interface variables are assumed to be **public**, **static**, and **final**. Therefore, marking a variable as private or protected will trigger a compiler error, as will marking any variable as abstract.
1. The value of an interface variable must be set when it is declared since it is marked as **final**.

The following two interface definition are equivalent, the compiler will automatically convert them both to the second example:

```Java
public interface CanSwim {
int MAXIMUM_DEPTH = 100;
final static boolean UNDERWATER = true;
public static final String TYPE = "Submersible";
}

public interface CanSwim {
public static final int MAXIMUM_DEPTH = 100;
public static final boolean UNDERWATER = true;
public static final String TYPE = "Submersible";
}
```