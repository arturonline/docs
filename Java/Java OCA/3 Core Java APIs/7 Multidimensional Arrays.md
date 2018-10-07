# Multidimensional Arrays

Arrays can hold other Arrays:

```Java
int[][] vars1; // 2D array
int vars2 [][]; // 2D array
int[] vars3[]; // 2D array
int[] vars4 [], space [][]; // a 2D AND a 3D array
```

You can specify the size of your multidimensional array in the declaration if you like:

```Java
String [][] rectangle = new String[3][2];
```

The result of this statement is an array rectangle with three elements, each of which refers to an array of two elements.

![alt Multidimensional Array](resources/multiArray.png "Arrays")

## Using a Multidimensional Array

Loop:

```Java
int[][] twoD = new int[3][2];
for (int i = 0; i < twoD.length; i++) {
    for (int j = 0; j < twoD[i].length; j++)
        System.out.print(twoD[i][j] + " "); // print element
    System.out.println(); // time for a new row
}
```

or

```Java
for (int[] inner : twoD) {
    for (int num : inner)
        System.out.print(num + " ");
    System.out.println();
}
```