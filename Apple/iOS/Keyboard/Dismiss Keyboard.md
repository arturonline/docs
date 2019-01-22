# Dismiss Keyboard

## Approach #1: resignFirstResponder

When a text field is tapped, the method `becomeFirstResponder()` is called on it. This is the method that, among other things, causes the keyboard to appear. To dismiss the keyboard, you call the method `resignFirstResponder()` on the that text field.

```swift
let tapGesture = UITapGestureRecognizer(target: self, action: #selector(dismissTeclado))
myTextField.addGestureRecognizer(tapGesture)

func dismissTeclado() {
    myTextField.resignFirstResponder()
}
```

## Approach #2: endEditing

first of all write this extension in any swift file

```swift
extension UIViewController {
    func hideKeyboardWhenTappedAround() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboard))
        view.addGestureRecognizer(tap)

    }

    func dismissKeyboard() {
        view.endEditing(true)
    }
}
```

Than in viewDidLoad of that View only call in any view controller there are textFields.

```swift
self.hideKeyboardWhenTappedAround()
```

## Approach #2: Using UIView’s endEditing

Assuming your text field is a subview of the view you call this on, most of the time, you should be able to do the following:

```swift
self.view.endEditing(true)
```

## Approach #3: Dismiss Keyboard on Return

It would be great if the user could tap the Return key on the keyboard to dismiss it, making it easier to interact with the other controls.
Control-drag from the text field to the view controller source file. Create an action that will fire when Return is tapped. When the action occurs, resign the text field from its role as the first responder:

```swift
“@IBAction func returnPressed(_ sender: UITextField) {
    titleTextField.resignFirstResponder()
}
```
