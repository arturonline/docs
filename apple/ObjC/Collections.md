# Collections

The C language offers arrays to hold collections of scalar values and objects, but those are usually cumbersome and complicated to use, especially if you want dynamic collections that change in size. For this reason C arrays are almost never used in Objective-C, which offers instead more advanced types of collections.

## Arrays

The first collection we visit is `NSArray` , which is used for ordered collections of objects. The literal for creating arrays uses square brackets:

```objc
NSArray *someArray = @[ firstObject, secondObject, thirdObject ];
```

Before the introduction of literals, arrays were commonly created using factory or init methods and that is still possible. Literals, though, are a more concise and preferred way. This also prevents some errors: if you use the `NSArray` creation methods that take a variable number of arguments, you have to terminate that list with a nil value. The problem is that it’s possible to truncate the list of items unintentionally if one of the provided values is accidentally nil . The new literal syntax does not have this problem.

The objects contained in an array don’t have to be all of the same type. Accessing array objects at specific indexes is done through subscripting, like this:

```objc
id firstArrayItem = someArray[ 0 ];
```

Pay attention that if you request an invalid index out of the array boundaries you will get an exception at runtime which will crash your app.

Collections are another set of objects in Objective-C that are immutable. If you need to perform an operation that actually requires the collection content to change, this is sometimes done through methods that actually return new copies of the collection instead of modifying the original one.

For example, if we want to add an object at the end, the `arrayByAddingObject:` method returns a new array with the new item appended at the end:

```objc
NSArray *newArray = [someArray arrayByAddingObject :newObject];
```

There are cases where you actually need to change the content of a collection. In this case you can create an instance of it’s mutable subclass. You cannot create an instance of a mutable class using literals though, so you have to do it using the other object creation methods. But you can still use subscripting to change the content:

```objc
NSMutableArray *mutableArray = [ NSMutableArray arrayWithObjects :firstObject, secondObject, thirdObject, nil ];
mutableArray[ 0 ] = newFirstObject;
```

Be aware that you cannot extend the array using subscripting. An invalid index will still throw an exception. If you need to make the array bigger use the addObject: method.

You can also get a mutable array from an immutable one with the mutableCopy method:

```objc
NSMutableArray *mutableArray = [anArray  mutableCopy ];
```

And you can also switch back to an immutable instance when you need to pass a copy around:

```objc
NSArray *immutableArray = [ NSArray arrayWithArray :mutableArray];
```

## Dictionaries

Another very common collection class is `NSDictionary`. Dictionaries store key-value pairs and are usually called `hashmaps` in other languages. It’s best practice to use a string as a key in a dictionary, but it can actually be any object that supports the `NSCopying` protocol.

Dictionaries also have factory methods to create them, but again, the preferred way is by using literals. Dictionary literals use braces:

```objc
NSDictionary  *dictionary =  @{  @"anObject"  : someObject,
                               @"aString"  :  @"This is a string" ,
                               @"aNumber"  :  @7 ,
 } ;
```

You can query dictionaries using subscripting too, passing a key as a subscript:

```objc
NSNumber  *storedNumber = dictionary[ @"aNumber" ];
```

`NSDictionary` also has a mutable subclass called `NSMutableDictionary`. Unlike `NSMutableArray` , you can use subscripting not only to replace items but also to add new objects to the mutable dictionary. Similarly to arrays, you can switch back and forth between immutable and mutable dictionaries using the mutableCopy and `dictionaryWithDictionary:` methods.

## Sets

A less used but still useful collection is `NSSet` . Sets are unordered collections of objects. Their main advantage is that they provide performance improvements over arrays when testing for membership. So if you need to know if an object is in a collection, NSSet might be a good choice. Sets have no literal for creation, so they need to be created with factory methods or initializers:

```objc
NSSet *aSet = [ NSSet setWithObjects : @"This is a string in a set" , @7 , anObject, nil ];
```

As for other collections, the objects contained in a set don’t have to be of the same type. `NSSet` instances are also immutable and there is a mutable subclass called `NSMutableSet` . Objects in sets can be present only once. If you need to put an object in a set more than once, there is the `NSCountedSet` subclass of `NSMutableSet`.

## Nil values in collections

It’s not possible to insert `nil` values inside of collections. If you try to do that, you’ll get an exception which will, usually, crash your app. So you have to check wether an object is `nil` before trying to insert it into a collection.

There are cases, though, where you actually might want to do this on purpose. For example, you might want to do it so signal that a position in an array is empty. Since you cannot insert a nil in a collection, Objective-C offers the `NSNull` class:

```objc
NSArray  *array =  @[ anObject,  @7 , [ NSNull   null ] ] ;
```

Beware that `NSNull` does not behave like `nil` , since it’s actually a real object. If you try to call a method that does not exist on a `NSNull` object, you will get an exception, so you have to check before calling methods on objects coming from collections that contain `NSNull` values. `NSNull` is a **singleton** class, which means that its null method will always return the same instance. This means that you can check whether an object in a collection is equal to the shared NSNull instance using the equality operators:

```objc
id  objectFromArray = [anArray  objectAtIndex : 0 ];
if  (objectFromArray != [ NSNull   null ]) {
   ...
}
```

## Enumerating colletions

When you need to go through all the elements of a collection, Objective-C offers many different ways to do so. C loops work fine of course, but they are prone to programming errors, so it’s advised not to use them. The preferred method to go through a collection is using fast enumeration which has this form:

```objc
for ( Type variable in collection) {
    ...
}
```

So, to enumerate all the object in an array we would write:

```objc
for ( id object in array) {
    ...
}
```

Fast enumeration works with dictionaries too. In this case the loop iterates through the keys and you have to retrieve the values yourself:

```objc
for ( NSString *key in dictionary) {
     id  object = dictionary[key];
    ...
}
```

You can use break and continue in fast enumeration loops as you would use them in a normal loop. If you need to go through a collection in reverse order, you can use an NSEnumerator object:

```objc
for ( id object in [array reverseObjectEnumerator ]) {
   ...
}
```

Beware that you cannot change the content of a mutable collection (adding, replacing or removing objects) while you are enumerating it, or you will get an exception. A quick fix to this is to enumerate through a copy of it:

```objc
for ( id object in [aMutableArray copy ]) {
    ...
}
```