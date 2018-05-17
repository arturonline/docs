# Events

When you touch a view, an event is created. This touch event is tied to a specific location in the view controller's view. That location determines which view in the hierarchy the touch event is delivered to.

When your app receives an event, UIKit automatically directs that event to the most appropriate responder object. However, views in your application can also respond to events without being touched. In order to respond to this touch events they need to become the `first responder`.

First responder it's a property of the `window`. The window has at all times no more than one first responder. Any UIResponder can claim first responder status by being sent `becomeFirstResponder`.

## Dismissing the keyboard from textField

### By pressing the Return key

1. Conform to `UITextFieldDelegate`
2. Implement `textFieldShouldReturn(_:)` to call `resignFirstResponder()`
3. Finally, open `Main.storyboard` and drag from the textField to the viewController and choose `delegate`.

### By tapping elsewhere

1. Open `Main.storyboard` and drag `Tap gesture Recognizer` from the library onto the background.
2. Drag from the tap gesture recognizer in the scene dock, in your viewController implementation.
3. In the pop-up select `Action`, a name, and for the Type choose `UITapGestureRecognizer`.
4. Update the method to call `view.endEditing(true)`.

### When the user taps the back button

Just update the implementation of `viewWillDisappear(_:)` to call `view.endEditing(true)`.