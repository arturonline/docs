# Consuming APIS

1. Create a new file `"flickrAPI.swift"`
2. Inside flickrAPI, create an enum (EndPoint) with the end points on the server to hit

    ```swift
    enum EndPoint: String {
        case interesting = "flicker.interestingness.getList"
        case old = "flicker.old.getList"
        case new = "flicker.new.getList"
    }
    ```

3. Inside flickrAPI.swift create a struct:

    ```swift
        struct FlickrAPI {
    }
    ```

4. Now declare a property to reference the base URL for the web service requests.

    ```swift
    static let baseURL = "https://api.flicker.com/services/rest"
    ```

5. Now create a method that builds up flicker url for specific endpoints

    ```swift
    private static func endPointURLBuilder(endPoint: EndPoint, parameters: [String: String]?) -> URL {
        return URL(string: "")!
    }
    ```

6. In FlickrAPI.swift, define and implement a computed property that returns the url:

    ```swift
    static var interestingPhotosURL: URL {
        return endPointURLBuilder(endPoint: .interesting, parameters: ["extras": "url_h,date_taken"]))
    }
    ```

7. Build the full URL with `URLComponents`:

    ```swift
    private static func endPointURLBuilder(endPoint: EndPoint, parameters: [String: String]?) -> URL {
        var components = URLComponents(string: baseURL)!

        var queryItems = [URLQueryItem]()

        if let additionalParams = parameters {
            for (key, value) in additionalParams {
                let item = URLQueryItem(name: key, value: value)
                queryItems.append(Item)
            }
        }
        components.queryItems = queryItems
        return components.url!
    }
    ```

8.  Finally we add the common query items to the `URLComponents`.

    ```swift
    private static func endPointURLBuilder(endPoint: EndPoint, parameters: [String: String]?) -> URL {
            var components = URLComponents(string: baseURL)!

            var queryItems = [URLQueryItem]()

            let baseParams = [
                "EndPoint": endPoint.rawValue,
                "format": "json",
                "api_key": apikey
            ]

            for (key, value) in baseParams{
                let item = URLQueryItem(name: key, value: value)
                queryItems.append(item)
            }

            if let additionalParams = parameters {
                for (key, value) in additionalParams {
                    let item = URLQueryItem(name: key, value: value)
                    queryItems.append(Item)
                }
            }
            components.queryItems = queryItems
            return components.url!
        }
    ```