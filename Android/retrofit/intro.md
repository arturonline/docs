# Retrofit

Steps:

1. Define the object model according to the api.
1. Define the API interface
1. Preparing the request
1. Doing the request

## Create the object model

// TODO

## Define the API Interface

With Retrofit 2, endpoints are defined inside of an interface using special retrofit annotations to encode details about the parameters and request method.

When you're requesting some user information, you might specify it as `Call<T> object`. The `<T>` class is the object model and contains the properties that will hold the user data. Retrofit will map it automatically and you won't have to do any manual parsing.

```Java
public interface MyApiEndpointInterface {
    // Request method and URL specified in the annotation

    @GET("users/{username}")
    Call<User> getUser(@Path("username") String username);

    @GET("group/{id}/users")
    Call<List<User>> groupList(@Path("id") int groupId, @Query("sort") String sort);

    @POST("users/new")
    Call<User> createUser(@Body User user);
}
```

## Preparing the request

To send out network requests to an API, we need to use the Retrofit builder class and specify the base URL for the service.

```Java
// Trailing slash is needed
public static final String BASE_URL = "http://api.myservice.com/";

Retrofit retrofit = new Retrofit.Builder()
    .baseUrl(BASE_URL)
    .addConverterFactory(GsonConverterFactory.create())
    .build();
```

Note also that we need to specify a factory for deserializing the response using the Gson library. The order in which the converters are added will be the sequence in which they are attempted to be processed.

If we wish to pass in a custom Gson parser instance, it can be specified too:

```Java
// Trailing slash is needed
public static final String BASE_URL = "http://api.myservice.com/";

Retrofit retrofit = new Retrofit.Builder()
    .baseUrl(BASE_URL)
    .addConverterFactory(GsonConverterFactory.create(gson))
    .build();

Gson gson = new GsonBuilder()
        .setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ")
        .create();

```

## Doing the request

We can bring this all together by constructing a service leveraging the `MyApiEndpointInterface` interface with the defined endpoints:

```Java
MyApiEndpointInterface apiService =
    retrofit.create(MyApiEndpointInterface.class);
```

If we want to consume the API asynchronously, we call the service as follows:

```Java
String username = "sarahjean";

Call<User> call = apiService.getUser(username);
call.enqueue(new Callback<User>() {
    @Override
    public void onResponse(Call<User> call, Response<User> response) {
        // The network call was a success and we got a response
        // TODO: use the repository list and display it
    }

    @Override
    public void onFailure(Call<User> call, Throwable t) {
        // the network call was a failure or the server send an error
        // TODO: handle error
    }
});
```

Shown above, Retrofit will download and parse the API data on a background thread, and then deliver the results back to the UI thread via the onResponse or onFailure method.

Note also that OkHttp, which dispatches the callback on the worker thread, callbacks in Retrofit are dispatched on the main thread. Because UI updates can only be done on the main thread, the approach used by Retrofit can make it easier to make changes to your views.

## notations

When you make a call to a webservice you want to send some parameters, this can be done in several ways. If the parameter is part of the URI, use a replacement system with `@Path` annotation. You can also add some query parameters with `@Query`. Other annotations exist but I will not explain them here, I will let you search a little bit if you need more specific parameters on Retrofit website.

**@Path** is used when you have url which has '/' dynamic value after a backword slash.Example:

`http://google.com/index.html/userid`

So in this url `/userid` is dynamic so to access this url your request should be:

```Java
@Get("index.html/{userid}")
Calldata(@Path("userid")int id);
```

**@Query** is used when you have a url which has '?' dynamic value after a question mark.Example:

`http://google.com/index.html?userid`

So in this url ? userid is dynamic so to access this url your request should be:

```Java
@Get("index.html")
Calldata(@Query("userid")int id);
```

## Schedule the call asynchronously

The Android framework won’t allow you to perform network calls on the UI thread. So, we need to  move the network call to a background thread.

```Java
call.enqueue(new Callback<List<Contributor>>() {
  @Override
  public void onResponse(Response<List<Contributor>> response, Retrofit retrofit) {
    // handle success
  }

  @Override
  public void onFailure(Throwable t) {
    // handle failure
  }
});
```
