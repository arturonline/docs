# Singleton pattern

[Apple Documentation](https://developer.apple.com/documentation/swift/cocoa_design_patterns/managing_a_shared_resource_using_a_singleton)

[Why singleton are bad](https://stackoverflow.com/questions/137975/what-is-so-bad-about-singletons)

## Overview

You use **singletons** to provide a globally accessible, shared instance of a class. You can create your own singletons as a way to provide a unified access point to a resource or service that’s shared across an app, like an audio channel to play sound effects or a network manager to make HTTP requests.

## Create a Singleton

You create simple singletons using a static type property, which is guaranteed to be lazily initialized only once, even when accessed across multiple threads simultaneously:

```swift
class MySingletonClass {

    static let shared = MySingletonClass()

    private init() {
        // initializer code here
    }
}
```

If you need to perform additional setup beyond initialization, you can assign the result of the invocation of a closure to the global constant:

```swift
If you need to perform additional setup beyond initialization, you can assign the result of the invocation of a closure to the global constant:
class Singleton {
    static let sharedInstance: Singleton = {
        let instance = Singleton()
        // setup code
        return instance
    }()
}
```