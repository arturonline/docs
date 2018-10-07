# Maps

We create a map using the new keyword, like so

```Typescript
let map = new Map();
```

We can then add entries by using the set method, like so:

```Typescript
let map = new Map();
map.set("A",1);
map.set("B",2);
map.set("C",3);
```

The set method is also chainable, like so:

```Typescript
let map = new Map()
    .set("A",1)
    .set("B",2)
    .set("C",3);
```

Or we could initialise the Map with a an array of key-value pairs, like so:

```Typescript
let map = new Map([
    [ "A", 1 ],
    [ "B", 2 ],
    [ "C", 3 ]
]);
```

We can extract a value by using the get method:

```Typescript
map.get("A");
// 1
```

We can check to see if a key is present using the has method:

```Typescript
map.has("A");
// true
```

We can delete entries using the delete method:

```Typescript
map.delete("A");
// true
```

We can check for the size (number of entries) using the size property:

```Typescript
map.size
// 2
```

We can empty an entire Map by using the clear method:

```Typescript
map.clear()
map.size
// 0
```

## Looping over a Map

There are a couple of different method we can employ:

```typescript
let map = new Map([
    [ "APPLE", 1 ],
    [ "ORANGE", 2 ],
    [ "MANGO", 3 ]
]);
```

### Using keys()

The keys method returns the keys in the map as an array which we can loop over using for-of like so:

```typescript
for (let key of map.keys()) {
    console.log(key);
}
// APPLE
// ORANGE
// MANGO
```

### Using values()

The values method returns the values in the map as an array which we can loop over using for-of like so:

```typescript
for (let value of map.values()) {
    console.log(value);
}
// 1:
// 2
// 3
```

### Using entries()

The entries method returns the [key,value] pairs in the map as an array which we can loop over using for-of like so:

```typescript
for (let entry of map.entries()) {
    console.log(entry[0], entry[1]);
}
// "APPLE" 1
// "ORANGE" 2
// "MANGO" 3
```

### Using destructuring 

we can access the keys and values directly, like so:

```typescript
for (let [key, value] of map) {
    console.log(key, value);
}
// "APPLE" 1
// "ORANGE" 2
// "MANGO" 3
```
