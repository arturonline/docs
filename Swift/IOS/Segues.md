# Segues

A segue defines a transition and the presentation method from one view controller to another.

Each segue has:

1. A `Style`: how the view controller weill be presented.
2. An `Action`: The view object that triggers the segue.
3. An `Identifier`: To programatically access the segue

Whenever a segue gets triggered, it provides a place for you to add your own code that gets executed. This method is called `prepare(for:sender:)`, and it gives you a chance to store data and do any necessary cleanup on the view controller that the segue is coming from.

```Swift
override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    super.prepare(for: segue, sender: sender)
    }

// TODO
```

## Unwind Segue

While a `segue` transitions to another scene, aun `unwind segue` transitions _from_ the current scene to return to a previously displayed scene.

An `unwind` segue moves backward through one or more segues to return the user to a scene managed by an existing view controller. While regular segues create a new instance of the destination view controller, unwind segues let you return to view controllers that already exist. Use unwind segues to implement navigation back to an existing view controller.
