# NSNotificacitionCenter

Notifications are broadcast messages that are used to decouple classes and establish anonymous communication between objects at runtime. Notifications may be posted by any number of objects and received by any number of objects thus enabling one-to-many and many-to-many relationships between objects.

Note: Notifications are sent synchronously so if your observer method takes a long time to return, you are essentially prevently the notification from being sent to other observing objects.

## Registering Observers

You can register to be notified when a certain event has happened, including system notifications, such as a UITextField which has begun editing.

```objc
[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(textFieldDidBeginEditing:)
                                             name:UITextFieldTextDidBeginEditingNotification object:self];
```

When the `UITextFieldTextDidBeginEditingNotification` notification is broadcast by the OS framework, the `textFieldDidBeginEditing:` will be called by `NSNotificationCenter` and an object will be sent along with the notification that could contain data.

A possible implementation of the `textFieldDidBeginEditing:` method could be:

```objc
#pragma mark - Text Field Observers

- (void)textFieldDidBeginEditing:(NSNotification *)notification
{
    // Optional check to make sure the method was called from the notification
    if ([notification.name isEqualToString:UITextFieldTextDidBeginEditingNotification])
    {
        // Do something
    }
}
```

## Removing Observers

It's important to remove yourself as an observer when the class is deallocated, otherwise NSNotificationCenter will attempt to call a method on a deallocated class and a crash will ensue.

```objc
- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}
```

## Posting Notifications

You can also create and post your own notifications. It's best practice to keep notification names in a constants file so that you don't accidentally misspell one of the notification names and sit there trying to figure out why the notification wasn't sent/received.

Naming notifications:

Notifications are identified by `NSString` objects whose names are composed in this way:

```objc
[Name of associated class] + [Did | Will] + [UniquePartOfName] + Notification
```

Declare a string constant, using the notification name as the string's value:

```objc
// Remember to put the extern of this in the header file
NSString *const kRPAppDidResumeFromBackgroundNotification = @"RPAppDidResumeFromBackgroundNotification";
```

Post notification:

```objc
[[NSNotificationCenter defaultCenter] postNotificationName:kRPAppDidResumeFromBackgroundNotification object:self];
```