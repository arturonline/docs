# Navigation Controller

`UINavigationController` maintains an array of view controllers presenting related information in a stack. When a `UIViewController` is on top of the stack, its view is visible.

When you initialize an instance of `UINavigationController`, you five it a `UIViewController`. This UIViewController is added to the array and becomes the navigation controller's `root view controller`.

UINavigationController's `topViewController` property keeps a reference to the view controller at the top of the stack.

UINavigationController is a subclass of UIViewController, so it has a view of its own. Its view always has two subviews: a `UINavigationBar` and the view of the `topViewController`.

