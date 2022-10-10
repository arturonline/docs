# Async Await

If you specify that a Method is an async method by using the `async` modifier, you enable the following two capabilities:

* The marked async method can use `await` to designate suspension points. The `await` operator tells the compiler that the async method can't continue past that point until the awaited asynchronous process is complete. In the meantime, control returns to the caller of the async method.

* The marked `async` method can itself be awaited by methods that call it.

## Characteristics

* `await` takes a single argument - an *“awaitable”* - which is an asynchronous operation. There are two awaitable types already common in the .NET framework: `Task<T>` and `Task`.
* Method return type should change to return either `void` or `Task` or `Task<T>` , where T is the return data type.

Syntax:

```csharp
private async void button1_Click(object sender, EventArgs e)
{
    label1.Text = "Hello World";
    await normal_methodAsync();
    label1.Text = "Bye World";
}

private async Task normal_methodAsync()
{
    await DoComplicatedTaskAsync();
}

private Task DoComplicatedTaskAsync()
{
    Task task = Task.Run(() =>
    {
        Thread.Sleep(3000);
    });

    return task;
}
```

### Task return type

In the following example, the `WaitAndApologize` async method doesn't contain a return statement, so the method returns a Task object. This enables `WaitAndApologize` to be awaited. Note that the Task type doesn't include a Result property because it has no return value.

```csharp
using System;
using System.Threading.Tasks;

public class Example
{
   public static void Main()
   {
      DisplayCurrentInfo().Wait();
   }

   static async Task DisplayCurrentInfo()
   {
      await WaitAndApologize();
      Console.WriteLine($"Today is {DateTime.Now:D}");
   }

   static async Task WaitAndApologize()
   {
      // Task.Delay is a placeholder for actual work.  
      await Task.Delay(2000);  
      // Task.Delay delays the following line by two seconds.  
      Console.WriteLine("\nSorry for the delay. . . .\n");  
   }
}

// The example displays the following output:
//       Sorry for the delay. . . .
//
//       Today is Wednesday, May 24, 2017
```

### Task<> return type

In the following example, the `GetLeisureHours` async method contains a return statement that returns an integer. Therefore, the method declaration must specify a return type of `Task<int>`. The `FromResult` async method is a placeholder for an operation that returns a string.

```Csharp
using System;
using System.Linq;
using System.Threading.Tasks;

public class Example
{
   public static void Main()
   {
      Console.WriteLine(ShowTodaysInfo().Result);
   }

   private static async Task<string> ShowTodaysInfo()
   {
      string ret = $"Today is {DateTime.Today:D}\n" +
                   "Today's hours of leisure: " +
                   $"{await GetLeisureHours()}";
      return ret;
   }

   static async Task<int> GetLeisureHours()
   {  
       // Task.FromResult is a placeholder for actual work that returns a string.
       var today = await Task.FromResult<string>(DateTime.Now.DayOfWeek.ToString());

       // The method then can process the result in some way.  
       int leisureHours;
       if (today.First() == 'S')
           leisureHours = 16;
       else  
           leisureHours = 5;

       return leisureHours;
   }  
}
// The example displays output like the following:
//       Today is Wednesday, May 24, 2017
//       Today's hours of leisure: 5
// </Snippet >
```

### Void return type

You use the void return type in asynchronous event handlers, which require a void return type. For methods other than event handlers that don't return a value, you should return a Task instead, because an async method that returns void can't be awaited. Any caller of such a method must be able to continue to completion without waiting for the called async method to finish, and the caller must be independent of any values or exceptions that the async method generates.

The following example shows the behavior of an async event handler. Note that in the example code, an async event handler must let the main thread know when it finishes. Then the main thread can wait for an async event handler to complete before exiting the program.

```csharp
using System;
using System.Threading.Tasks;

public class NaiveButton
{
    public event EventHandler Clicked;

    public void Click()
    {
        Console.WriteLine("Somebody has clicked a button. Let's raise the event...");
        Clicked?.Invoke(this, EventArgs.Empty);
        Console.WriteLine("All listeners are notified.");
    }
}

public class AsyncVoidExample
{
    static TaskCompletionSource<bool> tcs;

    static async Task Main()
    {
        tcs = new TaskCompletionSource<bool>();
        var secondHandlerFinished = tcs.Task;

        var button = new NaiveButton();
        button.Clicked += Button_Clicked_1;
        button.Clicked += Button_Clicked_2_Async;
        button.Clicked += Button_Clicked_3;

        Console.WriteLine("About to click a button...");
        button.Click();
        Console.WriteLine("Button's Click method returned.");

        await secondHandlerFinished;
    }

    private static void Button_Clicked_1(object sender, EventArgs e)
    {
        Console.WriteLine("   Handler 1 is starting...");
        Task.Delay(100).Wait();
        Console.WriteLine("   Handler 1 is done.");
    }

    private static async void Button_Clicked_2_Async(object sender, EventArgs e)
    {
        Console.WriteLine("   Handler 2 is starting...");
        Task.Delay(100).Wait();
        Console.WriteLine("   Handler 2 is about to go async...");
        await Task.Delay(500);
        Console.WriteLine("   Handler 2 is done.");
        tcs.SetResult(true);
    }

    private static void Button_Clicked_3(object sender, EventArgs e)
    {
        Console.WriteLine("   Handler 3 is starting...");
        Task.Delay(100).Wait();
        Console.WriteLine("   Handler 3 is done.");
    }
}

// Expected output:
// About to click a button...
// Somebody has clicked a button. Let's raise the event...
//    Handler 1 is starting...
//    Handler 1 is done.
//    Handler 2 is starting...
//    Handler 2 is about to go async...
//    Handler 3 is starting...
//    Handler 3 is done.
// All listeners are notified.
// Button's Click method returned.
//    Handler 2 is done.
```