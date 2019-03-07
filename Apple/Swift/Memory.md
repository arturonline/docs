# Memory Management

```swift
import Foundation

func testRetainCyle() {
    class A {
        deinit {
            print("Bye bye A")
        }
    }
    class B {
        deinit{
            print("Bye bye B")
        }
    }
    let a = A()
    let b = B()
}
testRetainCycle()

// Bye bye A
// Bye bye B
```

## One way reference

One objects point to another.

```swift
import Foundation

func testRetainCyle() {
    class A {
        var b = B?
        deinit {
            print("Bye bye A")
        }
    }
    class B {
        deinit{
            print("Bye bye B")
        }
    }
    let a = A()
    let b = B()

    a.b = b // one way reference
}
testRetainCycle()

// Bye bye A
// Bye bye B
```

## Retain cycle

Two objects point to each other

```swift
import Foundation

func testRetainCyle() {
    class A {
        var b = B?
        deinit {
            print("Bye bye A")
        }
    }
    class B {
        var a = A?
        deinit{
            print("Bye bye B")
        }
    }
    let a = A()
    let b = B()

    // retain cyle:
    a.b = b
    b.a = a
}
testRetainCycle()

// -nothing-
```

To adress that we use the `weak` keyword:

```swift
import Foundation

func testRetainCyle() {
    class A {
        weak var b = B?
        deinit {
            print("Bye bye A")
        }
    }
    class B {
        weak var a = A?
        deinit{
            print("Bye bye B")
        }
    }
    let a = A()
    let b = B()

    // retain cyle:
    a.b = b
    b.a = a
}
testRetainCycle()

// Bye bye A
// Bye bye B
```