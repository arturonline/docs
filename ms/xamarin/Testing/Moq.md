# Moq

## Intro

When writing a test, quite often you want to only test one particular class and method. But that method might call a dependency. How do you call the method you want to test, without it calling into the dependency?

A mocking library allows you to simulate an interface or abstract type's implementation. You instantiate a 'mock' object of the interface, and tell that mock object what it should return if a method/property is called against that mock. You can also assert that a method/property was or wasn't called.

There are quite a few different mocking libraries in .NET. Moq seems the most popular among c# developers.

## Basic scenario

Imagine a Class called `OrderHandler` that needs two interfaces (`IStockChecker` and `IOrderRepository`) that are injected in the constructor:

```cs
[Fact]
public void GivenInsufficientStock_DoNotCreateOrder()
{
    // Arrange
    var mockStockChecker = new Mock<IStockChecker>();
    var mockOrderRepository = new Mock<IOrderRepository>();

    mockStockChecker.Setup(x => x.IsProductInStock()).Returns(false);

    var sut = new OrderHandler(mockStockChecker.Object, mockOrderRepository.Object);

    // Act
    sut.ProcessOrder();

    // Assert
    mockOrderRepository.Verify(x => x.CreateOrder(It.IsAny<int>()), Times.Never);
}
```

As you can see, the dependencies are **mocked out**. The real implementation would have called out to a database, but the class we're testing doesn't know or care about this - it just cares that whatever "`IsProductInStock`" is, we get a boolean back. It doesn't care where that comes from, as that's not it's responsibility. What is it's responsibility is that if `IsProductInStock` returns true, the class we're testing will execute `ProcessOrder`. And likewise, if it returns false, it does not execute `ProcessOrder`.

## Moq Methods

### Mock creation and simple 'Returns' Setup with no parameters

```cs
var mockStockChecker = new Mock<IStockChecker>();
mockStockChecker.Setup(x => x.IsProductInStock()).Returns(true);
var sut = new TheClassIAmTesting(mockStockChecker.Object);
sut.DoSomething();
```

### 'Return' Setup with explicit parameters

```cs
mockStockChecker.Setup(x => x.IsProductInStock("banana")).Returns(false);
```

### 'Return' Setup regardless of parameter values

```cs
mockStockChecker.Setup(x => x.IsProductInStock(It.IsAny<string>())).Returns(true);
```

### Throwing exceptions

```cs
mockStockChecker.Setup(x => x.IsProductInStockAsync("")).Throws(new NullReferenceException());
```

### Verifying a mocked method is or isn't called

```cs
mockOrderRepository.Verify(x => x.CreateOrder()); // Defaults to Times.AtLeastOnce
mockOrderRepository.Verify(x => x.CreateOrder(), Times.Never);
mockOrderRepository.Verify(x => x.CreateOrder(), Times.Once);
mockOrderRepository.Verify(x => x.CreateOrder(), Times.Exactly(2));
mockOrderRepository.Verify(x => x.CreateOrder(), Times.Exactly(3));
```

## Links

Tutorial: https://www.danclarke.com/comparing-dotnet-mocking-libraries
Moq: https://github.com/Moq/moq4/wiki/Quickstart