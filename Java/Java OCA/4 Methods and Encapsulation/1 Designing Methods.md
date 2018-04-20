# Designing Methods

The exam creators like to trick you by putting method elements in the wrong order or using incorrect values.

![Method declaration](resources/method.png )

## Access Modifiers

- **public**: The method can be called from any class.
- **private**: The method can only be called from within the same class.
- **protected**: The method can only be called from classes in the same package or subclasses.
- **Default Access** (Package Private): The method can only be called from classes in the same package. This one is tricky because there is no keyword for default access. You simply omit the access modifer.

Example:

```Java
public void walk1() {}
default void walk2() {} // DOES NOT COMPILE
void public walk3() {} // DOES NOT COMPILE
void walk4() {}

```

- **walk1()** is a valid method declaration with public access.
- **walk4()** is a valid method declaration with default access.
- **walk2()** doesn’t compile because default is not a valid access modifer. **walk3()** doesn’t compile because the access modifer is specifed after the return type.

## Optional Specifiers

You can have zero or more specifers in a method declaration in any order  (although not all combinations are legal).

- **static**: Used for class methods.
- **abstract**: Used when not providing a method body.
- **final**: Used when a method is not allowed to be overridden by a subclass.
- **synchronized**: On the OCP but not the OCA exam.
- **native** Not on the OCA or OCP exam. Used when interacting with code written in another language such as C++.
- **strictfp**: Not on the OCA or OCP exam. Used for making ﬂoating-point calculations portable.

Example:

```Java
public void walk1() {}
public final void walk2() {}
public static final void walk3() {}
public final static void walk4() {}
public modifier void walk5() {} // DOES NOT COMPILE
public void final walk6() {} // DOES NOT COMPILE
final public void walk7() {}
```

- *walk1()* is a valid method declaration with no optional specifer. This is okay; it is optional, after all.
- *walk2()* is a valid method declaration, with final as the optional specifer.
- *walk3()* and *walk4()* are valid method declarations with both final and static as optional specifers. The order of these two keywords doesn’t matter.
- *walk5()* doesn’t compile because modifer is not a valid optional specifer.
- *walk6()* doesn’t compile because the optional specifer is after the return type.
- *walk7()* does compile. Java allows the optional specifers to appear before the access modifer.

## Return Type

The return type is an actual Java type such as String or int. If there is no return type, the **void** keyword is used.

When checking return types, you also have to look inside the method body. Methods with a return type other than void are required to have a return statement inside the method body. This return statement must include the primitive or object to be returned.

Methods that have a return type of void are permitted to have a return statement with no value returned or omit the return statement entirely.

Examples:

```Java
public void walk1() { }
public void walk2() { return; }
public String walk3() { return ""; }
public String walk4() { } // DOES NOT COMPILE
public walk5() { } // DOES NOT COMPILE
String walk6(int a) { if (a == 4) return ""; } // DOES NOT COMPILE
```

- Since the return type of *walk1()* is void, the return statement is optional.
- *walk2()* shows the optional return statement that correctly doesn’t return anything.
- *walk3()* is a valid method with a String return type and a return statement that returns a String.
- *walk4()* doesn’t compile because the return statement is missing.
- *walk5()* doesn’t compile because the return type is missing.
- *walk6()* is a little tricky. There is a return statement, but it doesn’t always get run. If a is 6, the return statement doesn’t get executed. Since the String always needs to be returned, the compiler complains.

## Method Name

Method names follow the same rules as variable names. An identifer may only contain:

- letters
- numbers
- $
- _
- Also, the first character is not allowed to be a number, and reserved words are not allowed.

## Parameter List

Although the parameter list is required, it doesn’t have to contain any parameters. This means you can just have an empty pair of parentheses after the method name. If you do have multiple parameters, you separate them with a comma:

```Java
public void walk1() { }
public void walk2 { } // DOES NOT COMPILE
public void walk3(int a) { }
public void walk4(int a; int b) { } // DOES NOT COMPILE
public void walk5(int a, int b) { }
```

## Optional Exception List

You can list as many types of exceptions as you want in this clause separated by commas.

Example:

```Java
public void zeroExceptions() { }
public void oneException() throws IllegalArgumentException { }
public void twoExceptions() throws IllegalArgumentException, InterruptedException { }
```

## Method Body

A simply a code block.

Example:

```Java
public void walk1() { }
public void walk2; // DOES NOT COMPILE
public void walk3(int a) { int name = 5; }
```

- *walk1()* is a valid method declaration without an empty method body.
- *walk2()* doesn't compile because it is missing the braces around the empty method body.
- *walk3()* is a valid method declaration with one statement in the method body