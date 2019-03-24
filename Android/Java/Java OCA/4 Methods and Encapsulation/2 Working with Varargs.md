# Working with Varargs

A vararg parameter must be the last element in a method’s parameter list. This implies you are only allowed to have one vararg parameter per method.

```Java
public void walk1(int... nums) { }
public void walk2(int start, int... nums) { }
public void walk3(int... nums, int start) { } // DOES NOT COMPILE
public void walk4(int... start, int... nums) { } // DOES NOT COMPILE
```

- *walk1()* is a valid method declaration with one vararg parameter.
- *walk2()* is a valid method declaration with one int parameter and one vararg parameter.
- *walk3()* and *walk4()* do not compile because they have a vararg parameter in a position that is not the last one.

When calling a method with a vararg parameter, you can:

- Pass in an array.
- list the elements of the array and let Java create it for you.
- Omit the vararg values in the method call and Java will create an array of length zero for you.

Examples:

```Java
15: public static void walk(int start, int... nums) {
16:     System.out.println(nums.length);
17: }
18: public static void main(String[] args) {
19:     walk(1); // 0
20:     walk(1, 2); // 1
21:     walk(1, 2, 3); // 2
22:     walk(1, new int[] {4, 5}); // 2
23: }
```

- Line 19 passes 1 as start but nothing else. This means Java creates an array of length 0 for nums.
- Line 20 passes 1 as start and one more value. Java converts this one value to an array of length 1.
- Line 21 passes 1 as start and two more values. Java converts these two values to an array of length 2.
- Line 22 passes 1 as start and an array of length 2 directly as nums.

## Accessing a vararg parameter

Accessing a vararg parameter is also just like accessing an array. It uses array indexing.
For example:

```Java
16: public static void run(int... nums) {
17:     System.out.println(nums[1]);
18: }
19: public static void main(String[] args) {
20:     run(11, 22); // 22
21: }
```

Line 20 calls a vararg parameter two parameters. When the method gets called, it sees an array of size 2. Since indexes are 0 based, 22 is printed.