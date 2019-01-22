# Custom Table View Cells

In addition to the four styles (*Basic*, *Subtitle*, *Right Detail*, and *Left Detail*) covered in the previous lesson, Interface Builder provides a fifth option: **Custom**.

## How to create and use a custom Cell

1. Open `Main.storyboard` and select the table view cell. In the Attributes Inspector, make sure the Style is set to *Custom*. You should now have a blank cell to work with.
2. Personalize the cell with labels, buttons, views...
3. Create a cocoa touch subclass of `UITableViewCell` (ex: EmojiTableViewCell.swift)
4. Back in the storyboard, update the identity of the cell to be of that type (ex: EmojiTableViewCell)
5. Add outlets to the new class file for each label or views.
6. Create an update function to update the cell:
    ```Swift
    func update(with emoji: Emoji) {
        symbolLabel.text = emoji.symbol
        nameLabel.text = emoji.name
        descriptionLabel.text = emoji.description
    }
    ```
7. The last step will be to update the `tableView(_:cellForRowAt:)` method to use your new cell.

```swift
override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {

    //Step 1: Dequeue cell
    let cell = tableView.dequeueReusableCell(withIdentifier: "EmojiCell", for: indexPath) as! EmojiTableViewCell

    //Step 2: Fetch model object to display
    let emoji = emojis[indexPath.row]

    //Step 3: Configure cell
    cell.update(with: emoji)
    cell.showsReorderControl = true

    //Step 4: Return cell
    return cell
}
```