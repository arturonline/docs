# Unit Tests

Unit tests break down the functionality of your program into discrete testable behaviors that you can test as individual units.

## xUnit

XUnit has become the most popular testing framework in dotnet due to its simplicity, expressiveness, and extensibility. The project is supported by the .NET Foundation, and it is part of the more recent versions of .NET Core. This means that you don't need to install anything but the .NET Core SDK.

## Set Up

Create new *"xUnit Test Project"* in the solution you want to test.

## Run tests

To run these test cases:

- go to Test -> Test Explorer.
- `dotnet test`

## Writing test cases

Typically, a test case comprises of 3 major parts.
1. **Arrange**: Here we specify what is expected from our method that we are supposed to be testing.
1. **Action**: In here we call the method that we are supposed to be testing. Purpose of this is to get actual result from the method
1. **Assertion**: Here we compare actual value to expected value.

### Types of tests in xUnit

xUnit.net includes support for two different major types of unit tests: **facts** and **theories**.

### `[Fact]`

This attribute marks a method as a test without parameters:

Method:

```cs
public class MailManager
{
  public bool IsValidAddress(string emailAddress)
  {
    Regex regex = new Regex(@"^[\w0-9._%+-]+@[\w0-9.-]+\.[\w]{2,6}$");
    return regex.IsMatch(emailAddress);
  }
}
```

Test:

```cs
public class MailManagerTest
{
  [Fact]
  public void ValidEmail()
  {
      //Arrange
    var mailManager = new MailManager();
    const string mailAddress = "john.smith@company.com";

      //Act
      bool isValid = mailManager.IsValidAddress(mailAddress);

      //Assert
    Assert.True(isValid, $"The email {mailAddress} is not valid");
  }
}
```

### `[Theories]`

This attribute marks a method as a test with parameters.
You can execute a test marked as Theories several times with different parameters:

```cs
[Theory]
[InlineData("john.smith@company.com", true)]
[InlineData("johnsmith@company.com", true)]
[InlineData("john.smith@company.comma", true)]
[InlineData("john.smith@company.it", true)]
[InlineData("john.smith.company.com", false)]
[InlineData("john@smith@company.com", false)]
[InlineData("john", false)]
[InlineData("", false)]
public void CheckEmail(string mailAddress, bool expectedTestResult)
{
  var mailManager = new MailManager();

  Assert.Equal(expectedTestResult, mailManager.IsValidAddress(mailAddress));
}
```

If you want the same data for several tests, you would have to enter it several times. This is error-prone and unpractical. There are 3 more ways to provide data to a test:

#### Provide test data from a class

Create a new class with a static property and only a getter which yield returns all your test data as object arrays.

```cs
public class EmployeeTestDataAttribute : DataAttribute
{
    public override IEnumerable<object[]> TestData()
    {
        yield return new object[] { -100, false };
        yield return new object[] { 17, false };
        yield return new object[] { 18, true };
        yield return new object[] { 65, true };
        yield return new object[] { 66, false };
    }
}
```

For your test, use the MemberData instead of the InlineData attribute and provide the name of the property and the type of the class containing your test data.

```cs
 [Theory]
[MemberData(nameof(EmployeeAgeTestData.TestData), MemberType = typeof(EmployeeAgeTestData))]
public void TheoryTest_WithMemberData(int age, bool expectedResult)
{
    var result = age >= 18 && age <= 65;

    result.Should().Be(expectedResult);
}
```

#### Provide test data with a custom attribute

A custom attribute works the same way as the MemberData attribute but it is even less to write in your test. Create a new class and inherit from the DataAttribute class. Then override the GetData method.

```cs
public class EmployeeTestDataAttribute : DataAttribute
{
    public override IEnumerable<object[]> GetData(MethodInfo testMethod)
    {
        yield return new object[] { -100, false };
        yield return new object[] { 17, false };
        yield return new object[] { 18, true };
        yield return new object[] { 65, true };
        yield return new object[] { 66, false };
    }
}
```

After you created the class, add the name of the class (without Attribute) as the attribute to your Theory. xUnit will recognize your attribute and call the GetData method.

```cs
 [Theory]
[EmployeeTestData]
public void TheoryTest_WithCustomDataAttribute(int age, bool expectedResult)
{
    var result = age >= 18 && age <= 65;

    result.Should().Be(expectedResult);
}
```

