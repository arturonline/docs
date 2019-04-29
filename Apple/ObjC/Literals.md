# Literals

Literals are compiler directives which provide a shorthand notation for creating common objects.

Syntax | What it does
-|-
`@"string"` | Returns an NSString object
`@28, @3.14, @YES` | Returns an NSNumber object initialized with an appropriate class constructor, depending on the type
`@[]` | Returns an NSArray object
`@{}` | Returns an NSDictionary object
`@()` | Dynamically evaluates the boxed expression and returns the appropriate object literal based on its value

Similar to `NSString` literals, collection objects made via literal arrays and dictionaries are immutable. Instead, you will have to make a mutable copy after making the immutable dictionary or array. Additionally, you cannot have static initializers like you can with `NSString`.

## NSArray Access Syntax

```objc
NSArray *example = @[ @"hi", @"there", @23, @YES ];
NSLog(@"item at index 0: %@", example[0]);
```

## NSDictionary Access Syntax

```objc
NSDictionary *example = @{ @"hi" : @"there", @"iOS" : @"people" };
NSLog(@"hi %@", example[@"hi"]);
```