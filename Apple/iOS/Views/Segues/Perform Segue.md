# Perform Segue

A segue defines a transition and the presentation method from one view controller to another.

```swift
performSegue(withIdentifier: "gotoSecondVC", sender self)
```

* sender: The object that you want to use to initiate the segue. This parameter makes the object available to your implementation during the segue.
* Identifier: In Interface Builder, you can provide an **identifier** to a `segue` using the inspector. Pass this string to this parameter.