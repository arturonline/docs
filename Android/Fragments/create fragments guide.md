# Vainilla Guide

## 1. Create a fragment

Create a class that extends Fragment:

`New → Java Class`

And change the activity class to extend `FragmentActivity`

## 2. Define a placeholder in the layout activity

You simply need to specify a ViewGroup in which to place the fragment with the `<FrameLayout>`tag.

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout>
    <FrameLayout
        android:id="@+id/fragment_container"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</LinearLayout>
```

Remember you can nest several ViewGroups and put the placeholder wherever you want!

## 3. Add the fragment to the activity (programmatically)

At any time while your activity is running, you can add fragments to your activity layout placeholder previously defined:

```Java
FragmentManager fragmentManager = getSupportFragmentManager();
FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();

ExampleFragment fragment = new ExampleFragment();
fragmentTransaction.add(R.id.fragment_container, fragment); // where in the Activity layout, and which fragment

fragmentTransaction.commit();
```
