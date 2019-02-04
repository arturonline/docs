# Cell methods

```swift
// get number of items
let rowIndex = items.count

// create cell position (last)
let indexPath = IndexPath(row: rowIndex, section: 0)

// pass position to insert cell
tableView.insertRows(at: [indexPath], with: .automatic)
```

## Delete row

```swift
func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {

        // update model
        items.remove(at: indexPath.row)
        // delete row
        tableView.deleteRows(at: [indexPath], with: . automatic)
}
```

## Deselect row

```swift
func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    if let cell = tableView.cellForRow(at: indexPath) {
        // ...
    }
    tableView.deselectRow(at: indexPath, animated: true)
}
```

## Locate cell with tag

```swift
let cell = cell.viewWithTag(1001) as? UILabel
```