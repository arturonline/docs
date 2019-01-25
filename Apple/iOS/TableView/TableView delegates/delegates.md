# Most used delegate methods

## How to know if a cell is selected

```swift
override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {

}
```

## How to deselect a row

```swift
tableView.deselectRow(at: indexPath, animated: true)
```