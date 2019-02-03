# Working with textField

## Hide keyboard when Enter key is pressed

```swift
extension AddItemTableViewController: UITextFieldDelegate {

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return false
    }
```

## Enable a Button only if something is entered on the textField

1. We create an *"add Button"*
2. we disable the button in interface builder.
3. To check if the user has entered something in the textfield:

```swift
    // Examine what the user is entering in the textField
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        guard let oldText = textField.text, let stringRange = Range(range, in: oldText) else {
            return false
        }
        let newText = oldText.replacingCharacters(in: stringRange, with: string)
        if newText.isEmpty {
            // Enable button if something is entered in textField
            addBarButton.isEnabled = false

        } else {
            addBarButton.isEnabled = true
        }
        return true
    }

}
```