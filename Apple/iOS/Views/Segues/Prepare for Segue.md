# Prepare for Segue

Whenever a segue gets triggered, it provides a place for you to add your own code that gets executed. This method is called `prepare(for:sender:)`, and it gives you a chance to store data and do any necessary cleanup on the view controller that the segue is coming from.

```Swift
override func prepare(for segue: UIStoryboardSegue, sender: Any?)
```

- `segue`: The segue object containing information about the view controllers involved in the segue.
- `sender`: The object that initiated the segue. You might use this parameter to perform different actions based on which control (or other object) initiated the segue.

The default implementation of this method does nothing. Subclasses override this method and use it to configure the new view controller prior to it being displayed. The segue object contains information about the transition, including references to both view controllers that are involved.

Because segues can be triggered from multiple sources, you can use the information in the segue and sender parameters to disambiguate between different logical paths in your app. For example, if the segue originated from a table view, the sender parameter would identify the table view cell that the user tapped. You could then use that information to set the data on the destination view controller.

Each segue has:

1. A `Style`: how the view controller weill be presented.
2. An `Action`: The view object that triggers the segue.
3. An `Identifier`: To programatically access the segue.
