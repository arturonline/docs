# Closures Scope

## Capturing Values

If you use any external values inside your closure, Swift captures them – stores them alongside the closure, so they can be modified even if they don’t exist any more.

In Swift, the simplest form of a closure that can capture values is a nested function, written within the body of another function. 

```Swift
func makeIncrementer(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}
```

The `incrementer()` function doesn’t have any parameters, and yet it refers to runningTotal and amount from within its function body. It does this by capturing a reference to runningTotal and amount from the surrounding function and using them within its own function body.

## Capturing Self

If you create a closure that references self.* it will capture self and retain a strong reference to it. This is sometimes the intended behavior, but often could lead to retain cycles where both objects won't get deallocated at the end of their lifecycles.

The two best options are to use unowned or weak. This might look a bit messy, but saves a lot of headache.

Use unowned when you know the closure will only be called if self still exists, but you don't want to create a strong (retain) reference.

Use weak if there is a chance that self will not exist, or if the closure is not dependent upon self and will run without it. If you do use weak also remember that self will be an optional variable and should be checked for existence.

```swift
typealias SomeClosureType = (_ value: String) -> ()

class SomeClass {
    fileprivate var currentValue = ""

    init() {
        someMethod { (value) in // Retained self
            self.currentValue = value
        }

        someMethod { [unowned self] (value) in // Not retained, but expected to exist
            self.currentValue = value

        }

        someMethod { [weak self] value in // Not retained, not expected to exist
            // Or, alternatively you could do
            guard let sSelf = self else { return }

            // Or, alternatively use `self?` without the guard
            sSelf.currentValue = value
        }
    }

    func someMethod(closure: SomeClosureType) {
        closure("Hai")
    }
}
```

## Escaping closures

When you pass a closure into a function, swift considers it `non-Escaping` by default. It means that the closure must be use inmediatly and can not store for later.

A closure is said to escape a function when the closure is passed as an argument to the function, but is called after the function returns.

When you declare a function that takes a closure as one of its parameters, you can write `@escaping` before the parameter’s type to indicate that the closure is allowed to escape.

```Swift
var queuedClosures [() -> Void] = [] // Arrar of closures

func queueClosure(_ closure: @escaping () -> Void) {
    queuedClosures.append(closure)
}

queuedClosure({ print("Running Closure 1") })
queuedClosure({ print("Running Closure 2") })
queuedClosure({ print("Running Closure 3") })

func executreQueuedClosures() {
    for closure in queuedClosures {
        closure()
    }
}

executreQueuedClosures() // you can not use this without @escaping
```