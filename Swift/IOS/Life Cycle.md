# Life Cycle

When an application changes its state, a method is called on the application delegate.

![States and Transitions](resources/states.png)

| State       | Visible | Receives Events | Executes Code |
| ----------- | ------- | --------------- | ------------- |
| Not running | no      | no              | no            |
| Active      | yes     | yes             | yes           |
| Inactive    | mostly  | no              | yes           |
| Background  | no      | no              | yes           |
| Suspended   | no      | no              | no            |

## When to override Life Cycles

Override `viewDidLoad()`if the configuration only needs to be done once during the run of the app.
Override `viewWillAppear(_:)` if you need the configuration to be done each time the view controller's view appears onscreen.