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