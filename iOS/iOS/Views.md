# Views

Every application has a single instance of `UIWindow` that serves a the container for all the views in the application. When a view is added to the window, it is said to be a `subview` of the window. `UIWindow` is a subclass of `UIView`, os the window itself is a view. Views that are subviews of the window can also have a subview.

`UIWindows` has a rootViewController property. When a view controller is set as the windows's rootViewController, that view controller's view gets added to the windows's view hierarchy. When the application launches, the initial view controller for the main interface gets set as the rootViewController of the windows.

## Views programmatically

Everything that you can do in Interface Builder can also be done programmatically, including setting up all child views and adding them to the screen.

To initialize a view programmatically, you need a `CGRect` that specifies the view's size and its position relative to its superview:

```Swift
let frame = CGRect(x: 160, y: 240, width: 100, height: 150)
let firstView = UIView(frame: frame)
view.addSubview(firstView) // here you add the view to the hierarchy
```

When you work with Auto Layout Programmatically, you will use _anchors_ to create your constraints. Anchors are properties on the view that correspond to attributes that you might want to constraint to an anchor on another view.

Those attributes are:

`NSLayoutAttribute.left`
`NSLayoutAttribute.right`
`NSLayoutAttribute.leading`
`NSLayoutAttribute.trailing`
`NSLayoutAttribute.top`
`NSLayoutAttribute.bottom`
`NSLayoutAttribute.width`
`NSLayoutAttribute.height`
`NSLayoutAttribute.centerX`
`NSLayoutAttribute.centerY`
`NSLayoutAttribute.firstBaseline`
`NSLayoutAttribute.lastBaseline`

There are additional attributes that handle the margins associated with a view, such as:

`NSLayoutAttribute.leadingMargin`