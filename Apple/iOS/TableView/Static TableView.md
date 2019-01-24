# Static Table View

You'll use static table views when you know exactly how your table view will be formatted, regardless of the specific information it will display.

For static table views, you'll always use a table view controller which should not implement the data source protocol. Instead, you'll use the `viewDidLoad()` method to populate the table view's data.

When you create a new `UITableViewController` subclass, you'll need to remember to delete or comment out the data source methods that are provided in the file. Otherwise your static table view will attempt to use the empty data source methods and you'll end up with an empty table view.

## How to

In your storyboard, add a navigation controller from the Object library to the scene, which will include a table view controller alongside it.

With the tableView selected, go to the attributes inspector -> *Content* -> `Static Cells`
