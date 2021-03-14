# XAML

XAML is a declarative markup language that declaratively describe the application UI elements:

```xml
<Label />
```

These elements in XAML directly represent the instantiation of objects:

```cs
new Label()
```

⚠ `Xamarin.Forms XAML` and `Microsoft XAML` are differents. The structure and concepts are similar. However, some of the names of the classes and properties will be different.

## Atributtes

```xml
<Label Text="Username" TextColor="Black" />
```

```cs
new Label {Text = "Username", TextColor = Color.Black}
```

## Default content property

Some **Xamarin.Forms** controls have a default content property. The content property allows you to specify the value of a property on a control without explicitly stating it in XAML:

Example:

Since it's common to add children to a StackLayout, it's Children property is the default content property.

```xml
<StackLayout>
    <StackLayout.Children>
        <Label Text="Please log in" />
    </StackLayout.Children>
</StackLayout>
```

It means that we can add a child without using the Children property directly. Here is what that would look like:

```xml
<StackLayout>
    <Label Text="Please log in" />
</StackLayout>
```

## Complex type assignment

Let's assume you want to assign a gesture recognizer to a label so that the user of the app can tap on the label. The gesture recognizer is a complex object with its own properties. Typically, these properties need to be assigned to ensure proper functionality:

```xml
<TapGestureRecognizer NumberOfTapsRequired="2" />
```

If we wanted to assign this value to a Label, we can write our XAML this way:

```xml
<Label Text="Username" TextColor="Black" FontSize="42" FontAttributes="Bold,Italic">
    <Label.GestureRecognizers>
        <TapGestureRecognizer NumberOfTapsRequired="2" />
    </Label.GestureRecognizers>
</Label>
```

## Access XAML elements from c#

To access elements that are created in the XAML we use the XAML attribute `x:Name` like this:

```xml
 <StackLayout>
    <Button x:Name="loginButton" Text="Log in" />
</StackLayout>
```

```cs
public MyPage() {
    ...
    loginButton.Clicked += (sender, e) => {
        Debug.WriteLine("Clicked !");
    };
}
```

## Events

2 ways to deal with events:

### Events accessing elements by name

```xml
 <StackLayout>
    <Button x:Name="loginButton" Text="Log in" />
</StackLayout>
```

```cs
public MyPage() {
    ...
    loginButton.Clicked += (sender, e) => {
        Debug.WriteLine("Clicked !");
    };
}
```

### Events with attributes in XAML

```xml
 <StackLayout>
    <Button Clicked="loginButton_Clicked" Text="Log in" />
</StackLayout>
```

```cs
public MyPage() {
    ...
    loginButton_Clicked(object sender, EventsArgs e) => {
        Debug.WriteLine("Clicked !");
    };
}
```

You don't need to name the element when you use a XAML attribute to specify the event handler.

