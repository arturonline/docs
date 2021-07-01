# Hierichal and Modal navigation

By default pages are pushed into a stack. To include a hierichal tree we need to use a NavigationPage:

```c#
// App.xaml.cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterForNavigation<NavigationPage>(); // Create an empty stack
    containerRegistry.RegisterForNavigation<MainPage>();
    ...
}

protected override async void OnInitialized() 
{
    InitializeComponent();

    var result = await NavigationService.NavigateAsync("NavigationPage/MainPage"); // Add MainPage to the stack
}
```

Every time we travel to a page is added to a stack.

if your navigation stack is rooted within a **NavigationPage** such as `NavigationPage/ViewA/ViewB`, then you call `_navigationService.NavigateAsync("ViewC")` from `ViewB`, `ViewC` will be pushed onto the NavigationPage's navigation stack and your new navigation stack will look like `"NavigationPage/ViewA/ViewB/ViewC"`. If you do not want this behavior, and instead wish to force ViewC to be navigated to modally, you must set the useModalNavigation parameter to **true**.

```c#
_navigationService.NavigateAsync("ViewC", useModalNavigation: true);
```

## Relative and Absolute Navigation

### Relative

Relative navigation will always push pages onto the current navigation stack relative to where you are calling the `INavigationService.NavigateAsync` method. 

For example; assuming your current navigation stack is "ViewA/ViewB", and from ViewB you call INavigationService.NavigateAsync("ViewC"), your navigation stack will now look like "ViewA/ViewB/ViewC".


```c#
//relative short-syntax
_navigationService.NavigateAsync("MainPage");

//relative URI-syntax
_navigationService.NavigateAsync(new Uri("MainPage", UriKind.Relative));
```

### Absolute 

Absolute navigation will reset the entire navigation stack no matter where you call it, or where you are in the current navigation stack. It is equivalent to `Application.Current.MainPage = new MainPage()`

```c#
//absolute short-syntax
_navigationService.NavigateAsync("/MainPage"); //notice the prefix /

//absolute URI-syntax
_navigationService.NavigateAsync(new Uri("http://www.brianlagunas.com/MainPage", UriKind.Absolute));
```

## GoBackAsync

Going back to the previous View is as simple calling the `INavigationService.GoBackAsync` method.

```c#
_navigationService.GoBackAsync();
```