#### Provide test data from an external source

The last method to provide data for your tests is from an external source. To read the data from a csv file, I placed the csv file in the root folder of my project and created a class with a static property. In the getter of the property, I read the file, split the values and return them as object arrays. Don’t forget to set the Copy to Output Directory property of the csv file to Copy always or Copy if newer. Otherwise, the file won’t be copied when you compile your code and therefore won’t be found at runtime.

```cs
public class ExternalEmployeeTestData
{
    public static IEnumerable<object[]> TestDataFromFile
    {
        get
        {
            var lines = File.ReadAllLines("TestDataCSV.csv");

            return lines.Select(line => line.Split(',').Cast<object>().ToArray()).ToList();
        }
    }
}
```

Now use the MemberData attribute for your test to add the name of the property and the type of your class.

```cs
[Theory]
[MemberData(nameof(ExternalEmployeeTestData.TestDataFromFile), MemberType = typeof(ExternalEmployeeTestData))]
public void TheoryTest_WithExternalData(int age, bool expectedResult)
{
    var result = age >= 18 && age <= 65;

    result.Should().Be(expectedResult);
}
```

## Other Attributes

### `[Skip]`

Sometimes you don’t want a test to be executed. To ignore tests, add the *Skip attribute* and provide an info message:

```cs
[Fact(Skip="This test is skipped")]
```

### `[Trait]`

If you run the tests and group the output by category, all traits with the same category will be grouped together. To group certain tests together use the `Trait` attribute.

```cs
[Trait("name", "Category")]
```

### Add information to the test result output

By default, no output is generated when a test finished. It can be useful to add some information on what the test did to the output of the test. This can be done with the `ITestOutputHelper`. Pass it as parameter in the constructor of your test class and initialize a private field with it.

```cs
private readonly ITestOutputHelper _outputHelper;

public EmployeeTests(ITestOutputHelper outputHelper)
{
    _testee = new Employee();
    -outputHelper = outputHelper;
}

[Fact]
public void ShouldHaveWorkingHours()
{
    _testee.WorkingHours = 40;
    _outputHelper.WriteLine("Creating Employee with 40 hours working");
    _testee.WorkingHours.Should().Be(40);
}
```

### Share resources: Test Fixtures

Sometimes you need to share a resource with several tests. This can be done with **Fixtures**.

First, you have to create a so-called fixture class with the information you want to share. In my simple example, I set DateTime.Now to demonstrate that every test uses the same instance of the object:

```cs
public class TimeFixture
{
    public TimeFixture()
    {
        DateTime = DateTime.Now;
    }

    public DateTime DateTime { get; set; }
}
```

Next, I am creating a collection class with the CollectionDefiniton attribute and the ICollectionFixture interface with my previously created fixture class.

```cs
[CollectionDefinition("My collection name")]
public class TimeCollection: ICollectionFixture<TimeFixture>
{

}
```

Finally, I add the Collection attribute with the previously set name to my test class and pass the fixture class in the constructor.

```cs
[Collection("My collection name")]
public class EmployeeTests: IDisposable
{
    private readonly Employee _testee;
    private readonly ItestOutputHelper _outputHelper;
    private readonly TimeFixture _timefixture;

    public EmployeeTests(ITestOutputHelper outputHelper, TimeFixture timeFixture)
    {
        _testee = new Employee();
        _outputHelper = new outputHelper();
        _timeFixture = timeFixture();
    }
}
```

To demonstrate that the _timeFixture object stays the same, I run a couple of tests with Thread.Sleep(1500) and both tests will output the same time.

```cs
[Fact]
public void TestWithSameTimeFixture1()
{
    _outputHelper.WriteLine(_timeFixture.DateTime);
    Thread.Sleep(1500);
}

[Fact]
public void TestWithSameTimeFixture2()
{
    _outputHelper.WriteLine(_timeFixture.DateTime);
    Thread.Sleep(1500);
}

// 27 - Jan - 2019 20:55:55
// 27 - Jan - 2019 20:55:55
```

## Links

[xUnit examples](https://github.com/xunit/samples.xunit)

[Microsoft TestTools for UnitTesting](https://docs.microsoft.com/en-us/dotnet/api/microsoft.visualstudio.testtools.unittesting?view=visualstudiosdk-2019)
