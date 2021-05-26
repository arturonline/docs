# Hierarchical Navigation

The `NavigationPage` class provides a hierarchical navigation experience in a last-in, first-out (LIFO) stack of Page objects.

The first page added to a navigation stack is referred to as the root page of the application:

```c#
public App ()
{
  MainPage = new NavigationPage (new Page1Xaml ());
}
```

## Pushing Pages

To navigate to Page2Xaml, it is necessary to invoke the PushAsync method on the Navigation property of the current page:

```c#
async void OnNextPageButtonClicked (object sender, EventArgs e)
{
  await Navigation.PushAsync (new Page2Xaml ());
}
```

## Popping Pages

The active page can be popped from the navigation stack by:

1. pressing the physical Back button on the device
1. pressing the on-screen Back button.

To programmatically return to the original page, the Page2Xaml instance must invoke the PopAsync method, as demonstrated in the following code example:

```C#
async void OnPreviousPageButtonClicked (object sender, EventArgs e)
{
  await Navigation.PopAsync ();
}
```

## Go directly to root

To pops all but the root Page off the navigation stack:

```c#
async void OnRootPageButtonClicked (object sender, EventArgs e)
{
  await Navigation.PopToRootAsync ();
}
```

## Animating Page Transitions

The Navigation property of each page also provides overridden push and pop methods that include a **boolean** parameter that controls whether to display a page animation during navigation. However, the push and pop methods that lack this parameter enable the animation by default.

```c#
async void OnNextPageButtonClicked (object sender, EventArgs e)
{
  // Page appearance not animated
  await Navigation.PushAsync (new Page2Xaml (), false);
}

async void OnPreviousPageButtonClicked (object sender, EventArgs e)
{
  // Page appearance not animated
  await Navigation.PopAsync (false);
}

async void OnRootPageButtonClicked (object sender, EventArgs e)
{
  // Page appearance not animated
  await Navigation.PopToRootAsync (false);
}
```

## Passing Data through Constructor

```c#
public App ()
{
  MainPage = new NavigationPage (new MainPage (DateTime.Now.ToString ("u")));
}
```

```c#
public MainPage (string date)
{
  InitializeComponent ();
  dateLabel.Text = date;
}
```

## Passing Data Through BindingContext

```c#
async void OnNavigateButtonClicked (object sender, EventArgs e)
{
  var contact = new Contact {
    Name = "Jane Doe",
    Age = 30,
    Occupation = "Developer",
    Country = "USA"
  };

  var secondPage = new SecondPage ();
  secondPage.BindingContext = contact;
  await Navigation.PushAsync (secondPage);
}
```

```c#
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PassingData.SecondPage"
             Title="Second Page">
    <ContentPage.Content>
        <StackLayout HorizontalOptions="Center" VerticalOptions="Center">
            <StackLayout Orientation="Horizontal">
                <Label Text="Name:" HorizontalOptions="FillAndExpand" />
                <Label Text="{Binding Name}" FontSize="Medium" FontAttributes="Bold" />
            </StackLayout>
            ...
            <Button x:Name="navigateButton" Text="Previous Page" Clicked="OnNavigateButtonClicked" />
        </StackLayout>
    </ContentPage.Content>
</ContentPage>
```

## Manipulating the Navigation Stack

The Navigation property provides the InsertPageBefore and RemovePage methods for manipulating the stack by inserting pages or removing them.

The `InsertPageBefore` method inserts a specified page in the navigation stack before an existing specified page:

```c#
public void InsertPageBefore (.Page NewPage, Page before);
```

The `RemovePage` method removes the specified page from the navigation stack, as shown in the following diagram:

```c#
public void RemovePage (Page page);

```

These methods enable a custom navigation experience, such as replacing a login page with a new page, following a successful login. The following code example demonstrates this scenario:

```c#
async void OnLoginButtonClicked (object sender, EventArgs e)
{
  ...
  var isValid = AreCredentialsCorrect (user);
  if (isValid) {
    App.IsUserLoggedIn = true;
    Navigation.InsertPageBefore (new MainPage (), this);
    await Navigation.PopAsync ();
  } else {
    // Login failed
  }
}
```

## NavigationPage Title

Any `Xamarin.Forms` View can be displayed in the navigation bar of a `NavigationPage`. This is accomplished by setting the `NavigationPage.TitleView` attached property to a View. This attached property can be set on any Page, and when the Page is pushed onto a `NavigationPage`, the `NavigationPage` will respect the value of the property.
