# Overloading Methods

Method overloading occurs when there are different methods with the same name but different type parameters.

Everything other than the method signature can vary for overloaded methods. This means there can be different access modifers, specifers (like static), return types, and exception lists:

```Java
public void fly(int numMiles) { }
public void fly(short numFeet) { }
public boolean fly() { return false; }
void fly(int numMiles, short numFeet) { }
public void fly(short numFeet, int numMiles) throws Exception { }
```

## Overloading and Varargs

Which method do you think is called if we pass an int[]?

```Java
public void fly(int[] lengths) { }
public void fly(int... lengths) { } // DOES NOT COMPILE
```

Trick question! Since we are not allowed to overload methods with the same parameter list, this code doesn't compile. Even though the code doesn't look the same, it compiles to the same parameter list.

Now that we’ve just gotten through explaining that they are the same, it is time to mention how they are not the same. It shouldn’t be a surprise that you can call either method by passing an array:

```Java
fly(new int[] { 1, 2, 3 });
```

However, you can only call the varargs version with stand-alone parameters:

```Java
fly(1, 2, 3);
```

## Autoboxing

Java will convert a primitive int to an object Integer to add it to an ArrayList through the wonders of autoboxing.

```Java
public void fly(int numMiles) { }
public void fly(Integer numMiles) { }
```

Java will match the int numMiles version. Java tries to use the most specifc parameter list it can find.

### Autoboxing Reference types

```Java
public class ReferenceTypes {
    public void fly(String s) {
        System.out.print("string ");
}
    public void fly(Object o) {
        System.out.print("object ");
}
public static void main(String[] args) {
    ReferenceTypes r = new ReferenceTypes();
        r.fly("test");
        r.fly(56);
    }
}

// "string object"
```

### autoboxing primitives

Java tries to find the most specifc matching overloaded method. What do you think happens here?

```Java
public class Plane {
    public void fly(int i) {
        System.out.print("int ");
}
    public void fly(long l) {
        System.out.print("long ");
}
    public static void main(String[] args) {
        Plane p = new Plane();
        p.fly(123);
        p.fly(123L);
    }
}

// "int long"
```

The first call passes an int and sees an exact match. The second call passes a long and also sees an exact match. If we comment out the overloaded
method with the int parameter list, the output becomes long long.

### Practice

What do you think this outputs?

```Java
public class Glider2 {
    public static String glide(String s) {
        return "1";
    }
    public static String glide(String... s) {
        return "2";
    }
    public static String glide(Object o) {
        return "3";
    }
    public static String glide(String s, String t) {
        return "4";
    }
    public static void main(String[] args) {
        System.out.print(glide("a"));
        System.out.print(glide("a", "b"));
        System.out.print(glide("a", "b", "c"));
    }
}

// 142
```

- The first call matches the signature taking a single String because that is the most specifc match.
- The second call matches the signature, taking two String parameters since that is an exact match.
- It isn’t until the third call that the varargs version is used since there are no better matches.

As accommodating as Java is with trying to find a match, it will only do one
conversion:

```Java
public class TooManyConversions {
    public static void play(Long l) { }
    public static void play(Long... l) { }
    public static void main(String[] args) {
        play(4); // DOES NOT COMPILE
        play(4L); // calls the Long version
    }
}
```

Here we have a problem. Java is happy to convert the int 4 to a long 4 or an Integer 4. It cannot handle converting in two steps to a long and then to a Long. If we had public static void play(Object o) { }, it would match because only one conversion would be necessary: from int to Integer.