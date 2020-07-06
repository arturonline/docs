# Types

## Basic Types

We can support boolean, number and string.

```Typescript
let decimal: number = 6;
let done: boolean = false;
let color: string = "blue";
```

## Arrays

We have two ways of describing the types of arrays.

The first is to use the brackets notation [], like so:

```Typescript
let list: number[] = [1, 2, 3];
```

The above indicates to TypeScript that this array should only hold numbers.

The second way uses a generic type specifically Array<Type>, like so:

```typescript
let list: Array<number> = [1, 2, 3];
```

## Functions

We can describe a variable as one that will only point to a function, like so:

```typescript
let fun: Function = () => console.log("Hello");
```

With TypeScript we can also define the expected return type of a function, like so:

```typescript
function returnNumber(): number {
  return 1;
}
```

The above lets TypeScript know that the function should only return a number.

## Enum

An Enum is a datatype consisting of a set of named values. The names are usually identifiers that behave as constants. Enums were introduced in ES6.

```typescript
enum Direction {
    Up,
    Down,
    Left,
    Right
}

let go: Direction;
go = Direction.Up;
```

## Any

If we don’t know the type of something we can fall back to using any.

If used it doesn’t provide any type checking but does make it clear that we intentionally don’t know the type, rather than we forgot to add the type.

```typescript
let notsure: any = 1;
notsure = "hello"; // This is fine since we don't do type checking with any
```

## Void

void means no type, it’s typically used to indicate that a function will not return anything at all, like so:

```typescript
function returnNothing(): void {
  console.log("Moo");
}
```