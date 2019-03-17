# RXSwift: Overview

Reactive programming extends the Observer pattern to support sequences of data and/or events and adds operators that allow you to compose sequences together declaratively while abstracting away concerns about things like low-level threading, synchronization, thread-safety, concurrent data structures, and non-blocking I/O.

## Observables and Observers

### Observable

Observables are nothing but a sequence of data or elements with some special abilities, the most important one is that it can receive the data asynchronously.

#### Hot vs Cold Observable

Observables can be hot or cold type depending on the nature of emission produced by the Observable.

- The **hot observable** can begin emitting items as soon as it is created and have their data produced by the external sources like button taps, search bar text etc. These event happens independently of any subscriber. Observable will emit data even if there is no observer initially and observers can subscribe later will receives current events as they happen.

- A **cold observable**, on the other hand, waits until an observer subscribes to it before it begins to emit items, and starts pushing values to the observers when subscribe is called. Network requests are the good example of cold observable where observables starts pushing data only after observer subscribes to the observable and no requests will be made till observer subscribe to the observable.

### Observer

Observer subscribes to the observable sequence. Then the observer reacts to whatever element or sequence of elements the observable emits, till the sequence completes normally or terminated by some error event.

### Events

Primarily there three types of events an observable can emit which will be subscribed by the observer. It is described by the Event enum in RxSwift library as:

- `.next(value: T)` — This method is called whenever whenever the Observable emits an element. Observable can call this method one or more times till the sequence completes.
- `.error(error: Error)` — This method gets called by observable whenever it encounters an error while emitting an elements or fails to generate expected data. No further calls will be made to `onNext:` or `onCompleted` after the error event occurs. An error of `Swift.Error` type is provided with `onError:` method to share the details of the error to the observer.
- `.completed` — This method is called by source observable after the observable has emitted all of its elements with `onNext:` method without any occurrence of error. This simply indicates that the observable sequence has completed successfully and no elements will be emitted after this method by the observable.

### How to create an observable

We will create an observable using different methods (operators) available in RxSwift.

1. `Observable.just()`: This method returns an observable sequence that contains a single element.

```swift
let observable: Observable<String> = Observable.just("Hello RxSwift")
```

Above example shows an observable which emits a String called *“Hello RxSwift”*.
2. `Observable.of()`: This method creates a new Observable instance with a variable number of elements. The sequence is synchronous means it will maintain the order of emitted values.

```swift
let observable: Observable<Int> = Observable.of(1, 2, 3, 4, 5)
```

In above example we are creating an observable sequence of Int values which starts from 1 and emits till value 5.
3. `Observable.from()`: This method takes array of elements like String, Int etc. and converts an array into an observable sequence.

```swift
let observable: Observable<Int> = Observable.from([1, 2, 3, 4, 5])
```

In the above example above `Observable.just()` method takes the array of Int values [1, 2, 3, 4, 5] and coverts the array into Observable sequence of Int values. Notice the return type is `Observable<Int>` not `Observable<[Int]>` as Int array values will be emitted in sequence individually.
4. `Observable.create()`: We can create an Observable from scratch by using the Create function with some custom logic. We pass this create operator a function that accepts the observer as its parameter. Inside this function we call the observer’s onNext, onCompleted or onError methods appropriately to make it behave it like Observable. This is an example of Cold Observable as this method will not emit any values until subscribe is called by the observer.

For example, this function can be used to convert the network response into Observable sequence after JSON parsing is done by passing the model object in onNext method or pass the error in onError method.

```swift
let observable: Observable<String> = Observable.create { observer -> Disposable in
    observer.onNext("Hello RxSwift")
    observer.onCompleted()
    return Disposables.create {}
}
```

### Subscribing to Observables

As we learned earlier, observers can subscribe to observable sequence to receive event notification for the data as they arrive. More importantly an observable won’t emit any values until it has any subscribers. We can observe the values of an observable by calling subscribe() function.

```swift
import Foundation
import RxSwift

let observable = Observable<String>.of("😀", "😎", "😛")
observable.subscribe { (event: Event<String>) in
    switch event {
    case let .next(value):
        print("next: \(value)")
    case let .error(error):
        print("next: \(error)")
    case .completed:
        print("completed")
    }
}

-----output-----
next: 😀
next: 😎
next: 😛
completed
```

In the above example, subscribe method takes escaping closure that takes an `Event<String>` enum which has 3 cases as discussed in observer section. We can see output printed 3 *“next”* string values (aka emoji’s “😀”, “😎”, “😛”) in the console and at last *“completed”* event gets printed which signals the end of sequence.

Subscribe method also has separate handler for `onNext`, `onCompleted` and `onError` event to handle next, error and completed event separately:

```swift
import Foundation
import RxSwift

let observable = Observable<String>.of("😀", "😎", "😛")
observable
    .subscribe(onNext: { (value) in
        print("next: \(value)")
    }, onError: { (error) in
        print("error: \(error)")
    }, onCompleted: {
        print("completed")
    })

----output----  
next: 😀
next: 😎
next: 😛
completed
```

### Disposing Observables using DisposeBag

When a sequence sends the `completed` or `error` event all the resources used by observable elements will be freed.

The subscribe method returns a `Disposable` type which is a protocol containing single method `dispose()` it can be used to cancel the subscription manually which will cancel production of sequence elements and free resources immediately.

```swift
import Foundation
import RxSwift

let observable = Observable<Int>.of(1, 2, 3)
let subscription = observable
    .subscribe(onNext: { (value) in
        print("next: \(value)")
    }, onError: { (error) in
        print("error: \(error)")
    }, onCompleted: {
        print("completed")
    }, onDisposed: {
        print("disposed")
    })

subscription.dispose()

----output----
next: 1
next: 2
next: 3
completed
disposed
```

#### DisposeBag

In RxSwift there is a concept of DisposeBag which accumulates all the disposables and call the dispose method when the DisposeBag object gets deallocated. It’s a standard practice to add all the subscription to disposeBag using disposed(by:) method provided by subscription even if the subscription in finite.

```swift
import Foundation
import RxSwift

/*!
 * @brief: TodoListViewModel requests the todoList data from the network.
 */
final class TodoListViewModel {

    let disposeBag = DisposeBag()
    var posts: [Post] = []
    
    func getTodoList() {
        let postsObservable: Observable<[String]> = NetworkService.loadTodoList()
        postsObservable
            .subscribe(onNext: { todoList in
                print("TodoList: \(todoList)")
                //update view with todos
            }, onError: { (error) in
                print(error.localizedDescription)
            }).disposed(by: disposeBag)
    }
}

/*!
 * @brief: Loads the todoList from the network.
 */
final class NetworkService {

    static func loadTodoList() -> Observable<[String]> {
        return Observable.create({ observer -> Disposable in
            let posts = ["Complete office Work", "Attend dinner with friends"]
            observer.onNext(posts)
            observer.onCompleted()
            return Disposables.create()
        })
    }
}
```

In above example we have TodoListViewModel class which loads the TodoList from the *NetworkService*. In TodoListViewModel we have created DisposeBag instance which stores the subscription created by subscribing to the `Observable<[String]>` returned by `NetworkService.loadTodoList()` method using `disposed(by: disposeBag)`. As the `TodoListViewModel` will be deallocated the disposeBag object will call dispose on all of it’s subscriptions and all the subscriptions will be terminated.