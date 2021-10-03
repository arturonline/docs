# Sets

Sets are a bit like maps but they only store unique keys not key-value pairs.

## Creating, getting and setting

We create a Set using the new keyword, like so

```Typescript
let set = new Set();
```

We can then add entries by using the add method, like so:

```Typescript
let set = new Set();
set.add('APPLE');
set.add('ORANGE');
set.add('MANGO');
```

The add method is chainable, like so:

```Typescript
let set = new Set()
    .add('APPLE')
    .add('ORANGE')
    .add('MANGO');
```

Or we can initialise the Set with an array, like so:

```Typescript
let set = new Set(['APPLE', 'ORANGE', 'MANGO']);
```

We can check to see if a value is in a set like so:

```Typescript
set.has('APPLE')
// true
```

We can delete a value from the set:

```Typescript
set.delete('APPLE')
```

We can count the number of entries in the set like so:

```Typescript
set.size
// 2
```

We can empty the entire set with the clear method:

```Typescript
set.clear();
set.size
// 0
```

Sets can only store unique values, so adding a value a second time has no effect:

```Typescript
let set = new Set();
set.add('Moo');
set.size
// 1
set.add('Moo');
set.size
// 1
```

## Looping over a Set

We can use the for-of loop to loop over items in our set, like so:

```Typescript
let set = new Set(['APPLE', 'ORANGE', 'MANGO']);
for (let entry of set) {
    console.log(entry);
}
// APPLE
// ORANGE
// MANGO
```
