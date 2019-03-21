# Control Statements

## If-Else If-Else

```objc
if (someTestCondition) {
    // Code to execute if the condition is true
} else if (someOtherTestCondition) {
    // Code to execute if the other test condition is true
} else {
    // Code to execute if the prior conditions are false
}
```

## Ternary Operators

The shorthand notation for an if-else statement is a ternary operator of the form: someTestCondition ? doIfTrue : doIfFalse;

Example:

```objc
- (NSString *)stringForTrueOrFalse:(BOOL)trueOrFalse
{
    return trueOrFalse ? @"True" : @"False";
}
```

There is also another lesser known form: A ?: B; which basically returns A if A is YES or non-nil, otherwise it returns B.

## For Loops

For more detail and explanation see: Objective-C: Loops

```objc
for (int i = 0; i < totalCount; i++) {
    // Code to execute while i < totalCount
}
```

## Fast Enumeration

```objc
for (Person *person in arrayOfPeople) {
    // Code to execute each time
}
```

where `arrayOfPeople` can be any object that conforms to the `NSFastEnumeration` protocol. `NSArray` and `NSSet` enumerate over their objects, `NSDictionary` enumerates over keys, and `NSManagedObjectModel` enumerates over `entities`.

## While Loop

```objc
while (someTextCondition) {
   // Code to execute while the condition is true
}
```

## Do While Loop

```objc
do {
    // Code to execute while the condition is true
} while (someTestCondition);
```

## Switch

Switch statements are often used in place of if statements if there is a need to test if a certain variable matches the value of another constant or variable. For example, you may want to test if an error code integer you received matches an existing constant value or if it's a new error code.

```objc
switch (errorStatusCode)
{
    case kRPNetworkErrorCode:
        // Code to execute if it matches
        break;

     case kRPWifiErrorCode:
        // Code to execute if it matches
        break;

     default:
        // Code to execute if nothing else matched
        break;
}
```

## Exiting Loops

* **Continue**: to just skip the rest of the current iteration like with the break statement, but without exiting the loop.
* **return** : Stops execution and returns to the calling function. It can also be used to return a value from a method.
* **break** : Used to stop execution of a loop.

Newer enumeration methods now have special `BOOL` variables (e.g. `BOOL *stop`) that are used to stop loop execution. Setting that variable to `YES` within the loop is similar to calling `break`.