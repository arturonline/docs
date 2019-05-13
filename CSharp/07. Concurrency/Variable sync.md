# Variable Synchronization in Multithreading

> [Source](https://docs.microsoft.com/en-us/dotnet/standard/threading/overview-of-synchronization-primitives)

In **atomic** operation, only a single thread at a time can execute a single statement and produce accurate results; while, in a **non-atomic** operation, more than one thread is accessing and manipulating the value of a shared variable, which produces an inaccurate result.

## Handeling variables

The following are three common ways to handle synchronization variables in a multithreaded enviroment:

1. Lock
2. Monitor
3. Interlock
4. Volatile
5. Cancellation Token

### 1. Lock(object)

Lock statement prevents a thread from executing the same block of code that another thread is executing. Such a block of code is called a locked code. Therefore, if a thread tries to enter a locked code, it will wait until the object is released. The lock keyword calls Enter at the start of the block and Exit at the end of the block.

The best practice is to use lock keyword with a private object, or with a private static object variable to protect data common to all instances.

Syntax:

```csharp
lock (x) // x is a reference type
{
    // Your code...
}
```

[Back to Top](#Variable-Synchronization-in-Multithreading)

Example:

The following example defines an Account class that synchronizes access to its private balance field by locking on a dedicated balanceLock instance. Using the same instance for locking ensures that the balance field cannot be updated simultaneously by two threads attempting to call the Debit or Credit methods simultaneously.

```csharp
using System;
using System.Threading.Tasks;

public class Account
{
    private readonly object balanceLock = new object();
    private decimal balance;

    public Account(decimal initialBalance)
    {
        balance = initialBalance;
    }

    public decimal Debit(decimal amount)
    {
        lock (balanceLock)
        {
            if (balance >= amount)
            {
                Console.WriteLine($"Balance before debit :{balance, 5}");
                Console.WriteLine($"Amount to remove     :{amount, 5}");
                balance = balance - amount;
                Console.WriteLine($"Balance after debit  :{balance, 5}");
                return amount;
            }
            else
            {
                return 0;
            }
        }
    }

    public void Credit(decimal amount)
    {
        lock (balanceLock)
        {
            Console.WriteLine($"Balance before credit:{balance, 5}");
            Console.WriteLine($"Amount to add        :{amount, 5}");
            balance = balance + amount;
            Console.WriteLine($"Balance after credit :{balance, 5}");
        }
    }
}

class AccountTest
{
    static void Main()
    {
        var account = new Account(1000);
        var tasks = new Task[100];
        for (int i = 0; i < tasks.Length; i++)
        {
            tasks[i] = Task.Run(() => RandomlyUpdate(account));
        }
        Task.WaitAll(tasks);
    }

    static void RandomlyUpdate(Account account)
    {
        var rnd = new Random();
        for (int i = 0; i < 10; i++)
        {
            var amount = rnd.Next(1, 100);
            bool doCredit = rnd.NextDouble() < 0.5;
            if (doCredit)
            {
                account.Credit(amount);
            }
            else
            {
                account.Debit(amount);
            }
        }
    }
}
```

[Back to Top](#Variable-Synchronization-in-Multithreading)

### 2.Monitor

Monitor class also ensures that no other thread can execute the same section of code or a shared memory until it is being executed by its lock owner.

* `Monitor.Enter` or `Monitor.TryEnter` method is used to lock a block of code for other threads and prevent other threads from executing it.
* `Monitor.Exit` method is used to unlock the locked code for another thread and allow other threads to execute it.

Example:

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    //This object is use to lock a block
    private static object thislock = new object();
    static void Main()
    {
        int num = 0;
        int length = 500000;

        //Run on separate thread of threadpool
        Task tsk = Task.Run(() =>
        {
            for (int i = 0; i < length; i++)
            {
                //lock the block of code
                Monitor.Enter(thislock);
                num = num + 1;

                //unlock the locked code
                Monitor.Exit(thislock);
            }
        });

        //Run on Main Thread
        for (int i = 0; i < length; i++)
        {
            //lock the block of code
            Monitor.Enter(thislock);
            num = num - 1;

            //unlock the locked code
            Monitor.Exit(thislock);
        }
        tsk.Wait();
        Console.WriteLine(num);
    }
}
// Output:
// 0
```

[Back to Top](#Variable-Synchronization-in-Multithreading)

### 3. Interlocked

Interlocked class is used to synchronize the access of shared memory objects among multiple threads. Interlocked class provides the following useful operation on shared memory:

1. **Increment** and *Decrement* methods, used to increment or decrement a value of variable.
2. **Add** and **Read** method, used to add an integer value to a variable or read a 64-bit integer value as an atomic operation.
3. **Exchange** Sets an object to a specified value and returns a reference to the original object, as an atomic operation.
4. **CompareExchange** Compares two values for equality and, if they are equal, replaces the first value.

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void Main()
    {
        int num = 0;
        int length = 500000;

        //Run on separate thread of threadpool
        Task tsk = Task.Run(() =>
        {
            for (int i = 0; i < length; i++)
            {
                Interlocked.Increment(ref num);
            }
        });

        //Run on Main Thread
        for (int i = 0; i < length; i++)
        {
            Interlocked.Decrement(ref num);
        }

        tsk.Wait();
        Console.WriteLine(num);
    }
}
//Output
0
```

Another example:

```csharp
// This example demonstrates a thread-safe method that adds to a
// running total.  
using System;
using System.Threading;

public class ThreadSafe
{
    // Field totalValue contains a running total that can be updated
    // by multiple threads. It must be protected from unsynchronized 
    // access.
    private double totalValue = 0.0;

    // The Total property returns the running total.
    public double Total { get { return totalValue; }}

    // AddToTotal safely adds a value to the running total.
    public double AddToTotal(double addend)
    {
        double initialValue, computedValue;
        do
        {
            // Save the current running total in a local variable.
            initialValue = totalValue;

            // Add the new value to the running total.
            computedValue = initialValue + addend;

            // CompareExchange compares totalValue to initialValue. If
            // they are not equal, then another thread has updated the
            // running total since this loop started. CompareExchange
            // does not update totalValue. CompareExchange returns the
            // contents of totalValue, which do not equal initialValue,
            // so the loop executes again.
        }
        while (initialValue != Interlocked.CompareExchange(ref totalValue, 
            computedValue, initialValue));
        // If no other thread updated the running total, then 
        // totalValue and initialValue are equal when CompareExchange
        // compares them, and computedValue is stored in totalValue.
        // CompareExchange returns the value that was in totalValue
        // before the update, which is equal to initialValue, so the 
        // loop ends.

        // The function returns computedValue, not totalValue, because
        // totalValue could be changed by another thread between
        // the time the loop ends and the function returns.
        return computedValue;
    }
}

public class Test
{
    // Create an instance of the ThreadSafe class to test.
    private static ThreadSafe ts = new ThreadSafe();
    private static double control;

    private static Random r = new Random();
    private static ManualResetEvent mre = new ManualResetEvent(false);

    public static void Main()
    {
        // Create two threads, name them, and start them. The
        // thread will block on mre.
        Thread t1 = new Thread(TestThread);
        t1.Name = "Thread 1";
        t1.Start();
        Thread t2 = new Thread(TestThread);
        t2.Name = "Thread 2";
        t2.Start();

        // Now let the threads begin adding random numbers to 
        // the total.
        mre.Set();

        // Wait until all the threads are done.
        t1.Join();
        t2.Join();

        Console.WriteLine("Thread safe: {0}  Ordinary Double: {1}", 
            ts.Total, control);
    }

    private static void TestThread()
    {
        // Wait until the signal.
        mre.WaitOne();

        for(int i = 1; i <= 1000000; i++)
        {
            // Add to the running total in the ThreadSafe instance, and
            // to an ordinary double.
            //
            double testValue = r.NextDouble();
            control += testValue;
            ts.AddToTotal(testValue);
        }
    }
}

/* On a dual-processor computer, this code example produces output 
   similar to the following:

Thread safe: 998068.049623744  Ordinary Double: 759775.417190589
 */
```

[Back to Top](#Variable-Synchronization-in-Multithreading)

## Volatile

Adding the volatile keyword to a field indicates to the compiler that the field's value may be changed by multiple separate threads. The primary purpose of the volatile keyword is to prevent compiler optimizations that assume only single-threaded access. Using volatile ensures that the value of the field is the most recent value that is available, and the value is not subject to the caching that non-volatile values are.

volatile can only be used on fields within classes or structs. The following is not valid: 

```csharp
public void MyMethod() { volatile int x; }
```

[Back to Top](#Variable-Synchronization-in-Multithreading)

## Dead Lock

In a multithreaded enviroment, a dead lock may occur; it freezes the application because two or more activities are waiting for each other to complete. Usually it occurs when a shared resource is locked by one thread and another thread is waiting to access it.

[Back to Top](#Variable-Synchronization-in-Multithreading)

## CancellationToken

The .NET Framework uses a unified model for cooperative cancellation of asynchronous or long-running synchronous operations. This model is based on a lightweight object called a `cancellation token`. The object that invokes one or more cancelable operations, for example by creating new threads or tasks, passes the token to each operation. Individual operations can in turn pass copies of the token to other operations. At some later time, the object that created the token can use it to request that the operations stop what they are doing. Only the requesting object can issue the cancellation request, and each listener is responsible for noticing the request and responding to it in an appropriate and timely manner.
The general pattern for implementing the cooperative cancellation model is:

1. Instantiate a `CancellationTokenSource` object, which manages and sends cancellation notification to the individual cancellation tokens.
2. Pass the token returned by the `CancellationTokenSource.Token` property to each task or thread that listens for cancellation.
3. Provide a mechanism for each task or thread to respond to cancellation.
4. Call the `CancellationTokenSource.Cancel` method to provide notification of cancellation.

Cancellation tokens cannot be reused after they have been canceled.

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void Main()
    {
        //1 - Instantiate a cancellation token source
        CancellationTokenSource source = new CancellationTokenSource();

        //2 - Get token from CancellationTokenSource.Token property
        CancellationToken token = source.Token;

        //3 - Pass token to Task
        Task tsk = Task.Run(()=>
        {
            Console.WriteLine("Hello from tsk");
            while(true)
            {
                Thread.Sleep(1000);
                Console.WriteLine("*");

                if(token.IsCancellationRequested == true)
                {
                    Console.WriteLine("Bye from tsk");
                    return;
                }
            }
        }, token);

        Console.WriteLine("Hello from main thread");

        //Wait
        Thread.Sleep(4000);

        //4 - notify for cancellation
        source.Cancel(); //token.IsCancellationRequested == true;

        //Wait
        Thread.Sleep(1000);

        Console.WriteLine("Bye from main thread");
    }
}
// Output:
// Hello from main thread
// Hello from tsk
// *
// *
// *
// *
// Bye from tsk
// Bye from main thread
```

[Back to Top](#Variable-Synchronization-in-Multithreading)