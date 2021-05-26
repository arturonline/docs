# Modal Pages

A modal page encourages users to complete a self-contained task that cannot be navigated away from until the task is completed or cancelled.

## Pushing Pages to the Modal Stack

To navigate to the `ModalPage` it is necessary to invoke the `PushModalAsync` method on the Navigation property of the current page, as demonstrated in the following code example:

```C#
async void OnItemSelected (object sender, SelectedItemChangedEventArgs e)
{
  if (listView.SelectedItem != null) {
    var detailPage = new DetailPage ();
    ...
    await Navigation.PushModalAsync (detailPage);
  }
}
```

## Popping Pages from the Modal Stack

The active page can be popped from the modal stack by pressing the Back button on the device, regardless of whether this is a physical button on the device or an on-screen button.

To programmatically return to the original page, the ModalPage instance must invoke the `PopModalAsync` method:

```C#
async void OnDismissButtonClicked (object sender, EventArgs args)
{
  await Navigation.PopModalAsync ();
}
```

⚠ On Android, the user can always return to the previous page by pressing the standard Back button on the device. If the modal page requires the user to complete a self-contained task before leaving the page, the application must disable the Back button:

```c#
protected override bool OnBackButtonPressed() => true;
```

## Animating Page Transitions

On by default.

The Navigation property of each page also provides overridden push and pop methods that include a boolean parameter that controls whether to display a page animation during navigation. Setting the boolean parameter to false disables the page-transition animation.

```c#
async void OnNextPageButtonClicked (object sender, EventArgs e)
{
  // Page appearance not animated
  await Navigation.PushModalAsync (new DetailPage (), false);
}

async void OnDismissButtonClicked (object sender, EventArgs args)
{
  // Page appearance not animated
  await Navigation.PopModalAsync (false);
}
```

## Passing Data through constructor

```c#
public App ()
{
  MainPage = new MainPage (DateTime.Now.ToString ("u")));
}
```

```c#
public MainPage (string date)
{
  InitializeComponent ();
  dateLabel.Text = date;
}
```

## Passing Data Through a BindingContext

```c#
async void OnItemSelected (object sender, SelectedItemChangedEventArgs e)
{
  if (listView.SelectedItem != null) {
    var detailPage = new DetailPage ();
    detailPage.BindingContext = e.SelectedItem as Contact;
    listView.SelectedItem = null;
    await Navigation.PushModalAsync (detailPage);
  }
}
```

This code sets the BindingContext of the DetailPage instance to the Contact instance, and then navigates to the DetailPage.

The DetailPage then uses data binding to display the Contact instance data, as shown in the following XAML code example:

```c#
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="ModalNavigation.DetailPage">
    <ContentPage.Padding>
      <OnPlatform x:TypeArguments="Thickness">
        <On Platform="iOS" Value="0,40,0,0" />
      </OnPlatform>
    </ContentPage.Padding>
    <ContentPage.Content>
        <StackLayout HorizontalOptions="Center" VerticalOptions="Center">
            <StackLayout Orientation="Horizontal">
                <Label Text="Name:" FontSize="Medium" HorizontalOptions="FillAndExpand" />
                <Label Text="{Binding Name}" FontSize="Medium" FontAttributes="Bold" />
            </StackLayout>
              ...
            <Button x:Name="dismissButton" Text="Dismiss" Clicked="OnDismissButtonClicked" />
        </StackLayout>
    </ContentPage.Content>
</ContentPage>
```
