# View Model

The ViewModel class is designed to store and manage UI-related data in a lifecycle conscious way. The ViewModel class allows data to survive configuration changes such as screen rotations.

In general, you’ll make a ViewModel class for each screen in your app. This ViewModel class will hold all of the data associated with the screen and have getters and setters for the stored data. This separates the code to display the UI, which is implemented in your Activities and Fragments, from your data, which now lives in the ViewModel.

## Step1: Implement a ViewModel

Make your java pojo (model) class extend ViewModel:

```Java
import android.arch.lifecycle.ViewModel;

public class xxx extends ViewModel {...}
```

## Step2: Associate the UI Controller and ViewModel

On the Activity or Fragment `ViewModelProviders.of(<Your UI controller>).get(<Your ViewModel>.class)`:

```Java
xxx mxxx = ViewModelProviders.of(this).get(xxx.class)
```

The first time the `ViewModelProviders.of` method is called by MainActivity, it creates a new ViewModel instance. When this method is called again, which happens whenever onCreate is called, it will return the pre-existing ViewModel associated with the specific Court-Counter MainActivity. This is what preserves the data.

## Step 3: Use the ViewModel in your UI Controller

To access or change UI data, you can now use the data in your ViewModel.

## Exemple

```Java
// ViewModel

public class ScoreViewModel extends ViewModel {
   // Tracks the score for Team A
   public int scoreTeamA = 0;

   // Tracks the score for Team B
   public int scoreTeamB = 0;
}
```

```Java
// implementation
@Override
protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(savedInstanceState);
   setContentView(R.layout.activity_main);
   mViewModel = ViewModelProviders.of(this).get(ScoreViewModel.class);
   displayForTeamA(mViewModel.scoreTeamA); // a method that displays result
   displayForTeamB(mViewModel.scoreTeamB);
}

// An example of both reading and writing to the ViewModel
public void addOneForTeamA(View v) {
   mViewModel.scoreTeamA = mViewModel.scoreTeamA + 1;
   displayForTeamA(mViewModel.scoreTeamA);
}
```