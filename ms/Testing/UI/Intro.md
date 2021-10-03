# UI Testing

## Introduction

**Xamarin.UITest** is a C# testing framework using NUnit for UI Tests on iOS and Android apps.

Each `Xamarin.UITest` is written as a method that's referred to as a `[Test]`.

The class that contains the test is known as a `[TestFixture]`. The test fixture contains a single test or group of tests. The fixture is also responsible for setup to make the test run and cleanup that needs to be done when the test finishes.

## Test Workflow

Each test should follow the `Arrange-Act-Assert` pattern:

- **Arrange**: The test will set up conditions and initialize things so that the test can be actioned.
- **Act**: The test will interact with the application, enter text, pushing buttons, and so on.
- **Assert**: The test examines the results of the actions run in the Act step to determine correctness. For example, the application may verify that a particular error message is displayed.

## Development cycle

During the development automated tests are written as a feature is being developed:

- Develop the feature in the Android or iOS application.
- Write the tests and run them locally to verify functionality.
- Fix any issues or bugs that are exposed.
- Repeat the process by moving on to the next feature for the application.

## Testing Interfaces

Automated UI testing relies heavily on locating and interacting with views on the screen. Xamarin.UITest addresses this requirement with two important sets of APIs that work with each other:

- **Actions that can be done on views** - `Xamarin.UITest` provides APIs that allow a test to simulate common user actions such as tapping on the view, entering text, or swiping on the view.
- **Queries to locate views on the screen** - Part of the `Xamarin.UITest` framework are APIs that will locate the views on a screen. Queries locate views at run time by inspecting attributes for the view and returning an object that the actions may work upon. Querying in such a manner is a powerful technique that allows tests to be written for user interfaces whatever the screen size, orientation, or layout