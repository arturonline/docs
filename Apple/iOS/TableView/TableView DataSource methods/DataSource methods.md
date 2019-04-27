# TableView DataSource Methods

```swift
// Tells the data source to return the number of rows in a given section of a table view.

override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return itemArray.count
}
´´´

``swift
// Asks the data source for a cell to insert in a particular location of the table view.

override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {


    let cell = tableView.dequeueReusableCell(withIdentifier: "ToDoItemCell", for: indexPath)
    cell.textLabel?.text = itemArray[indexPath.row]

    return cell
}
```