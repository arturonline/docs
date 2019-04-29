# RecyclerView.md

## 1. Add the support library

```java
dependencies {
    implementation 'com.android.support:recyclerview-v7:27.1.0'
}

import android.support.v7.widget.RecyclerView;

```

## 2. Add a RecyclerView layout to the activity/fragment

```xml
<!-- fragment_blank.xml -->

<!-- more attributes -->
<?xml version="1.0" encoding="utf-8"?>
<android.support.v7.widget.RecyclerView
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/recycler_fragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:scrollbars="vertical" />
<!-- more attributes -->
```

Or use the viewgroup for the whole layout:

```xml
<!-- fragment_blank.xml -->

<?xml version="1.0" encoding="utf-8"?>
<!-- A RecyclerView with some commonly used attributes -->
<android.support.v7.widget.RecyclerView
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/recycler_fragment"
    android:scrollbars="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```

## 4. Create a layout xml for a single row

## 5. Modify the Fragment Class container, add the holder, add the adapter

```Java
public class BlankFragment extends Fragment {
    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;
    MovieFactory movies;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_blank, container, false);

        // Example of Data to show
        movies = new MovieFactory();

        // Create the recyclerView
        // recycler_fragment: name of the recycler widget where we are going to put our RV inside fragment_blank
        mRecyclerView = v.findViewById(R.id.recycler_fragment);
        // mRecyclerView = (RecyclerView) View.findViewById(R.id.my_recycler_view); <- for fragments called from onCreateView

        // use this setting to improve performance if you know that changes
        // in content do not change the layout size of the RecyclerView
        mRecyclerView.setHasFixedSize(true);

        mLayoutManager = new LinearLayoutManager(getActivity());
        mRecyclerView.setLayoutManager(mLayoutManager);

        // we can pass the Data to the adapter through the constructor.
        mAdapter = new MyAdapter(movies.getMovieList());
        mRecyclerView.setAdapter(mAdapter);

        return v;
    }

    // Create the ViewHolder
    private class Holder extends RecyclerView.ViewHolder {

        //create the widgets for every cell
        private TextView MovieTitle;
        private TextView MovieYear;

        public Holder(LayoutInflater inflater, ViewGroup parent) {
            super(inflater.inflate(R.layout.list_item, parent, false));

            MovieTitle = itemView.findViewById(R.id.movie_title_textView);
            MovieYear = itemView.findViewById(R.id.movie_year_textView);
        }
    }

    // Create the adapter
    private class MyAdapter extends RecyclerView.Adapter<Holder> { // dont forget: <Holder>

        private List<Movie> list;

        // Create a constructor to pass the data
        public MyAdapter(List<Movie> list) {
            this.list = list; // From this point we use list, to recover the data
        }

       @Override
       public Holder onCreateViewHolder(ViewGroup parent, int viewType) {

           // Inflate the Holder
           LayoutInflater layoutInflater = LayoutInflater.from(getActivity());
           return new Holder(layoutInflater, parent);
       }

       @Override
       public void onBindViewHolder(Holder holder, int position) {

           //Bind the data to the View
           Movie item = list.get(position);
           holder.MovieYear.setText(String.valueOf(item.getYear()));
           holder.MovieTitle.setText(item.getTitle());
       }


       @Override

       // Get the number of cells
       public int getItemCount() {
           return list.size();
       }
   }

}
```