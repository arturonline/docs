# Shell Navigation

Pages are registered in the `Shell.xaml` as **route**:

```xml
<Shell ...>
    <FlyoutItem ...
                Route="animals">
        <Tab ...
             Route="domestic">
            <ShellContent ...
                          Route="cats" />
            <ShellContent ...
                          Route="dogs" />
        </Tab>
        <ShellContent ...
                      Route="monkeys" />
        <ShellContent ...
                      Route="elephants" />
        <ShellContent ...
                      Route="bears" />
    </FlyoutItem>
    <ShellContent ...
                  Route="about" />
    ...
</Shell>
```

```sh
animals
  domestic
    cats
    dogs
  monkeys
  elephants
  bears
about
```

## Register pages

Pages that aren't represented in the Shell visual hierarchy can be explicitly registered:

```cs
Routing.RegisterRoute("monkeydetails", typeof(MonkeyDetailPage));
Routing.RegisterRoute("beardetails", typeof(BearDetailPage));
Routing.RegisterRoute("catdetails", typeof(CatDetailPage));
Routing.RegisterRoute("dogdetails", typeof(DogDetailPage));
Routing.RegisterRoute("elephantdetails", typeof(ElephantDetailPage));
```

This example registers detail pages, that aren't defined in the Shell subclass, as routes.

## Perform navigation

Navigation can then be performed by calling the `GoToAsync` method on the Shell object. This method navigates to a `ShellNavigationState` and returns a Task that will complete once the navigation animation has completed.

## Routes

### Absolute routes

```cs
await Shell.Current.GoToAsync("//animals/monkeys");
```

### Relative routes

```cs
await Shell.Current.GoToAsync("monkeydetails");
```

The following relative route formats are supported:

| Format     | Description                                                     |
| ---------- | ----------------------------------------------------------------|
| `route`    | The route will be searched upwards from the current position.   |
| `/route`   | The route will be searched downwards from the current position. |
| `//route`  | The route will be searched upwards from the current position.   |
| `///route` | The route will be searched downwards from the current position. |

### Backwards navigation

```cs
await Shell.Current.GoToAsync("..");

await Shell.Current.GoToAsync("../route");

await Shell.Current.GoToAsync("../../route");
```

## Pass data

In addition, data can be passed through query properties when navigating backwards:

```cs
await Shell.Current.GoToAsync($"..?parameterToPassBack={parameterValueToPassBack}");
```

This is achieved by appending `?` after a route, followed by a query parameter `id`, `=`, and a `value`.

For example, this code retrieves the currently selected elephant in the CollectionView, and navigates to the `elephantdetails route`, passing `elephantName` as a query parameter.:

```cs
async void OnCollectionViewSelectionChanged(object sender, SelectionChangedEventArgs e)
{
    string elephantName = (e.CurrentSelection.FirstOrDefault() as Animal).Name;
    await Shell.Current.GoToAsync($"elephantdetails?name={elephantName}");
}
```

Navigation data can be received by decorating the receiving class with a QueryPropertyAttribute for each query parameter:

```cs
[QueryProperty(nameof(Name), "name")]
public partial class ElephantDetailPage : ContentPage
{
    public string Name
    {
        set
        {
            LoadAnimal(value);
        }
    }
    ...

    void LoadAnimal(string name)
    {
        try
        {
            Animal animal = ElephantData.Elephants.FirstOrDefault(a => a.Name == name);
            BindingContext = animal;
        }
        catch (Exception)
        {
            Console.WriteLine("Failed to load animal.");
        }
    }    
}
```

- The first argument for the `QueryPropertyAttribute` specifies the **name of the property** that will receive the data
- The second argument specifying the query parameter **id**. 

In the above example, the **Name property** will receive the data passed in the **name query parameter** from the URI in the `GoToAsync` method call. The Name property setter calls the `LoadAnimal` method to retrieve the Animal object for the name, and sets it as the `BindingContext` of the page.

### Multiple params

```cs
async void OnCollectionViewSelectionChanged(object sender, SelectionChangedEventArgs e)
{
    string elephantName = (e.CurrentSelection.FirstOrDefault() as Animal).Name;
    string elephantLocation = (e.CurrentSelection.FirstOrDefault() as Animal).Location;
    await Shell.Current.GoToAsync($"elephantdetails?name={elephantName}&location={elephantLocation}");
}
```