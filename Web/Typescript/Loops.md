# Loops

- `The for–in` loop is for looping over object properties.
- `The for–of` loop is for looping over the values in an array.
- `for–of` is not just for arrays. It also works on most array-like objects including the new Set and Map types which we will cover in the next lecture.

## classic For

```Typescript
let array = [1,2,3];
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}
```

## forEach

```Typescript
let array = [1,2,3];
array.forEach(function (value) {
  console.log(value);
});
```

## For In (object properties)

```Typescript
var obj = {a:1,b:2};
for (let prop in obj) {
    console.log(prop);
}
```

## For of (arrays)

```Typescript
let array = [10,20,30];
for (var value of array) {
  console.log(value);
}
```