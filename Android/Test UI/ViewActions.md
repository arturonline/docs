# Performing Actions

Call the ViewInteraction.perform() or DataInteraction.perform() methods to simulate user interactions on the UI component. You must pass in one or more ViewAction objects as arguments. Espresso fires each action in sequence according to the given order, and executes them in the main thread.

The ViewActions class provides a list of helper methods for specifying common actions. You can specify such actions as:

`ViewActions.click(): Clicks on the view.`

`ViewActions.typeText(): Clicks on a view and enters a specified string.`

`ViewActions.scrollTo(): Scrolls to the view. The target view must be subclassed from ScrollView and the value of its  android:visibility property must be VISIBLE.`

`ViewActions.pressKey(): Performs a key press using a specified keycode.`

`ViewActions.clearText(): Clears the text in the target view.`