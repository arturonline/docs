# IBActions

“How does Interface Builder connect controls to actions?”

## To add Actions with IB

You normally, add actions to your code using the Control-drag shortcut:

1. Open Main.Storyboard
1. Drag the button to the scene.
1. Open assistan editor to see the corresponding ViewController.swift
1. Drag-Control from the object to the controllerView.

```Swift
@IBAction func buttonTapped(_ sender: Any) {

}
```

## To add Actions Programmatically

In order to connect the button to a method programmatically, you'll need a reference to the button in code. Use Interface Builder to create an IBOutlet for the button.

```Swift
@IBOutlet weak var button: UIButton!
```

```Swift
button.addTarget(self, action: #selector(buttonTapped(_:)),
for: .touchUpInside)
```

The `addTarget(_:action:for:)` method will connect the control to a particular action, and it requires three arguments.

1. The first argument is the the owner of the function you want to execute. The owner of the `buttonTapped(_:)` method is the `ViewController`, or `self`.
1. The second argument is a "selector": the name used to select a method to execute for an object. Swift uses `#selector` as its syntax to locate a particular method.
1. The last argument is the event that should trigger the action.
