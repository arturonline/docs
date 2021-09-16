# Share Context between Tests

xUnit.net offers several methods for sharing setup and cleanup code, depending on the scope of things to be shared.

- **Constructor and Dispose** (shared setup/cleanup code without sharing object instances)
- **Class Fixtures** (shared object instance across tests in a single class)
- **Collection Fixtures** (shared object instances across multiple test classes)

## Constructor and Dispose

>When to use: when you want a clean test context for every test (sharing the setup and cleanup code, without sharing the object instance).

```cs
public class StackTests : IDisposable
{
    Stack<int> stack;

    public StackTests()
    {
        stack = new Stack<int>();
    }

    public void Dispose()
    {
        stack.Dispose();
    }

    [Fact]
    public void WithNoItems_CountShouldReturnZero()
    {
        var count = stack.Count;

        Assert.Equal(0, count);
    }

    [Fact]
    public void AfterPushingItem_CountShouldReturnOne()
    {
        stack.Push(42);

        var count = stack.Count;

        Assert.Equal(1, count);
    }
}
```

## Class Fixtures

>When to use: when you want to create a single test context and share it among all the tests in the class, and have it cleaned up after all the tests in the class have finished.

Sometimes test context creation and cleanup can be very expensive. If you were to run the creation and cleanup code during every test, it might make the tests slower than you want. You can use the class fixture feature of xUnit.net to share a single object instance among all tests in a test class.

To use class fixtures, you need to take the following steps:

1. Create the fixture class, and put the startup code in the fixture class constructor.
1. If the fixture class needs to perform cleanup, implement `IDisposable` on the fixture class, and put the cleanup code in the `Dispose()` method.
1. Add `IClassFixture<>` to the test class.
1. If the test class needs access to the fixture instance, add it as a constructor argument, and it will be provided automatically.

Here is a simple example:

```cs
public class DatabaseFixture : IDisposable
{
    public DatabaseFixture()
    {
        Db = new SqlConnection("MyConnectionString");

        // ... initialize data in the test database ...
    }

    public void Dispose()
    {
        // ... clean up test data from the database ...
    }

    public SqlConnection Db { get; private set; }
}

public class MyDatabaseTests : IClassFixture<DatabaseFixture>
{
    DatabaseFixture fixture;

    public MyDatabaseTests(DatabaseFixture fixture)
    {
        this.fixture = fixture;
    }

    // ... write tests, using fixture.Db to get access to the SQL Server ...
}
```

xUnit.net uses the presence of the interface `IClassFixture<>` to know that you want a class fixture to be created and cleaned up (injected). It will do this whether you take the instance of the class as a constructor argument or not.

## Collection Fixtures

>When to use: when you want to create a single test context and share it among tests in several test classes, and have it cleaned up after all the tests in the test classes have finished.

Sometimes you will want to share a fixture object among multiple test classes. The database example used for class fixtures is a great example: you may want to initialize a database with a set of test data, and then leave that test data in place for use by multiple test classes. You can use the collection fixture feature of xUnit.net to share a single object instance among tests in several test classes.

xUnit.net treats collection fixtures in much the same way as class fixtures, except that the lifetime of a collection fixture object is longer: it is created before any tests are run in any of the test classes in the collection, and will not be cleaned up until all test classes in the collection have finished running.

Here is a simple example:

```cs
public class DatabaseFixture : IDisposable
{
    public DatabaseFixture()
    {
        Db = new SqlConnection("MyConnectionString");

        // ... initialize data in the test database ...
    }

    public void Dispose()
    {
        // ... clean up test data from the database ...
    }

    public SqlConnection Db { get; private set; }
}

[CollectionDefinition("Database collection")]
public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
{
    // This class has no code, and is never created. Its purpose is simply
    // to be the place to apply [CollectionDefinition] and all the
    // ICollectionFixture<> interfaces.
}

[Collection("Database collection")]
public class DatabaseTestClass1
{
    DatabaseFixture fixture;

    public DatabaseTestClass1(DatabaseFixture fixture)
    {
        this.fixture = fixture;
    }
}

[Collection("Database collection")]
public class DatabaseTestClass2
{
    // ...
}
```
