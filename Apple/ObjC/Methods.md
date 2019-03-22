# Methods

## Single parameter declaration

```objc
// a C# method
void DriveCar(Car car);
```

```objc
// objc version
- (void)driveCar:(Car *)car;
```

## More than one paremeter

Parameters and return types are declared using type casting syntax after colons `:` and the method signature should describe the argument type:

```objc
// C# version
void DriveCar(Car car, Person person);
```

```objc
// ObjC version
- (void)driveCar:(Car *)car withPerson:(Person *)person;
```

Another example:

```objc
// Returns an NSString object for the given NSObject arguments
- (NSString *)stringFromObject:(NSObject *)object andSomeOtherObject:(NSObject *)otherObject;
```

## Class vs Instance Methods

A plus sign precedes declarations of class methods:

```objc
// Call on a class (e.g. [MyClass someClassMethod]);
+ (void)someClassMethod;
```

A minus sign precedes declarations of class instance methods:

```objc
// Called on an instance of a class (e.g. [[NSString alloc] init]);
- (void)someClassInstanceMethod;
```

## Calling Methods

Methods are called using bracket syntax: `[self someMethod];` or `[self sometMethodWithObject:object];`

`self` is a reference to the method's containing class. The `self` variable is present in all Objective-C methods and it is one of two hidden arguments passed to code that implements a method, the other being `_cmd`, which identifies the received message.

At times, it is necessary to call a method in the superclass using `[super someMethod];`.

Under the hood, methods are implemented via message sending and they are turned into a variation of one of these two C functions:

```objc
id objc_msgSend(id self, SEL op, ...);
id objc_msgSendSuper(struct objc_super *super, SEL op, ...);
```

