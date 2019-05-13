# Enums

Enum type (enumeration) provides an efficient way to define a set of named integer constants that may be assigned to a variable:

```Csharp
enum Day { Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday };
```

By default the underlying type of each element in the enum is int. You can specify another integral numeric type by using a colon:

```csharp
enum Month : byte { Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec };
```

## Enum index

By default, the first enum has the value 0, and the value of each successive enumerator is increased by 1. For example, in the following enumeration, Sat is 0, Sun is 1, Mon is 2, and so forth.

```csharp
enum Day {Sat, Sun, Mon, Tue, Wed, Thu, Fri};
```

Enumerators can use initializers to override the default values, as shown in the following example.

```csharp
enum Day {Sat=1, Sun, Mon, Tue, Wed, Thu, Fri};
```

## Enum conversions

You can convert between an enumeration member and its underlying type by using a casting operator.

```csharp
enum Status
{
    Alive, //0
    Injured, //1
    Dead //2
}

int valueOfAlive = (int)Status.Alive; // valueOfAlive = 0
```

## Enum Supporting types

Enum supports the following types for its constant’s values:

* byte
* sbyte
* short
* ushort
* int
* uint
* long
* ulong

To Enforce enum to store any value of the above type:

```csharp
enum Status : byte
{
    Alive = 1,
    Injured,
    Dead
}
```
