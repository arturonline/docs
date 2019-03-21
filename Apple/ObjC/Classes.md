# Classes

Classes are declared using two files: a header ( .h) file and an implementation ( .m) file.

The header file should contain (in this order):

* Any needed #import statements or forward @class declarations
* Any protocol declarations
* An @interface declaration specifying which class you're inheriting from
* All publicly accessible variables, properties and methods

The implementation file should contain (in this order):

* Any needed #import statements
* An anonymous category, or class extension, for any private variables or properties
* An @implementation declaration specifying the class
* All public and private methods

Example:

```objc
// MyClass.h

#import "SomeClass.h"

// Used instead of #import to forward declare a class in property return types, etc.
@class SomeOtherClass;

// Place all global constants at the top
extern NSString *const kRPErrorDomain;

// Format: YourClassName : ClassThatYouAreInheritingFrom
@interface MyClass : SomeClass

// Public properties first
@property (readonly, nonatomic, strong) SomeClass *someProperty;

// Then class methods
+ (id)someClassMethod;

// Then instance methods
- (SomeOtherClass *)doWork;

@end
```

```objc
// MyClass.m

#import "MyClass.h"
#import "SomeOtherClass.h"

// Declare any constants at the top
NSString *const kRPErrorDomain = @"com.myIncredibleApp.errors";
static NSString *const kRPShortDateFormat = @"MM/dd/yyyy";

// Class extensions for private variables / properties
@interface MyClass ()
{
    int somePrivateInt;

    // Re-declare as a private read-write version of the public read-only property
    @property (readwrite, nonatomic, strong) SomeClass *someProperty;
}
@end

@implementation MyClass

// Use #pragma mark - statements to logically organize your code
#pragma mark - Class Methods

+ (id)someClassMethod
{
    return [[MyClass alloc] init];
}

#pragma mark - Init & Dealloc methods

- (id)init
{
    if (self = [super init]) {
        // Initialize any properties or setup code here
    }

    return self;
}

// Dealloc method should always follow init method
- (void)dealloc
{
    // Remove any observers or free any necessary cache, etc.

    [super dealloc];
}

#pragma mark - Instance Methods

- (SomeOtherClass *)doWork
{
    // Implement this
}

@end
```

## Instantiation

When you want to create a new instance of a class, you use the syntax:

```objc
MyClass *myClass = [[MyClass alloc] init];
```

The alloc class method returns a pointer to a newly allocated block of memory large enough to store an instance of the class. The allocated memory contains zeros except for one instance variable, isa, that all Objective-C objects are required to have. The isa variable is automatically initialized to point to the class object that allocated the memory and enables the instance to receive messages such as init that are used to complete initialization.