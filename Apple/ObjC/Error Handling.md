# Error Handling

Errors are typically handled three different ways: **assertions**, **exceptions**, and **recoverable errors**. In the case of assertions and exceptions, they should only be used in rare cases since crashing your app is obviously not a great user experience.

## Assertions

Assertions are used when you want to ensure that a value is what it is supposed to be. If it's not the correct value, you force exit the app.

```objc
NSAssert(someCondition, @"The condition was false, so we are exiting the app.");
```

Important: Do not call functions with side effects in the condition parameter of this macro. The condition parameter is not evaluated when assertions are disabled, so if you call functions with side effects, those functions may never get called when you build the project in a non-debug configuration.

## Exceptions

Exceptions are only used for programming or unexpected runtime errors. Examples: attempting to access the 6th element of an array with 5 elements (out-of-bounds access), attempting to mutate immutable objects, or sending an invalid message to an object. You usually take care of these sorts of errors with exceptions when an application is being created rather than at runtime.

An example of this might be if you have a library which requires an API key to use.

```objc
// Check for an empty API key
- (void)checkForAPIKey
{
    if (!self.apiKey || !self.apiKey.length) {
        [NSException raise:@"Forecastr" format:@"Your Forecast.io API key must be populated before you can access the API.", nil];
    }
}
```

## Try-Catch

If you're worried that a block of code is going to throw an exception, you can wrap it in a `try-catch block` but keep in mind that this has slight performance implications

```objc
@try {
    // The code to try here
}
@catch (NSException *exception) {
    // Handle the caught exception
}
@finally {
    // Execute code here that would run after both the @try and @catch blocks
}
```

## Recoverable Errors

Many times, methods will return an `NSError` object in a failure block or as a pointer to a pointer (in the case of `NSFileManager`). These are typically returned for recoverable errors and offer a much more pleasant user experience since they can clue the user into what just went wrong.

```objc
[forecastr getForecastForLocation:location success:^(id JSON) {
    NSLog(@"JSON response was: %@", JSON);
} failure:^(NSError *error, id response) {
    NSLog(@"Error while retrieving forecast: %@", error.localizedDescription);
}];
```

## Creating Your Own Errors

It's also possible to create your own `NSError` objects to return in methods.

```objc
// Error domain & enums
NSString *const kFCErrorDomain = @"com.forecastr.errors";
typedef NS_ENUM(NSInteger, ForecastErrorType) {
    kFCCachedItemNotFound,
    kFCCacheNotEnabled
};

@implementation Forecastr

- (void)checkForecastCacheForURLString:(NSString *)urlString
                               success:(void (^)(id cachedForecast))success
                               failure:(void (^)(NSError *error))failure
{
    // Check cache for a forecast
    id cachedItem = [forecastCache objectForKey:urlString];
    if (cachedItem) {
        success(cachedItem);
    } else {
        // Return an error since it wasn't found
        failure([NSError errorWithDomain:kFCErrorDomain code:kFCCachedItemNotFound userInfo:nil]);
    }
}

@end
```