# tmp

## Change activity to FragmentActivity

```Java
public class MainActivity extends FragmentActivity {
```

## Define placeHolder in activity xml

```xml
<FrameLayout
     xmlns:android="http://schemas.android.com/apk/res/android"
        android:id="@+id/fragment_container"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
/>
```

## Add a Fragment with Java

```Java
import android.support.v4.app.Fragment;

...

 setContentView(R.layout.news_articles);
        // Check if a fragment is present in the layout
        FragmentManager fm = getSupportFragmentManager();
        TypeFragment fragment = (TypeFragment) fm.findFragmentById(R.id.fragment_crime); // cast needed

        if (fragment == null) {
            fragment = new TypeFragment();
            fragment.setArguments(getIntent().getExtras());
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.fragment_container, fragment).commit();

        }
```

## Add a Fragment with Kotlin

```Java
setContentView(R.layout.activity_main)

        if (findViewById<View>(R.id.fragment_container) != null) {
            if (savedInstanceState != null) {
                return
            }
            val fragmentBlank = BlankFragment()
            //fragmentBlank.setArguments(intent.extras)
            supportFragmentManager.beginTransaction()
                    .add(R.id.fragment_container, fragmentBlank)
                    .commit()
        }
    }
}
```
