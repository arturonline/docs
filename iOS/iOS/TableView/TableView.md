# TableView

## UITableViewController vs tableView

In Xcode when create a new view controller to contais a tableview you have two options:

1. Create a new `UITableViewController`
2. Create a new `UIViewController` and embed the tableview.

You have to write the delegate and protocol methods regardless of which of the two approaches you take.

There are only two possible reasons you should choose to use `UIViewController` over `UITableViewController` when you need a view controller with a table view:

1. You need the table view to be smaller than the view controller's view.
2. You need to add additional views to the view controller that don't scroll with the table view (though there are ways to solve this with UITableViewController).

Example:

If you just want to display grocery items list with some header and footer, then `tableviewcontroller` should be priority. But if you want to display mail items in tableview, you would need some additional buttons for altering items in mail(tableview). For later case, you will use `viewcontroller`.

Here are all of the things that UITableViewController does for you that you would need to replicate:

* Defines and setups up the UITableView.
* Sets itself as the table view's dataSource and delegate.
* Overrides the setEditing:animated: method to also set the editing property of the table view.
* Deselects the last selected row in the viewWillAppear: method depending on the clearsSelectionOnViewWillAppear property.
* Flashes the table view's scrollbars in the viewDidAppear: method.
* Hooks up the refresh control (as of iOS 6).
* Reloads the table view the first time it will appear.
* Adjusts the table view's contentInset (as of iOS 7).
* Scrolls the table view as needed when the keyboard appears.

## How to

![UITableView diagram](tableView.png)

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
