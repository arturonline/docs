# UI test Android with Expresso

Espresso has basically three components:

1. **ViewMatchers** - allows to find view in the current view hierarchy
2. **ViewActions** - allows to perform actions on the views
3. **ViewAssertions** - allows to assert state of a view

```Java
onView(ViewMatcher)
 .perform(ViewAction)
   .check(ViewAssertion);
```

Exemple:

```Java
@Test
public void greeterSaysHello() {
    onView(withId(R.id.name_field)).perform(typeText("Steve"));
    onView(withId(R.id.greet_button)).perform(click());
    onView(withText("Hello Steve!")).check(matches(isDisplayed()));
}

```

