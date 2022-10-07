# Events

## 1. Publisher

1. En la clase donde se produce el evento (publisher):

```cs
// CounterService

// 1. Creamos un manejador de eventos
public event EventHandler OnChangeCounter;


// Método donde se produce el evento
public void method() {
    ...

    // Se produce un "evento" importante (ex: se modifica una variable)
    count = count + 1;

    // 2. Avisamos a los suscriptores a traves del manejador de eventos!
    OnChangeCounter?.Invoke(this, EventArgs.Empty);
}
```

## 2. Subscriber

En los lugares donde necesitamos reaccionar cuando se produce el evento:

1. evento nos suscribimos:

```cs
// En el constructor nos suscribimos
protected override void OnInitialized()
{
    CounterService.OnChangeCounter += OnCounterChange;
}
```

2. Reaccionamos:

```cs
// Este método se ejecutara cada vez que se lance `OnChangeCounter?.Invoke() en el publisher
private void OnCounterChange(object? sender, EventArgs e)
{
    Console.Log("Se ha producido una suma");
}
```

## 3. Dispose

Es importante cuando la clase que se ha suscrito vaya a desaparecer cancelar la suscripción:

```cs
public void Dispose()
{
    CounterService.OnChangeCounter -= OnChangeAppointment;
}
```

## 4. Example

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