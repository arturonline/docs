# Animations

The UIView class defines several properties that can be animated:

* frame
* bounds
* center
* transform
* alpha
* backgroundColor

To animate a view, you'll change the property's value in an animation closure, and Core Animation will handle the rest.

## Animation Closures

The UIView class defines several class methods that accept a closure within which you can update the animatable properties on your views. The method then handles the calculations to animate the changes over time. The methods vary in the number of parameters they accept. Use the method with the parameters that match your needs.

```Swift
 animate(withDuration:animations:)
 animate(withDuration:animations:completion:)
 animate(withDuration:delay:options:animations:completion:)
```

### Animate with Duration

```Swift
 animate(withDuration:animations:)
```

* `Duration`: its value represents the number of seconds allocated for the animation.<br>
* `Animations`: is a closure that contains changes to the animatable properties. For example, the following code will animate the alpha change (provided there is a change) over the course of two seconds:

```Swift
UIView.animate(withDuration: 2.0) {
    aView.alpha = 0.3
}
```

### Animate with completion Handler

If you try to run 2 animations, the second animation call is executed immediately after the first call, so Core Animation may skip the first animation and start executing the new instructions. One way to fix this is to call the second animation after the first animation is completed. You can do by using:

```Swift
UIView.animate(withDuration:, animations:, completion:) method.
```

The `completion block` is a block object to be executed when the animation sequence ends. This block has no return value and takes a single Boolean argument that indicates whether or not the animations actually finished before the completion handler was called. If the duration of the animation is 0, this block is performed at the beginning of the next run loop cycle. 

```Swift
UIView.animate(withDuration: 3.0, animations: { 
    square.backgroundColor = .orange
    square.frame = CGRect(x: 150, y: 150, width: 200, height:
    200)
}) { (_) in

    UIView.animate(withDuration: 3.0) {
        square.backgroundColor = .purple
        square.frame = smallFrame
    }
}
```

### Animate with delay or custom options

The third common method used for animations is UIView.animate(withDuration:, delay:, options:, animations:), which introduces two new parameters. The delay parameter represents the number of seconds to delay the start of the animation. The options parameter is an array of predefined options for customizing animations. For example, you can set your animation to repeat, or you can set a timing curve for the animation. Check out the documentation for available [UIViewAnimationOptions](https://developer.apple.com/documentation/uikit/uiviewanimationoptions).

The following code moves square from the top-left corner to the bottom-right corner over three seconds after a two-second delay, and repeats the animation indefinitely with no completion closure:

```Swift
UIView.animate(withDuration: 3.0, delay: 2.0, options:
[.repeat], animations: {
    square.backgroundColor = .orange
    square.frame = CGRect(x: 400, y: 400, width: 100, height: 
    100)
}, completion: nil)
```