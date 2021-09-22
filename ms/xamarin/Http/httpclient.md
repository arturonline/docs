# httpclient

HttpClient is a built-in class that's used to send HTTP requests and receive HTTP responses from a resource identified by a URI. `HttpClient` uses a task-based API for performance and gives you access to things like headers, status codes, and message bodies.

To use `HttpClient`, first you create an instance in memory. Here's how you do that in C#:

```cs
HttpClient client = new HttpClient();
```

## Create a new resource with HttpClient

To create a new resource by using *HttpClient*, use the *PostAsync* method. Here's an example in C# code:

```cs
// First, we create an instance of *HTTPClient* called *client* that we use to issue the *POST* request
HttpClient client = new HttpClient();

// Then we create an instance of *StringContent* called *content*. It represents the data that we send to the web service as a string. It also adds data like the encoding type and data format. In this example, we send the data in JSON format. Note that the variable data is just an instance of some C# object. We convert it into JSON by using the *JsonConvert* class.
StringContent content = new StringContent(JsonConvert.SerializeObject(data),Encoding.UTF8, "application/json");

// Finally, we call the *PostAsync* method on *HTTPClient*. The first parameter is the URI. The second parameter is the body of the message, which contains our data in JSON format. The *PostAsync* method returns a *HttpResponseMessage* object, which contains things like the status code and our newly created object.
HttpResponseMessage response = await client.PostAsync("https://...", content);
```

## Read a resource with HTTPClient

To read a resource by using HTTPClient, use the GetStringAsync method. Here's an example in C# code:

```cs
HttpClient client = new HttpClient();
string text = await client.GetStringAsync("https://...");
```

The *GetStringAsync* method takes in a URI and returns a response as a *string*. The *string* response is the resource you requested. The format of the response data will be the default for the requested service, such as JSON or XML. You can tell the web service that you prefer a specific data format sent to you by adding the *MediaTypeWithQualityHeaderValue* header. For example, if you request JSON format sent back to you, it looks something like this:

```cs
HttpClient client = new HttpClient();
client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
```

In this example, we got the result as a string. If you want to get the entire response as a *HttpResponseMessage* object, use *GetAsync* instead. The object includes the response's headers, body, and status code.

## Update a resource with HTTPClient

To update a resource by using *HTTPClient*, use the *PutAsync* method. The code is the same as when you create a new resource except that you use the *PutAsync* method. Here's the code in C#:

```cs
HttpClient client = new HttpClient();

StringContent content = new StringContent(JsonConvert.SerializeObject(data),Encoding.UTF8, "application/json");

HttpResponseMessage response = await client.PutAsync("https://...", content);
```

## Delete a resource with HTTPClient

To delete a resource by using *HTTPClient*, use the *DeleteAsync* method. Here's an example in C# code:

```cs
HttpClient client = new HttpClient();

HttpResponseMessage response = await client.DeleteAsync("https://...");
```

In this example, we pass in the URI of the resource we want to delete. The response contains the headers, status code, and deleted object.

## Native handlers

Xamarin.iOS includes a message handler called NSUrlSessionHandler that causes HttpClient to use its native networking stack:

```cs
var client = new HttpClient(new NSUrlSessionHandler());
```

Just like Xamarin.iOS, Xamarin.Android includes a message handler called AndroidClientHandler. 

```cs
var client = new HttpClient(new AndroidClientHandler());
```

As general guidance, always use NSUrlSessionHandler and AndroidClientHandler when you use HttpClient. They both provide benefits from the native networking stack.

## mas

https://docs.microsoft.com/en-us/learn/modules/consume-rest-services/5-use-platform-specific-network-features

Android emulator can connect to local HTTP web services via the 10.0.2.2 address