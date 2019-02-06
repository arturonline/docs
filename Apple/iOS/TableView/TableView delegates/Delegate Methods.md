# Most used delegate methods

## What to do when a cell is selected

```swift
override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    // Here what to do when the cell is selected
}
```

## How to deselect a row

```swift
tableView.deselectRow(at: indexPath, animated: true)
```

## Enter edit mode

In order to move or delete cells you need to enter editing mode. Typically, but not necessarily, a table view will enter editing mode when the user taps an Edit button in the navigation bar.

### case #1 You are in a UITableViewController

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    navigationItem.leftBarButtonItem = editButtonItem
}

override func setEditing(_ editing: Bool, animated: Bool) {
    super.setEditing(editing, animated: animated)
    tableView.setEditing(editing, animated: animated)
}
```

Next, implement the `tableView(_:, moveRowAt fromIndexPath:, to:)` method.

### case #2 From a ViewController

Add a bar button item to the left slot of the table view controller's navigation bar. Choose Edit for the System Item property of the bar button, then add an IBAction from the Edit button to the table view controller.

```swift
@IBAction func editButtonTapped(_ sender: UIBarButtonItem) {
    let tableViewEditingMode = tableView.isEditing

    tableView.setEditing(!tableViewEditingMode, animated: true)
}

```

Next, implement the `tableView(_:, moveRowAt fromIndexPath:, to:)` method.

But maybe you want to remove the delete indicator. If so, you could add the following method to the table view controller:

```swift
override func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCellEditingStyle {
    return .none
}
```

## Allow select multiple rows

```swift

```