# The transform Property

The transform property can be used to change the scale, rotate, or move the view without calculating changes to the view's frame.

| Type      | Initializer                            | Parameter Description                                                                   |
| --------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| Scale     | `CGAffineTransform(scaleX: CGFloat, y: CGFloat)`        | The factors by which to scale your view                                                 |
| Rotate    | `CGAffineTransform(rotationAngle: CGFloat)`             | The angle (in radians) by which to rotate your view. Positive value = Counterclockwise. |
| Translate | `CGAffineTransform(translationsX: CGFloat, y: CGFloat)` | The value by which to move (shift) your view.                                           |

## examples

```Swift
// Double the height and width of the view
let scaleTransform = CGAffineTransform(scaleX: 2.0, y: 2.0)

 // Rotate the view 180 degrees
let rotateTransform = CGAffineTransform(rotationAngle: .pi)

 // Move the view 200 points to the right and 200 points down
let translateTransform = CGAffineTransform(translationX: 200, y:
200)
```

It's also possible to combine transform instances by concatenating them. The following code combines the three transforms in the previous example into a single transform that's assigned to the square view:

```Swift
UIView.animate(withDuration: 2.0) {
    square.backgroundColor = .orange

    let scaleTransform = CGAffineTransform(scaleX: 2.0, y: 2.0)
    let rotateTransform = CGAffineTransform(rotationAngle: .pi)
    let translateTransform = CGAffineTransform(translationX:
    200, y: 200)
    let comboTransform =
    scaleTransform.concatenating(rotateTransform).concatenating
    (translateTransform)

    square.transform = comboTransform
}
```

There's one more property of the CGAffineTransform type that may be useful: identity. You use the identity property to undo any animations you just implemented. The following code uses the completion handler to undo the CGAffineTransform animations:

```Swift
UIView.animate(withDuration: 2.0, animations: {
    square.backgroundColor = .orange

    let scaleTransform = CGAffineTransform(scaleX: 2.0, y: 2.0)
    let rotateTransform = CGAffineTransform(rotationAngle: .pi)
    let translateTransform = CGAffineTransform(translationX:
    200, y: 200)
    let comboTransform =
    scaleTransform.concatenating(rotateTransform).concatenating
    (translateTransform)

    square.transform = comboTransform
}) { (_) in

    UIView.animate(withDuration: 2.0, animations: { 
        square.transform = CGAffineTransform.identity
    })
 }
```

Note that the color is still orange because applying the identity property will only undo the CGAffineTransform changes.