# Variadic Functions

Some functions are variadic, which is a fancy way of saying they accept any number of parameters of the same type.

```swift
func square(numbers: Int...) {
    for number in numbers {
        print("\(number) squared is \(number * number)")
    }
}
```

You can make any parameter variadic by writing `...` after its type. So, an `Int` parameter is a single integer, whereas `Int...` is zero or more integers – potentially hundreds.