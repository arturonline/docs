# Methods

## Syntax

### Single parameter declaration

```objc
// a C# method
void DriveCar(Car car);
```

```objc
// objc version
- (void)driveCar:(Car *)car;
```

### More than one paremeter

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

### Class vs Instance Methods

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

Example:

```objc
NSString *emailAddress = @"ben@objectivecfun.com"
int stringLength = [name length];
// stringLength will equal 21!
```

The example above shows how a method is used. Here we are calling the length message on the emailAddress variable, or more accurately, sending the length message to the emailAddress object.

## Method vs Message

In Objective-C any message can be sent to any object. It’s up to the object to handle the message or not. If it doesn’t handle the message, then nothing bad will happen; it will just return nil to the sender, or caller. This is different than the method model because, If a method is called on an object that doesn’t define the method, we end up with compile-time or run-time errors that stop us dead in our tracks.

```objc
NSString *testString = [emailAddress addSparkles];
// testString will equal "nil" because, believe it or not,
// "addSparkles" is not a valid NSString method.
```