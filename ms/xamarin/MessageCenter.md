# Xamarin Messaging Center

- [Xamarin Messaging Center](#xamarin-messaging-center)
  - [Publish-Subscribe pattern](#publish-subscribe-pattern)
  - [Messaging Center](#messaging-center)
  - [Publishing](#publishing)
    - [Publish a message](#publish-a-message)
    - [Publish a message with data (payload)](#publish-a-message-with-data-payload)
  - [Subscribing](#subscribing)
    - [Subscribe to a message](#subscribe-to-a-message)
    - [Subscribe to a message with data (payload)](#subscribe-to-a-message-with-data-payload)
  - [Unsubscribing](#unsubscribing)
    - [Unsubscribe message](#unsubscribe-message)
    - [Unsubscribre messages with data (payload)](#unsubscribre-messages-with-data-payload)

## Publish-Subscribe pattern

The publish-subscribe pattern is a messaging pattern in which `publishers` send messages without having knowledge of any receivers, known as `subscribers`. Similarly, `subscribers` listen for specific messages, without having knowledge of any `publishers`.

The Xamarin.Forms `MessagingCenter` class implements the **publish-subscribe pattern**, allowing message-based communication between components. 

## Messaging Center

Publishers send messages using the `MessagingCenter.Send` method, while subscribers listen for messages using the `MessagingCenter.Subscribe` method. In addition, subscribers can also unsubscribe from message subscriptions, if required, with the `MessagingCenter.Unsubscribe` method.

## Publishing

### Publish a message

```c#
MessagingCenter.Send<MainPage>(this, "Hi");
```

- The first argument specifies the **sender instance**.
- The second argument specifies the **message**.

### Publish a message with data (payload)

```c#
MessagingCenter.Send<MainPage, string>(this, "Hi", "John");
```

In this example, the `Send` method specifies two generic arguments:

- The first is the type that's sending the **message**
- The second is the type of the **payload data being sent**.

This enables multiple messages that share a message identity but send different payload data types to be received by different subscribers. In this case the payload is "John".

## Subscribing

### Subscribe to a message

```c#
MessagingCenter.Subscribe<MainPage> (this, "Hi", (sender) =>
{
    // Do something whenever the "Hi" message is received
});
```

In this example, the `Subscribe` method subscribes the `this` object to `Hi` messages that are sent by the `MainPage` type, and executes a `callback delegate` in response to receiving the message. The `callback delegate`, specified as a lambda expression, could be code that updates the UI, saves some data, or triggers some other operation.

### Subscribe to a message with data (payload)

```c#
MessagingCenter.Subscribe<MainPage, string>(this, "Hi", async (sender, arg) =>
{
    await DisplayAlert("Message received", "arg=" + arg, "OK");
});
```

In this example, the `Subscribe` method subscribes to `Hi` messages that are sent by the `MainPage` type, whose payload data is a `string`. A `callback delegate` is executed in response to receiving such a message, that displays the payload data in an alert.

## Unsubscribing

### Unsubscribe message

```c#
MessagingCenter.Unsubscribe<MainPage>(this, "Hi");
```

In this example, the `Unsubscribe` method unsubscribes the `this` object from the `Hi` message sent by the `MainPage` type.

### Unsubscribre messages with data (payload)

```c#
MessagingCenter.Unsubscribe<MainPage, string>(this, "Hi");
```

In this example, the `Unsubscribe` method unsubscribes the `this` object from the `Hi` message sent by the `MainPage` type, whose payload data is a `string`.

>🎞 [Example](https://github.com/xamarin/xamarin-forms-samples/tree/main/UsingMessagingCenter)