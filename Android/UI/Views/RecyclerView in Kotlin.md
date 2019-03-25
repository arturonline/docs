# RecyclerView in Kotlin

```xml
<!-- fragment_blank.xml -->
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/fragment_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/colorAccent"
    tools:context="com.example.artur.kotlinrv.BlankFragment">

    <android.support.v7.widget.RecyclerView
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:id="@+id/recycler_fragment"
        android:scrollbars="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
</FrameLayout>
```

```xml
<!-- single_row.xml -->
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/single_row"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:id="@+id/item_title"
        android:layout_toEndOf="@+id/item_image"
        android:layout_toRightOf="@+id/item_image"
        android:layout_alignParentTop="true"
        android:textSize="30sp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:id="@+id/item_detail"
        android:layout_toEndOf="@+id/item_image"
        android:layout_toRightOf="@+id/item_image"
        android:layout_below="@+id/item_title" />
</android.support.constraint.ConstraintLayout>
```

```Java
class MainActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        if (findViewById<View>(R.id.fragment_container) != null) {

            if (savedInstanceState != null) {
                return
            }
            val firstFragment = BlankFragment()
            supportFragmentManager.beginTransaction()
                    .add(R.id.fragment_container, firstFragment)
                    .commit()
        }
    }
}
```

```kotlin
class BlankFragment : Fragment() {
    private lateinit var layoutManager: LinearLayoutManager
    private lateinit var adapter: RecyclerView.Adapter<*>
    private lateinit var mRecyclerView: RecyclerView

    override fun onCreateView(inflater: LayoutInflater?, container: ViewGroup?, savedInstanceState: Bundle?): View? {

        val v = inflater?.inflate(R.layout.fragment_blank, container, false)

        if (v != null) {
            mRecyclerView = v.findViewById(R.id.recycler_fragment) as RecyclerView
        }

        layoutManager = LinearLayoutManager(activity, LinearLayoutManager.VERTICAL, false)
        mRecyclerView.layoutManager = layoutManager

        adapter = MyAdapter()
        mRecyclerView.adapter = adapter

        return v
    }

    class MyAdapter : RecyclerView.Adapter<MyAdapter.MyHolder>() {

        private val titles = arrayOf("Chapter One",
                "Chapter Two", "Chapter Three", "Chapter Four",
                "Chapter Five", "Chapter Six", "Chapter Seven",
                "Chapter Eight")

        private val details = arrayOf("Item one details", "Item two details",
                "Item three details", "Item four details",
                "Item file details", "Item six details",
                "Item seven details", "Item eight details")

        inner class MyHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
            var itemTitle: TextView = itemView.findViewById(R.id.item_title)
            var itemDetail: TextView = itemView.findViewById(R.id.item_detail)

        }

        override fun onCreateViewHolder(viewGroup: ViewGroup, position: Int): MyHolder {
            val v = LayoutInflater.from(viewGroup.context)
                    .inflate(R.layout.single_row, viewGroup, false)
            return MyHolder(v)
        }

        override fun onBindViewHolder(myHolder: MyHolder, position: Int) {
            myHolder.itemTitle.text = titles[position]
            myHolder.itemDetail.text = details[position]
        }

        override fun getItemCount(): Int {
            return titles.size
        }
    }
}
```