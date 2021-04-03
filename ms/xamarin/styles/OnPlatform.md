# OnPlatform as a resource

It's common to need to adjust your app's UI slightly between platforms. The standard way to define the platform-specific values is by using an OnPlatform object.
Because ResourceDictionary maps strings to objects, you can put an OnPlatform instance in a dictionary. For example, the following code shows how to use different text colors on iOS and Android.

```xml
<Page.Resources>
    <OnPlatform x:Key="textColor"
                x:TypeArguments="Color"
                iOS="Silver"
                Android="Green" />
</Page.Resources>

...

<Label TextColor="{StaticResource textColor}" ... />
```