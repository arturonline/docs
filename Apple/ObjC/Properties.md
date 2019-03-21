# Property Types

When a property is specified, it is given the syntax:

```objc
@property SomeClass *someProperty;

// Or
@property (xxx) SomeClass *someProperty;
```

where xxx can be a combination of:

| | |
|-|-|
| atomic | nonatomic |
| strong | weak |
| readwrite | readonly |
| getter= | setter= |
| copy | assign |
| retain | unsafe_unretained |

## atomic & nonatomic

### atomic

This is the default and means that only one thread can access the property at a time (i.e. it's thread-safe) and is typically slower in performance to use.

### nonatomic

This is used to allow multiple threads to access the property at a time  (i.e. it's NOT thread-safe). You will more often use nonatomic properties though, because they are FAST when compared to atomic ones.

## strong & weak

### strong

This is the default and is required when the attribute is a pointer to an object. The automatically generated setter will retain (i.e. increment the retain count of) the object and keep the object alive until released.

### weak

Variables that are weak can still point to objects but they do not become owners (or increase the retain count by 1). If the object's retain count drops to 0, the object will be deallocated from memory and the weak pointer will be set to nil. It's best practice to create all delegates and IBOutlet's as weak references since you do not own them.

## readwrite & readonly

### readwrite

This is a default attribute and it can be overridden by readonly. This basically tells the compiler to generate both a getter and a setter.

### readonly

It tells the compiler to only generate a getter for an object.

One common thing to do with these two, is if you want a property visible to another class, but not able to be changed by an external class, set the property to readonly in your header file, and in your implementation file ( .m file), declare it as readwrite. That way your implementation has a getter and a setter, while external classes only get the getter.

## getter= & setter=

### getter=

This just gives a custom name for a getter. The default getter is just the name of the property. This is typically done for boolean properties (e.g. `getter=isFinished`)

### setter=

Similar to the `getter=`, it just gives a custom name to the setter. The default setter is just the capitalized property name with set as a prefix (so the default setter for `petOwner` is `setPetOwner`).

## copy & assign

### copy

Creates an immutable copy of the object upon assignment and is typically used for creating an immutable version of a mutable object. Use this if you need the value of the object as it is at this moment, and you don't want that value to reflect any future changes made by other owners of the object.

### assign

Generates a setter which assigns the value directly to the instance variable, rather than copying or retaining it. This is typically used for creating properties for primitive types ( float, int, BOOL, etc).

## retain & unsafe_unretained

### retain

This is the older version of strong. It claims ownership of the object and increases the retain count. You will have to manually release the object to decrease its retain count. You should not use this in an ARC project.

### unsafe_unretained

An unsafe reference is similar to a weak reference in that it doesn't keep its related object alive, but it won’t be set to nil if the object is deallocated. This can lead to crashes due to accessing that deallocated object and therefore you should use weak unless the OS or class does not support it.

## Accessing Properties

Properties can be accessed using either bracket syntax or dot notation, with dot notation being cleaner to read.

```objc
[self myProperty];

// Or
self.myProperty
```