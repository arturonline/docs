# Prism Navigation: Passing Parameters

## #1: Create the parameters and send them

### With a Map

```c#
var navigationParams = new NavigationParameters();

navigationParams.Add("title", "mytitle");
navigation.Params.Add("desc", "Red");

_navigationService.NavigateAsync("MainPage", navigationParams);
```

### With HTML Query

```c#
var queryString = "title=mytitle&desc=Red";
var navigationParams = new NavigationParameters(queryString);

_navigationService.NavigateAsync("MainPage", navigationParameters);
```

## #2: Getting the parameters

Getting the parameters that were passed to the target View being navigated to can be achieved by using the `INavigationAware` interface on the corresponding ViewModel. This interface adds two methods to your ViewModel so you can intercept once it is navigated to (`OnNavigatedTo`), and once it is navigated away from (`OnNavigatedFrom`). These methods make the NavigationParameters accessible from either the View being navigated to, or the View being navigated away from.

```c#
public class ContactPageViewModel : INavigationAware // implement the interface and methods
{
    public void OnNavigatedTo(INavigationParameters parameters)
    {

    }

    public void OnNavigatedFrom(INavigationParameters parameters)
    {

    }
}
```

## #3: Reading parameters

```c#
public void OnNavigatedTo(INavigationParameters parameters)
{
  Title = parameters.GetValue<string>("title"); // mytitle
  ColorDescription = parameters.GetValue<string>("desc"); // red
}
```