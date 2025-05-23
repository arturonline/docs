# Properties

## Store Properties

A stored property is a constant or variable that is stored as part of an instance of a particular class or structure. Stored properties can be either variable stored properties (introduced by the *var* keyword) or constant stored properties (introduced by the *let* keyword).

Stored properties are provided only by classes and structures.

If you create an instance of a structure, which is a value type, and assign that instance to a constant, you cannot modify the instance’s properties, even if they were declared as variable properties.
The same is not true for classes, which are reference types. If you assign an instance of a reference type to a constant, you can still change that instance’s variable properties.

### Public getter, private setter

In my blog post on Constructor Injection, I had an example of a struct with a property that needed to be read externally but written only internally. I initially wrote the code like this:

```swift
struct Counter {
    // `count` here has to be a var
    // but I never want to set the `count` externally,
    // so I made it private
    private var count: Int

    // so this is the only way to access the count externally
    func getCount() {
        return count
    }
}
```

Luckily, there is a better way! I can choose to make only the setter private in Swift Like this:

```swift
public struct Counter {
    // I specify that only the setter is private!
    public private(set) var count: Int
}
```

### Lazy Stored Properties

A lazy stored property is a property whose initial value is not calculated until the first time it is used.

## Computed Properties

Computed properties do not actually store a value. Instead, they provide a getter and an optional setter to retrieve and set other properties and values indirectly.

Computed properties are provided by classes, structures, and enumerations.

```swift
struct Rect {
    var origin = Point()
    var size = Size()
    var center: Point {
        get {
            let centerX = origin.x + (size.width / 2)
            let centerY = origin.y + (size.height / 2)
            return Point(x: centerX, y: centerY)
        }
        set(newCenter) {
            origin.x = newCenter.x - (size.width / 2)
            origin.y = newCenter.y - (size.height / 2)
        }
    }
}
```

### Shorthand Setter Declaration

If a computed property’s setter does not define a name for the new value to be set, a default name of `newValue` is used

```swift
struct AlternativeRect {
    var origin = Point()
    var size = Size()
    var center: Point {
        get {
            let centerX = origin.x + (size.width / 2)
            let centerY = origin.y + (size.height / 2)
            return Point(x: centerX, y: centerY)
        }
        set {
            origin.x = newValue.x - (size.width / 2)
            origin.y = newValue.y - (size.height / 2)
        }
    }
}6
```

### Read-Only Computed Properties

A computed property with a getter but no setter is known as a read-only computed property.

You can simplify the declaration of a read-only computed property by removing the get keyword and its braces:

```swift
struct Cuboid {
    var width = 0.0, height = 0.0, depth = 0.0
    var volume: Double {
        return width * height * depth
    }
}
let fourByFiveByTwo = Cuboid(width: 4.0, height: 5.0, depth: 2.0)
print("the volume of fourByFiveByTwo is \(fourByFiveByTwo.volume)")
// Prints "the volume of fourByFiveByTwo is 40.0"
```

## Property Observers

Property observers observe and respond to changes in a property’s value. Property observers are called every time a property’s value is set, even if the new value is the same as the property’s current value.

You have the option to define either or both of these observers on a property:

- willSet is called just before the value is stored.
- didSet is called immediately after the new value is stored.

If you implement a *willSet* observer, it’s passed the new property value as a constant parameter. You can specify a name for this parameter as part of your willSet implementation. If you don’t write the parameter name and parentheses within your implementation, the parameter is made available with a default parameter name of newValue.

Similarly, if you implement a *didSet* observer, it’s passed a constant parameter containing the old property value. You can name the parameter or use the default parameter name of oldValue. If you assign a value to a property within its own didSet observer, the new value that you assign replaces the one that was just set.

```swift
var pizzaInInches: Int = 14 {
    willSet{
        print(pizzaInInches)
        print(newValue)
    }
    didSet {
        print(oldValue)
        print(pizzaInInches)
    }
}

pizzaInInches = 8

// 14
// 8
// 14
// 8
```

```swift
var pizzaInInches: Int = 14 {
    willSet{
    }
    didSet {
        if pizzaInInches >= 18 {
            print("Invalid size, pizzaInInches set to 18.")
            pizzaInInches = 18
        }
    }
}

pizzaInInches = 33

// Invalid size, pizzaInInches set to 18.
```