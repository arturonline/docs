# Completion Handler

A network request is a long-running operation that runs asynchronously, in the background queue.

When you create a network request, you add a completion handler to the shared `URLSession` instance. When the network request is completed, the `URLSession` instance executes your block of code inside the completion handler.

## Implement your Completion Handlers

To write code that takes a completion handler and executes it after a long-running operation is completed we use a escaping notation:

```Swift
func performLongRunningOperation(completion: @escaping () -> Void) {
    // Code that returns a result variable
    completion(result)
}
```

The `completion` parameter is a closure that is passed into the function. Calling `completion` executes the code passed into the completion parameter in the function call.

The `@escaping` keyword tells the compiler that the code in the closure will be executed after the function has returned, or has finished executing all the code.

Example:

```Swift
//: Playground - noun: a place where people can play

import UIKit
import PlaygroundSupport

PlaygroundPage.current.needsIndefiniteExecution = true

struct PhotoInfo: Codable {
    var title: String
    var description: String
    var url: URL
    var copyright: String?

    enum CodingKeys: String, CodingKey {
        case title
        case description = "explanation"
        case url
        case copyright
    }
}

extension URL {
    func withQueries(_ queries: [String: String]) -> URL? {

        var components = URLComponents(url: self, resolvingAgainstBaseURL: true)
        components?.queryItems = queries.compactMap { URLQueryItem(name: $0.0, value: $0.1)}
        return components?.url
    }
}

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
        }
    }

    task.resume()
}

fetchPhotoInfo{ (fetchedInfo) in
        print(fetchedInfo)
}


```