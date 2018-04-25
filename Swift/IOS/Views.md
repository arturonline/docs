# Views

Every application has a single instance of `UIWindow` that serves a the container for all the views in the application. When a view is added to the window, it is said to be a `subview` of the window.

UIWindow is a subclass of `UIView`, os the window itself is a view. Views that are subviews of the window can also have a subview.

## Views programmatically

To initialize a view programmatically, you need a `CGRect` that specifies the view's size and its position relative to its superview:

```Swift
let frame = CGRect(x: 160, y: 240, width: 100, height: 150)
let firstView = UIView(frame: frame)
view.addSubview(firstView) // here you add the view to the hierarchy
```