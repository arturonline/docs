# ViewMatchers: Accessing UI Components

Before Espresso can interact with the app under test, you must first specify the UI component or view.

To find the view, call the onView() method and pass in a view matcher that specifies the view that you are targeting.

You can specify a view matcher by using these approaches:

`onView(withText("Sign-in"));`

`onView(withId(R.id.button_signin));`

`onView(allOf(withId(R.id.button_signin), withText("Sign-in")));`

`onView(allOf(withId(R.id.button_signin), not(withText("Sign-out"))));`

## Locating a view in an AdapterView

In an AdapterView widget, the view is dynamically populated with child views at runtime. If the target view you want to test is inside an AdapterView (such as a ListView, GridView, or Spinner), the onView() method might not work because only a subset of the views may be loaded in the current view hierarchy.

Instead, call the onData() method to obtain a DataInteraction object to access the target view element.

The following code snippet shows how you can use the onData() method together with Hamcrest matching to search for a specific row in a list that contains a given string. In this example, the LongListActivity class contains a list of strings exposed through a SimpleAdapter.

```Java
onData(allOf(is(instanceOf(Map.class)),
        hasEntry(equalTo(LongListActivity.ROW_TEXT), is("test input")));
```