# Networking

## Rest APIs

When we make an HTTP request, we get a response from the server. This response usually carries:

* `a status code`, which is a number that tells us if our call was ok or if there was some sort of error.
* `some HTTP headers` specifying some extra information about the response.
* `data`, if we requested some.

## HTTP request

There are three classes you need to know to make an HTTP request:

* `URLSession`: represents an HTTP session. Since an HTTP session groups a set of requests and responses, URLSession is used to make different requests that share the same configuration. In practice though, you don’t need to reuse a URLSession and you can create a new one for every request.
* `URLRequest`: represents an single `HTTP request`, including the URL, the HTTP method ( GET, POST, etc.), HTTP headers and so on. But for simple requests, you don’t need to use this class at all.
* `URLSessionTask`: this class performs the actual transfer of data. It has different subclasses for different types of tasks. The most common one you will use is `URLSessionDataTask`, which retrieves the content of a URL as a Data object. You actually don’t instantiate a task yourself, the URLSession class does it for you. But you have to remember to all their `resume()` method, or it won’t start.

So, making an HTTP request in iOS boils down to:

1. creating and configuring an instance of URLSession, to make one or more HTTP requests
2. creating and configuring an instance URLRequest for your requests, but only if you need some specific parameters. Otherwise, you can skip this;
3. starting a URLSessionDataTask through the URLSession instance.

```Swift
let configuration = URLSessionConfiguration.ephemeral
let session = URLSession(configuration: configuration)
let task = session.dataTask(with: url) {
    (data, response, error) in
    // Parse the data in the response and use it
})
task.resume()
```

or

```Swift
let configuration = URLSessionConfiguration.ephemeral
let session = URLSession(configuration: configuration, delegate: nil, delegateQueue: OperationQueue.main)
let task = session.dataTask(with: url, completionHandler: { [weak self] (data: Data?, response: URLResponse?, error: Error?) -> Void in
    // Parse the data in the response and use it
})
task.resume()
```

inside a function:

```Swift
func fetchPhotoInfo(completion: @escaping (PhotoInfo?) -> Void) {
    let baseURL = URL(string: "https://api.nasa.gov/planetary/apod")!
    let query: [String: String] = [
        "api_key": "DEMO_KEY"
    ]

    let url = baseURL.withQueries(query)!
    let decoder = JSONDecoder()

    let configuration = URLSessionConfiguration.default
    let session = URLSession(configuration: configuration)
    let task = session.dataTask(with: url) { (data, response, error) in
        if let data = data,
            let photoInfo = try? decoder.decode(PhotoInfo.self, from: data) {
            completion(photoInfo)
        } else {
            print("Either no data was returned, or data was not properly decoded.")
            completion(nil)
        }
    }

    task.resume()
}
// invoque function:

fetchPhotoInfo{ (fetchedInfo) in
        print(fetchedInfo)
}
```
