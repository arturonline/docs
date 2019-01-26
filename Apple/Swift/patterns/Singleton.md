# Singleton pattern

[Apple Documentation](https://developer.apple.com/documentation/swift/cocoa_design_patterns/managing_a_shared_resource_using_a_singleton)

[Why singleton are bad](https://stackoverflow.com/questions/137975/what-is-so-bad-about-singletons)

## Example

```swift
class MySingletonClass {

    static let shared = MySingletonClass()

    private init() {
        // initializer code here
    }
}
```