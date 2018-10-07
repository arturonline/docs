# Important

Smaller data types, namely **byte, short, and char**, are first promoted to int any time they’re used with a Java binary arithmetic operator, even if neither of the operands is int.

## sep

* **++a** increments and then uses the variable.
* **a++** uses and then increments the variable.

```Java
int x = 3;
int y = ++x * 5 / x-- + --x;
System.out.println("x is " + x);
System.out.println("y is " + y);
```

* First, the x is incremented and returned to the expression, which is multiplied by 5. We can simplify this:

```Java
int y = 4 * 5 / x-- + --x; // x assigned value of 4
```

* Next, x is decremented, but the original value of 4 is used in the expression, leading to this:

```Java
int y = 4 * 5 / 4 + --x; // x assigned value of 3
```

* The final assignment of x reduces the value to 2, and since this is a pre-increment operator, that value is returned to the expression:

```Java
int y = 4 * 5 / 4 + 2; // x assigned value of 2
```

* Finally, we evaluate the multiple and division from left-to-right, and finish with the addition. The result is then printed:

```Java
x is 2
y is 7
```

## Compound Assignment operator

```Java
long x = 10;
int y = 5;
y = y * x; // DOES NOT COMPILE
```

This last line could be  fixed with an explicit cast to (int), but there’s a better way using the compound assignment operator:

```Java
long x = 10;
int y = 5;
y *= x;
```

The compound operator will first cast x to a long, apply the multiplication of two long values, and then cast the result to an int.

## sep

Comparing two numeric primitive types. If the numeric values are of different data types, the values are automatically promoted as previously described. For example, 5 == 5.00 returns true since the left side is promoted to a double.

## sep

Data types supported by switch statements include the following:

* int and Integer
* byte and Byte
* short and Short
* char and Character int and Integer String
* String
* enum values

For the exam, we recommend you memorize this list. Note that **boolean** and **long**, and their associated wrapper classes, are not supported by switch statements.

The values in each case statement must be compile-time constant values of the same data type as the switch value. This means you can use only:

* Literals
* enum constants
* final constant variables of the same data type.

(No se pueden usar variables para los casos si no han sido previamente declaradas como final e inicializadas en la misma linia.

## sep

System.out.println(string.indexOf('a', 4)); // 4, Java
// shouldn’t even look at the characters until it gets to index 4

System.out.println(string.substring(3, 4)); // m;
// There is an optional second parameter,
// which is the end index you want to stop at,
//but not including it.

System.out.println(string.substring(3, 3)); // empty string

### BinarySearch

* Needs a sorted array
* returns the index of element found
* if it is not found returns an index where should be inserted in the following way:

```Java
index where shoud be inserted = i
i * (-1) - 1
```