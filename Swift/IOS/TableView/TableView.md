# TableView

UITableView is a view object. As a view object it does not handle application logic or data.

To get the table working you could need:

1. A controller to handle appearance - `UITableViewController`
2. A data source to handle data - `UITableViewDataSource`
3. A delegate to inform other objects of events involving the table - `UITableViewDelegate`

![UITableView diagram](resources/tableView.png)

When a `UITableViewController` creates its view, the *dataSource* and *delegate* properties of the `UITableView` are automatically set to point at the `UITableViewController`.

When a `UITableView` wants to know what to display, it calls methods from `UITableViewDataSource` protocol. There are two required methods:

```Swift
tableView(_:numberOfRowsInSection:)
// This method tells the tableView how many rows it should display
```

```Swift
tableView(_:cellForRowAt:)
// This method tells the table view what content to display in each row
```

## UITableViewCells

Each row of a table view is a view. These views are instances of `UITableViewCell`.

## Reusing cells

```Swift
dequeueReusableCell(withIdentifier: "xxx", for: indexPath)
```

## content Insets, avoid underlaping status bar

To have the table view cells not underlap the status bar, you will need to add some padding to the top o the table view. For this we use the `contentInset`property.

The `content inset` is the padding for all four sides of the view.

```Swift
    override func viewDidLoad() {
        super.viewDidLoad()

        //get the height of the status bar
        let statusBarHeight = UIApplication.shared.statusBarFrame.height

        let insets = UIEdgeInsets(top: statusBarHeight, left: 0, bottom: 0, right: 0)
        tableView.contentInset = insets
        tableView.scrollIndicatorInsets = insets
    }
```
