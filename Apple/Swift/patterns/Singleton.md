# Singleton pattern

```swift
class MySingletonClass {

    static let shared = MySingletonClass()

    private init() {
        // initializer code here
    }
}
```