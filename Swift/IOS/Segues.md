# Segues

A segue defines a transition and the presentation method from one view controller to another.

Each segue has:

1. A `Style`: how the view controller weill be presented.
2. An `Action`: The view object that triggers the segue.
3. An `Identifier`: To programatically access the segue

## Unwind Segue

While a `segue` transitions to another scene, aun `unwind segue` transitions *from* the current scene to return to a previously displayed scene.