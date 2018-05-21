# Navigation Controller

`UINavigationController` maintains an array of view controllers  in a stack. When a `UIViewController` is on top of the stack, its view is visible.

When you initialize an instance of `UINavigationController`, you give it a `UIViewController`. This UIViewController is added to the array and becomes the navigation controller's `root view controller`.

UINavigationController's `topViewController` property keeps a reference to the view controller at the top of the stack.

UINavigationController is a subclass of UIViewController, so it has a view of its own. Its view always has two subviews: a `UINavigationBar` and the view of the `topViewController`.

UINavigationController is a subclass of UIViewController, so it has a view of its own. its view always has two subviews: a `UINavigationBar` and view of `topViewController`.

## UINavigationBar

Every UIViewController has a navigationItem property of type `UINavigationItem`. When a `UIViewController` comes to the top of a UINavigationController's stack, the UINavigationBar uses the UIViewController's `navigationItem` to configure itself. The navigation item supplies the navigation bar with the content it needs to draw.

Example, to configure the title for every viewController:

```Swift
var item: Item! {
    didSet {
        navigatiItem.title = item.name
    }
}
```

A `navigation item` can hold more than just a title string. There are three customizable areas for each UINavigationItem:

- a leftBarButtonItem (UIBarButtonItem)
- a rightBarButtonItem (UIBarButtonItem)
- a titleView (UITextField)