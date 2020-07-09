# Async Await

If you specify that a Method is an async method by using the `async` modifier, you enable the following two capabilities:

* The marked async method can use `await` to designate suspension points. The `await` operator tells the compiler that the async method can't continue past that point until the awaited asynchronous process is complete. In the meantime, control returns to the caller of the async method.

* The marked `async` method can itself be awaited by methods that call it.

## Characteristics

* `await` takes a single argument - an *“awaitable”* - which is an asynchronous operation. There are two awaitable types already common in the .NET framework: `Task<T>` and `Task`.
* An async method typically contains one or more occurrences of an `await` operator, but the absence of await expressions doesn’t cause a compiler error. The compiler issues a warning for such methods.
* Method return type should change to return either `void` or `Task` or `Task<T>` , where T is the return data type.
* The type of data returned is *awaitable*, not the method itself. This means that one can await the result of an async method because it returns a Task, not for being marked as async.
* When using the `async` and `await` keywords, you should keep in mind that just wrapping each and every operation in a Task and awaiting them won’t make your application perform any better. It could, however, improve responsiveness.

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

## Return types and parameters

The return type is one of the following types:

* `Task<TResult>` if your method has a return statement in which the operand has type `TResult`.
* `Task` if your method has no return statement or has a return statement with no operand.
* `Void` if you're writing an async event handler.

### Task return type

Async methods that don't contain a return statement or that contain a return statement that doesn't return an operand usually have a return type of Task. Such methods return void if they run synchronously. If you use a Task return type for an async method, a calling method can use an await operator to suspend the caller's completion until the called async method has finished.

In the following example, the WaitAndApologize async method doesn't contain a return statement, so the method returns a Task object. This enables WaitAndApologize to be awaited. Note that the Task type doesn't include a Result property because it has no return value.

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
      Console.WriteLine($"The current time is {DateTime.Now.TimeOfDay:t}");
      Console.WriteLine("The current temperature is 76 degrees.");
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
//       The current time is 15:25:16.2935649
//       The current temperature is 76 degrees.
```

### Task<> return type

The `Task<TResult>` return type is used for an async method that contains a return statement in which the operand has type `TResult`.

In the following example, the GetLeisureHours async method contains a return statement that returns an integer. Therefore, the method declaration must specify a return type of `Task<int>`. The `FromResult` async method is a placeholder for an operation that returns a string.

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

## Prevent Application from Cross Threading

In a multithreaded enviroment, only a UI thread can change the value of UI controls (button, label, textbox, etc.). If another thread tries to change the value of a UI control, then cross threading exception will arise because Runtime will not allow any thread to manipulate another thread data directly.

```csharp
private async button1_Click(object sender, EventArgs e) 
{
    Task task = Task.Run(() =>
    {
        label1.Text = "Hello World";
        Thread.Sleep(3000);
        label1.Text = "Bye World";
    });

    await task;
}
```

When the above code runs, an exception will arise which says, “Cross-thread operation not valid”.

`BeginInvoke` method is used to change values of UI control from other threads. It does it in a thready-safe way. It requires a delegate; it tells which UI control needs to change its value.

```csharp
private async void button1_Click(object sender, EventArgs e)
{
    Task task = Task.Run(() =>
    {
        this.BeginInvoke(new Action(() =>
        {
            label1.Text = "Hello";
        }));
    });
    await task;
}
```

The value of `label1.Text` shall be changed to “Hello” and no exception will arise because it’s a thread- safe operation.
