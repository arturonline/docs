# Navigation in Prism

## #1. Register the pages

In order to register your Pages for Navigation, override the `RegisterTypes` method in your `App.cs`. 
There are four ways to register your Pages for navigation; **default**, **custom**, **OnPlatform**, and **OnIdiom**.
### Default Registration

By default, `RegisterForNavigation` will use the Name of the Page as the unique identifier/key:

```cs
// Register MainPage.cs as "MainPage"
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterForNavigation<MainPage>();
}

// To navigate to the MainPage:
_navigationService.NavigateAsync("MainPage");
```

You can provide the `ViewModel` when registering your Page for navigation to avoid some performance penalty:

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterForNavigation<MainPage, MainPageViewModel>();
}
```
### Custom Registration

We can specify a custom string to identify our page:

```cs
// Register MainPage.cs as "CustomKey"
protected override void RegisterTypes()
{
    Container.RegisterTypeForNavigation<MainPage>("CustomKey");
}

// To navigate to the MainPage:
_navigationService.NavigateAsync("CustomKey");

```
### OnPlatform Registration

When writing a Xamarin.Forms application, it is common to use a different view for a specific platform. Prism enables you to register different views for different platforms while using the same ViewModel:

```cs
// We have registered the MainPageAndroid, and for iOS We have registered the MainPageiOS. 
// Both MainPageAndroid and MainPageiOS will use the MainPageViewModel as their BindingContent.
containerRegistry.RegisterForNavigationOnPlatform<MainPage, MainPageViewModel>(
    new Platform<MainPageAndroid>(RuntimePlatform.Android),
    new Platform<MainPageiOS>(RuntimePlatform.iOS)
);

// To navigate to the MainPage use:
_navigationService.NavigateAsync("MainPage");
```
### OnIdiom Registration

Another common scenario when creating a Xamarin.Forms aplication is the need to provide a different view based on the device the app is running on, such as Desktop, Phone, Tablet, etc.

```cs
containerRegistry.RegisterForNavigationOnIdiom<MainPage, MainPageViewModel>(
    desktopView: typeof(MainPageDesktop),
    tabletView: typeof(MainPageTablet)
);

//To navigate to the MainPage use:
_navigationService.NavigateAsync("MainPage");
```

## #2: Get the navigationService

Once your views are registered for navigation, you must use the `INavigationService` to perform navigation. To obtain the `INavigationService` in your ViewModel simply ask for it as a constructor parameter and name it **navigationService**.

```cs
private readonly INavigationService _navigationService;

public MainPageViewModel(INavigationService navigationService) // has to be named correctly
{
    _navigationService = navigationService;
}
```

## #3: Perform navigation

Once you have the `INavigationService` in your ViewModel, you can navigate to your target views by calling the `INavigationService.NavigateAsync` method and provide the unique identifier/key that represents the target Page.

```cs
//relative short-syntax to navigate to MainPage
_navigationService.NavigateAsync("MainPage");

//relative URI-syntax to navigate to MainPage
_navigationService.NavigateAsync(new Uri("MainPage", UriKind.Relative));
```