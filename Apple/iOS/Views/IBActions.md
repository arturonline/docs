# Actions & Outlets

A connection lets one object know where another object is in memory so that the two objects can communicate. There are two kinds of connections that you can make in Interface Builder: *outlets* and *actions*. An outlet is a reference to an object. An action is a method that gets triggered by a button or some other view that the user can interact with, like a slider or a picker.

## Outlets

You'll often need a way to reference your visual elements in code so that they can be adjusted at runtime, or when the app is already running. This reference from Interface Builder to code is called an `outlet`.

Outlets allow you to access properties on your views and controls.

For example, to access a `Slider` in your canvas from code:

1. Define a view property in your ViewController.swift

    ```swift
    @IBOutlet weak var toggle: UISlider!
    ```
2. Open Main.Storyboard
3. Drag the Slider to the scene
4. Drag-Control from the View Controller in the document outline to the view (slider) and select the `togle` property.

## IBActions

When you have an object that you want the user to interact with, you create an action, a reference to a piece of code that will execute when the interaction takes place.

## To add Actions with IB

You normally, add actions to your code using the Control-drag shortcut:

1. Open Main.Storyboard
2. Drag the button to the scene.
3. Open assistan editor to see the corresponding ViewController.swift
4. Drag-Control from the object to the controllerView.

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
