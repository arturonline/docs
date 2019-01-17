# Table View Cells

A table view could be responsible for displaying thousands and thousands of model objects; each object that's displayed has a cell, each with possibly multiple views. You know that mobile device memory is at a premium, so this fact should cause some concern.

Fear not. To address this very issue, table views load only the visible cells—plus a few more, just outside the visible field, for quick access. Think about it. As the user scrolls through a table view, cells leave the visual field, and others are displayed in their places. Typically, the cells entering the visual field are the ones that left the visual field moments ago. So it could be feasible to take the cell that just left and reuse it as the cell that's about to enter, right?

This process, called dequeueing, is precisely how table views manage their cells. You can register each cell type in your table view with a reuseIdentifier string. The table view can then manage a stockpile of cells for each reuse identifier. When you want a cell, you use the table view instance method, `dequeueReusableCell(withIdentifier:for:)`, passing in the reuse identifier for the desired cell type—which asks the table view instance fot the next cell in the stockpile.

```swift
let cell: UITableViewCell =
tableView.dequeueResuableCell(withIdentifier: "Cell", for:
indexPath)
```

Through the process of dequeueing, the table view only creates and loads several cells, rather than one cell for every piece of information displayed. Dequeueing saves memory and allows for a smooth flow when scrolling through table views—providing the best possible user experience.
