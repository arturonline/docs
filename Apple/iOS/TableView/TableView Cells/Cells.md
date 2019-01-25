# Table View Cells

Every row in a table view is represented with a **table view cell**, a `UITableViewCell` instance. Cells are reusable views that can display text, images, or any other UIView.

In editing mode, the cell content size shrinks to allow room for the editing and reorder controls.

The UITableViewCell class defines three properties for cell content:

* `textLabel`, a `UILabel` for the title
* `detailTextLabel`, a `UILabel` for the subtitle (if there's additional detail)
* `imageView`, a `UIImageView` for an image

## Standard cell styles

The UIKit framework defines four standard cell styles, all of the class `UITableViewCellStyle`. Each style has its own layout of the content properties, and may not support all three properties.

* **Basic**: `.default` with a label on the left side.
* **Subtitle**: `.subtitle` with a label on the left and a label below in smaller gray.
* **Right Detail**: `.value1` with a label on the left side and a label on the right side.
* **Left Detail**: `.value2` with a label on the left and a small detail label

## Accesory view

When the table is in default (view-only) mode, cells can display an **accessory view**, `UITableViewCellAccessoryType`. The iOS SDK defines five standard types of *accessory views*, some of which can respond to user touches, like a button. With a delegate method, you can respond and execute code when the user taps the accessory view.

`.none`: no accesory view is displayed
`.disclosureIndicator`: a right arrow like a chevron. Triggers a push action.
`.detailDisclosureButton`: an info button.
`.checkmark`

## How it works

A table view could be responsible for displaying thousands of model objects but it only loads the visible cells plus a few more, just outside the visible field, for quick access. Typically, the cells entering the visual field are the ones that left the visual field moments ago. This process, called **dequeueing**, is precisely how table views manage their cells. You can register each cell type in your table view with a reuseIdentifier string. The table view can then manage a stockpile of cells for each reuse identifier. When you want a cell, you use the table view instance method, `dequeueReusableCell(withIdentifier:for:)`, passing in the reuse identifier for the desired cell type—which asks the table view instance fot the next cell in the stockpile.

```swift
let cell: UITableViewCell =
tableView.dequeueResuableCell(withIdentifier: "Cell", for:
indexPath)
```

## Index Paths

Many of the API methods for table views either accept an *index path* as a parameter or return an *index path*. As you might guess, an index path points to a specific **row** in a specific **section** of a table view. You can access these values through the row and section properties. Just like in arrays, these values are zero-based.