# Generic Abstract implementation for Activities with a single Fragment

## 1. Idea

1 activity - 1 fragment

## 2. Create Classes

### Create an abstract activity class

Create an abstract Activity class which will be our blueprints for all activities.

`New → Java Class`

```Java
// SingleFragmentActivity.java
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;

public abstract class SingleFragmentActivity extends FragmentActivity {

    protected abstract Fragment createFragment();

    protected int getLayoutResId() {
        return R.layout.activity_fragment;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutResId());

        FragmentManager fm = getSupportFragmentManager();
        Fragment fragment = fm.findFragmentById(R.id.fragmentContainer);
        if (fragment == null) {
            fragment = createFragment();
            fm.beginTransaction().add(R.id.fragmentContainer,fragment).commit();
        }
    }
}
```

### Create the class for the activity

Update Activity to subclass the `singleFragmentActivity` class and provide the logic to host the fragment.

```Java
public class aActivity extends singleFragmentActivity {

@Override
protected Fragment createFragment() {
return new aFragment();
}
```

### create the class for the fragment

`New → Java Class`

Update Fragment to subclass the Fragment class.

```Java
public class afragment extends Fragment {

```

## 3. Create layouts

You will need to create layout files for the for the fragment.

In the res/layout folder in the project tool window select:

`New → Layout resource file`

**Name** (fragmentContainer) this file and enter the **root element**.
Click **OK** and Android Studio will generate the file for you.

### Define a placeholder in the layout activity

The whole activity will host the fragment layout:

```xml
<!-- activity_fragment.xml -->
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/fragment_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```
