# Completion Handler

## Synchromous vs Asynchronous Execution

Program execution in most high-level languages is usually very straightforward. Your program starts at the first line of source code and each line of code executed sequentially thereafter. Each time a function is called, program execution waits until that function returns before continuing to the next line of code.

This method of execution can have undesirable ramifications. Suppose a function is called to start a time consuming process. With synchronous execution, your program is “stuck”, waiting for the process to end, with no way out.

Completion handlers are super convenient when your app is doing something that might take a little while, like making an API call, and you need to do something when that task is done, like updating the UI to show the data.

By using a completion handler, we can fire off the network call and not wait around for the response. When the network call is done, the completion handler can be called to notify us. So we can keep the UI working while the networking call is being made.

tl,dr:

A completion handler is a closure that can be passed as an argument to a function and then called when that function is done.

### Example #1:

```swift
// Function called from the completion reference
func completionHandler(value: Int) {
    print("Function completion handler value: \(value)")
}

// The computation function
func computeValue(start: Int, completion: (Int) -> Void) {

    var start = start
    for _ in 1...100 {
        start += 1
    }
    completion(start) // completion -> completionHandler(value: Int) -> Void
}

// Compute a value and then send the finished value to the function completion handler
computeValue(start: 1, completion: completionHandler)
```

### Example #2:

```swift
func search(query: String, completionHandler: ([String], Error?) -> Void) {

 // ... setup code omitted ...

  var error: Error?
  var result = [String]()

  // Perform the search operation and
  // set result and error depending
  // on success of the operation

  // Pass the result and error back to the caller
  completionHandler(result, error)
}
```

```swift
class SearchViewController: UIViewController {
  var searchTitles = [String]()
  let searchEngine = SearchEngine()

  func search(title: String) {
    searchEngine.search(query: title, completionHandler: { (result, error) in
      if error != nil {
        self.searchTitles = result
      }
    })
  }
}
```

## weak self stuff

`weak self` is a technique used in closures to avoid retain cycles. Since a closure is an object it can own or retain other objects. This ownership can create a problem if an object that owns the closure is also owned by the closure. If that happens then we won’t ever deallocate that object or the closure because they’ll always be owned by something. 

The most common case is for the closure to end up owning the class that it’s declared in.

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