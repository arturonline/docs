# CoRoutines

## 1. Scope

The `CoroutineScope` defines the lifecycle and context in which coroutines are launched.

```java
val scope = CoroutineScope(Dispatchers.Main)

val scope = viewModelScope

// etc...
```

## 2. Coroutine Builders

These are functions that create and start coroutines.

1. **launch**: Starts a new coroutine and doesn't return any result. It's like starting a background task.

    ```java
    CoroutineScope(Dispatchers.IO).launch {
        // Background task
    }
    ```

1. **async**: Starts a new coroutine and returns a Deferred object, which is a promise of a result that will be available in the future. You can use await to get the result.

    ```java
    val deferred = CoroutineScope(Dispatchers.IO).async {
        // Background task
        return@async result

    } val result =
    ```

## 3. Suspending Functions

A suspending function is a function that can be paused and resumed later. These functions are marked with the suspend keyword and can be used inside coroutines.

```java
suspend fun fetchData(): String {
    // Simulate network request
    delay(1000)
    return "Data"
}
```

## 4. Contexts and Dispatchers

Coroutines can run on different threads or dispatchers.

- **Dispatchers.Main**: Runs coroutines on the main thread, typically used for updating the UI.
- **Dispatchers.IO**: Used for I/O operations, such as reading from or writing to files, network operations, etc.
- **Dispatchers.Default**: Used for CPU-intensive work, such as sorting a large list.

```java
CoroutineScope(Dispatchers.IO).launch {
    val data = fetchData()
    withContext(Dispatchers.Main) {
        // Update UI with data
    }
}
``` 

## 5. Example

```java
// ViewModel
class MyViewModel : ViewModel() {
    private val scope = viewModelScope

    fun fetchData() {
        scope.launch {
            val data = fetchDataFromNetwork()
            // Update UI with data
        }
    }

    private suspend fun fetchDataFromNetwork(): String {
        // Simulate network request
        delay(2000)
        return "Data from network"
    }
}
```

```java
// Activity
class MainActivity : AppCompatActivity() {
    private lateinit var viewModel: MyViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        viewModel = ViewModelProvider(this).get(MyViewModel::class.java)

        viewModel.data.observe(this, Observer { data ->
            findViewById<TextView>(R.id.textView).text = data
        })

        viewModel.fetchData()
    }
}
```