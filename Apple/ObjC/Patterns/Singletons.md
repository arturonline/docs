# Singletons

Singleton's are a special kind of class where only one instance of the class exists for the current process. They are a convenient way to share data between different parts of an app without creating global variables or having to pass the data around manually, but they should be used sparingly since they often create tighter coupling between classes.

To turn a class into a singleton, you place the following method into the implementation ( .m) file, where the method name is prefixed with `shared` plus another word which best describes your class. For example, if the class is a network or location manager, you would name the method `sharedManager` instead of `sharedInstance`.

```objc
+ (instancetype)sharedInstance
{
   static id sharedInstance = nil;
   static dispatch_once_t onceToken;
   dispatch_once(&onceToken, ^{
      sharedInstance = [[self alloc] init];
   });

   return sharedInstance;
}
```

The use of `dispatch_once` ensures that this method is only ever executed once, even if it's called multiple times across many classes or different threads.

If the above code were placed within `MyClass`, then you would get a reference to that singleton class in another class with the following code:

```objc
MyClass *myClass = [MyClass sharedInstance];
[myClass doSomething];
NSLog(@"Property value is %@", myClass.someProperty);
```