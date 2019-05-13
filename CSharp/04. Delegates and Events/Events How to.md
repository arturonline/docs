# How to declare, instantiate and use an Event

## Standard Event Pattern

The .NET Framework defines a standard pattern for writing events. Its purpose is to provide consistency across both Framework and user code.

### 1. Define Event Data Class

(Skip this step and go to Step 3 if you do not have to send custom data with your event)

`EventArgs` is a base class for carry information for an event. Declare the class for your custom data at a scope that is visible to both your publisher and subscriber classes. Then add the required members to hold your custom event data.:

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

### 2. Define a Delegate

The next step is to define a delegate for the event. There are three rules:

* It must have a void return type.
* It must accept two arguments: the first of type `object`, and the second a sub‐class of `EventArgs`. The first argument indicates the source of the event, and the second argument contains the extra information to carry.
* Its name must end with *EventHandler*.

The Framework defines a generic `EventHandler<TEventArgs>` and a non-generic `EventHandler` delegate that satisfies these rules:

```csharp
public delegate void EventHandler<TEventArgs>
(object source, TEventArgs e) where TEventArgs : EventArgs;
```

Before generics existed in the language (prior to C# 2.0), we would have had to instead write a custom delegate as follows:

```csharp
public delegate void PriceChangedHandler (object sender, PriceChangedEventArgs e);
```

### 3. Define the event

The next step is to define an event of the chosen delegate type. We have two options:

#### 3.1 Non passing Data

```csharp
public event EventHandler RaiseCustomEvent;
```

#### 3.2 Passing Data version

```csharp
public event EventHandler<PriceChangedEventArgs> RaiseCustomEvent;
```

### 4. Define the method that fires the event

Finally, the pattern requires that you write a `protected` `virtual` method that fires the event. The name must match the name of the event, prefixed with the word *On*, and then accept a single `EventArgs` argument:

```csharp
public class Stock
{
...

    public event EventHandler<PriceChangedEventArgs> PriceChanged;

    protected virtual void OnPriceChanged (PriceChangedEventArgs e)
    {
        if (PriceChanged != null) PriceChanged (this, e);
        // PriceChanged?.Invoke(this, e);
    }

...
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