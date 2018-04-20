# Activities

## Starting Activities and Getting Results

Sometimes you want to get a result back from an activity when it ends. To do this, you call the second activity with `startActivityForResult(Intent, int)`. To get the result back implement `onActivityResult(int, int, Intent)` method.

```Java
// Activity 1

private static final int REQUEST_CODE = 0

...
Intent i = someActivity.newIntent(MainActivity.this, someBoolean);
            startActivityForResult(i, REQUEST_CODE);

```

```Java
// Activity 2
private static final String EXTRA_DATA = "com.example.artur.something";
private static final String EXTRA_ANSWER_SHOWN = "com.example.artur.answer_shown";

...

Intent data = new Intent();
        data.putExtra(EXTRA_DATA, someboolean);
        setResult(RESULT_OK, data);
```

```Java
// Activity 1

@Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(resultCode != Activity.RESULT_OK) {
            return;
        }
        if(requestCode == REQUEST_CODE) {
            if (data == null) {
                return;
            }
            // Do something here with the data in the intent data, ex:
            // data.getBooleanExtra(EXTRA_ANSWER_SHOWN, false);
        }
    }
```

When an activity exits, it can call `setResult(int)` to return data back to its parent. It must always supply a result code, which can be:

1. the standard results `Activity.RESULT_CANCELED` ( = 0), 
1. `Activity.RESULT_OK` (= -1), 
1. or any custom values starting at `Activity.RESULT_FIRST_USER` (= 0). 

In addition, it can optionally return back an Intent containing any additional data it wants. All of this information appears back on the parent's `Activity.onActivityResult()`, along with the integer identifier it originally supplied.

If a child activity fails for any reason (such as crashing), the parent activity will receive a result with the code `RESULT_CANCELED`.