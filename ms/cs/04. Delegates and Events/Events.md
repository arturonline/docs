# Events

Events enable a class or object to notify other classes or objects when something of interest occurs.

* The clas that sends (or raises) the event is called *publisher*
* The classes that receive (or handle) the event are called *subscribers*

You can subscribe to an event and then you are notifed when the publisher of the event raises a new event.

## Observer pattern

Events have the following properties:

* The `publisher` determines **when** an event is raised;
* The `subscribers` determine **what** action is taken in response to the event.
* An event can have multiple `subscribers`. A subscriber can handle multiple events from multiple `publishers`.
* When an event has multiple subscribers, the event handlers are invoked `synchronously` when an event is raised.


## How to setp by step

The .NET Framework defines a standard pattern for writing events. Its purpose is to provide consistency across both Framework and user code.

### 1. Define Event Data Class

(Skip this step if you do not have to send custom data with your event)

`EventArgs` is a base class for carry information for an event. Declare the class for your custom data at a scope that is visible to both your publisher and subscriber classes. Then add the required members to hold your custom event data:

```csharp
public class PriceChangedEventArgs : System.EventArgs
{
    public readonly decimal LastPrice;
    public readonly decimal NewPrice;

    public PriceChangedEventArgs (decimal lastPrice, decimal newPrice)
    {
        LastPrice = lastPrice;
        NewPrice = newPrice;
    }
}
```

The `EventArgs` subclass typically exposes data as properties or as *read-only* fields.

### 2. Define a EventHandler

The Framework defines a generic `EventHandler<TEventArgs>` and a non-generic `EventHandler` delegate that satisfies these rules:

```csharp
public event EventHandler MyEventHandler;
public event EventHandler<TEventArgs> MyGenericEventHandler; // When you need to pass data with a EventArgs
```

### 4. Define the method that fires the event

Finally, the pattern requires that you write a `protected` `virtual` method that fires the event. The name must match the name of the event, prefixed with the word *On*, and then accept a single `EventArgs` argument:

```csharp
public class Stock
{
    public event EventHandler<PriceChangedEventArgs> PriceChanged;

    protected virtual void OnPriceChanged (PriceChangedEventArgs e)
    {
        if (PriceChanged != null) PriceChanged (this, e);
        // PriceChanged?.Invoke(this, e);
    }
}
```

### 5. Subscribe to events

Use the addition assignment operator (`+=`) to attach your event handler to the event. In the following example, assume that an object named publisher has an event named *RaiseCustomEvent*. Note that the subscriber class needs a reference to the publisher class in order to subscribe to its events.

```csharp
publisher.RaiseCustomEvent += HandleCustomEvent;
```

### 6. Unsubscribe from events

Use the subtraction assignment operator (`-=`) to unsubscribe from an event:

```csharp
publisher.RaiseCustomEvent -= HandleCustomEvent;
```

## Example

```csharp
public class Class1
{
    public EventHandler evt; // already wired delegate

    public void CheckBalance(int x)
    {
        if (x > 250)
        {
            // evt("Error, error!!")
            evt?.Invoke("Error, error!")
        }
    }
}
```

```csharp
public class Class2
{
    public void HandleTheEvent(object sender, EventArgs e)
    {
        Console.WriteLine("Error, error!! " + sender + " balance over 250");
    }
}
```

```csharp
class Program
{
    static void Main(string[] args)
    {
        Class1 publisher = new Class1();

        Class2 subscriber = new Class2();

        publisher.evt += subscriber.HandleTheEvent;

        publiser.CheckBalance(240); // nothing happens
        publisher.CheckBalance(251); // Error, error!!
    }
}
```