# Testing

A new created Test project has two classes in it. `AppInitializer` contains code to help initialize and setup tests. The other class, `Tests`, contains boilerplate code to help start the *UITests*.

UITest automates the user interface by activating controls on the screen and providing input anywhere a user would normally interact with the application.

Typically, each Xamarin.UITest is written as a method that's referred to as a `[Test]`. The class that contains the test is known as a `[TestFixture]`.

Before any *UITests* can be written, the Xamarin.Forms application must ensure that all controls in the user interface have a **AutomationId** so that they can be referenced in test code.

## Example

```xml
<StackLayout Margin="0,50,0,0" VerticalOptions="StartAndExpand">

    <Entry AutomationId="EntryPhoneNumber" Placeholder="Enter Phone Number" x:Name="entryPhoneNumber"/>
    <Button AutomationId="ValidateButton" Text="Validate" Clicked="PhoneNumberValidate"/>
    <Label AutomationId="ResultLabel" x:Name="lblResult"/>

</StackLayout>
```

```cs
 [Test]
public void PhoneNumberValidateTest()
{

    app.WaitForElement(c => c.Marked("EntryPhoneNumber"));
    app.EnterText(c => c.Marked("EntryPhoneNumber"),"1234567890");

    app.Tap(c => c.Marked("ValidateButton"));
    AppResult[] results = app.WaitForElement(c => c.Marked("ResultLabel"));
    Assert.IsTrue(results.Any());
}
```

## Workflow: Arrange-Act-Assert pattern

Each test should follow the `Arrange-Act-Assert` pattern:

*Arrange*: The test will set up conditions and initialize things so that the test can be actioned.
*Act*: The test will interact with the application, enter text, pushing buttons, and so on.
*Assert*: The test examines the results of the actions run in the Act step to determine correctness. For example, the application may verify that a particular error message is displayed.

## Locating and interacting with views

Automated UI testing relies heavily on locating and interacting with views on the screen. Xamarin.UITest addresses this requirement with two important sets of APIs that work with each other:

- **Queries** to locate views on the screen - Part of the Xamarin.UITest framework are APIs that will locate the views on a screen. Queries locate views at run time by inspecting attributes for the view and returning an object that the actions may work upon.
- **Actions** that can be done on views.

### Queries

Method | Description
-|-
`Marked` | Will return a view.
`Button` | Will locate one or more buttons on the screen.
`Class` | Will try to locate views that are of a specified class.
`Id` | Will try to locate a view with the specified Id.
`Index` | Will return one view from a collection of matching views. Usually used in conjunction with other methods. Takes a zero-based index.
`Text` | Will match views that contain the provided text.
`TextField` | Will match an Android EditText or iOS UITextField.

Example:

```cs
pp.Query(c=>c.Marked("MyButton"))
app.Query("MyButton") //The shorter form
```

### Actions

Example | Description
-|-
`PressEnter` | Press the enter key in the app.
`Tap` | Simulates a tap / touch gesture on the matched element.
`EnterText` | Enters text into the view. In an iOS application, Xamarin.UITest will enter the text using the soft keyboard. In contrast, Xamarin.UITest won't use the Android keyboard, it will directly enter the text into the view.
`WaitForElement` | Pauses the execution of the test until the views appear on the screen.
Screenshot(String) | Takes a screenshot of the application in its current state and saves it to disk. It returns a FileInfo object with information about the screenshot taken.
`Flash` | This method will cause the selected view to "flash" or "flicker" on the screen.

Example:

```cs
[Test]
public void CreditCardNumber_TooLong_DisplayErrorMessage()
{
    /* Arrange - set up our queries for the views */
    // Nothing to do here, app has been instantiated in the [SetUp] method.

    /* Act */
    app.EnterText(c => c.Marked("CreditCardTextField"), new string('9', 17));
    // Screenshot can be used to break this test up into "steps".
    // The screenshot can be inspected after the test run to verify
    // the visual correctness of the screen.
    app.Screenshot("Entering a 17 digit credit card number.");

    app.Tap(c => c.Marked("ValidateButton"));
    app.Screenshot("The validation results.");

    /* Assert */
    AppResult[] result = app.Query(c => c.Class("UILabel").Text("Credit card number is too long."));
    Assert.IsTrue(result.Any(), "The error message isn't being displayed.");
}
```

## Interacting with the User Interface: Xamarin REPL

To help with writing tests, `Xamarin.UITest` provides a *read-eval-print-loop* (REPL). The REPL allows developers and testers to interact with a screen while the application is running. The REPL can be used to explore the view hierarchy of a screen, experiment with creating queries, and use them to interact with an application.

he only way to start the REPL is to invoke the `IApp.Repl` method within an existing test:

```cs
[TestFixture]
public class ValidateCreditCard
{
    IApp app;

    [SetUp]
    public void Setup()
    {
        app = ConfigureApp.Android.ApkFile("/path/to/application.apk").StartApp();
    }
    [Test]
    public void CreditCardNumber_TooLong_DisplayErrorMessage()
    {
        app.Repl();
    }
}
```

The test will run, and when the Repl method is invoked, `Xamarin.UITest` will start the REPL in a terminal session.

We can use the **tree** command to display the hierarchy of this screen a get the **id** of the views to use in our queries and the **copy** command to work with the clipboard.

A common workflow is to use the `tree command` or `IApp.Flash` to identify views on the screen and to obtain meta-data about those views. That information is used to create `AppQueries` and spike out the steps that will make up a test. Then the `copy command` can be used to copy that work to the clipboard so that it may be pasted into the test.

We can also use the **AppQuery.Marked** method to query for views on screen. It works by inspecting the view hierarchy for a view on the screen, trying to match the properties on the view with to the provided string.

Example:

```sh
>>> app.Flash(c=>c.Class("EditText"))
Flashing query for Class("EditText") gave 1 results.
[
  {
    "Id": "creditCardNumberText",
    "Description": "android.widget.EditText{528165e4 VFED..CL .F...... 139,70-941,178 #7f050001 app:id/creditCardNumberText}",
    "Rect": {
      "Width": 802.0,
      "Height": 108.0,
      "X": 139.0,
      "Y": 274.0,
      "CenterX": 540.0,
      "CenterY": 328.0
    },
    "Label": null,
    "Text": "",
    "Class": "android.widget.EditText",
    "Enabled": true
  }
]
```
