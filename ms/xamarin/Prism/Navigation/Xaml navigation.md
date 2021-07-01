# Xaml Navigation

Prism allows you to declare your navigation directly inside your Xaml via a Markup Extension.

## Navigation

```xml
<Page xmlns:prism="http://prismlibrary.com">

<!-- normal navigation -->
<Button Command="{prism:NavigateTo 'path/to/navigate'}" />

<!-- replace a page on the stack -->
<Button Command="{prism:NavigateTo '../navigate'}" />

<!-- go back one -->
<Button Command="{prism:GoBack}" />

<!-- go back to the root -->
<Button Command="{prism:GoBack ToRoot}" />
```

## Adding Parameters

```xml
<Button Command="{prism:NavigateTo 'path/to/navigate'}">
    <Button.CommandParameter>
        <prism:NavigationParameters>
            <prism:NavigationParameter Key="Foo" Value="{Binding SomeBarValue}" />
            <prism:NavigationParameter Key="Fizz" Value="Some Buzz Value" />
        </prism:NavigationParameters>
    </Button.CommandParameter>
</Button>
```