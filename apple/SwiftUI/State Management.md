# State Management

Link: [swiftbysundell](https://www.swiftbysundell.com/articles/swiftui-state-management-guide/)

## @state

Marking a variable using SwiftUI's `State` property wrapper creates a connection between the value and the view itself - meaning that the view will be re-rendered every time either of those values are changed.

So State is used to represent the internal state of a SwiftUI view, and to automatically make a view update when that state was changed. It’s therefore most often a good idea to keep State-wrapped properties private, which ensures that they’ll only be mutated within that view’s body (attempting to mutate them elsewhere will actually cause a runtime crash).

## @Binding

A Binding-marked property provides a two-way connection between a given view and a state property defined outside of that view.

### Two way binding

Both State and Binding-wrapped properties can be modified by the view by prefixing their property name with `$`.

## Observing objects

What both State and Binding have in common is that they deal with values that are managed within a SwiftUI view hierarchy itself. However, while it’s certainly possible to build an app that keeps all of its state within its various views — that’s not typically a good idea in terms of architecture and separation of concerns, and can easily lead to our views becoming quite massive and complex.

The `ObservableObject` protocol which, when combined with the ObservedObject property wrapper, provides a mechanism that enable us to connect external model objects to our various views.

The Published property wrapper is used to define which of an object’s properties that should cause an observation notification to be triggered when modified.

## Environment

Environment system can be used to pass various pieces of state between two views that are not directly connected to each other. Although it’s often easy to create bindings between a parent view and one of its children, it can be quite cumbersome to pass a certain object or value around within a whole view hierarchy — and that’s exactly the type of problem that the environment aims to solve.