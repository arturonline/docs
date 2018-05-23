//: Playground - noun: a place where people can play

import UIKit
import PlaygroundSupport

PlaygroundPage.current.needsIndefiniteExecution = true

let baseURL = URL(string: "https://itunes.apple.com/search")!

extension URL {
    func withQueries(_ queries: [String: String]) -> URL? {
    var components = URLComponents(url: self, resolvingAgainstBaseURL: true)
        components?.queryItems = queries.compactMap { URLQueryItem(name: $0.0, value: $0.1)}
    return components?.url
    }
}

let query: [String: String] = [
    "media":"movie",
    "term":"ironman",
    "limit":"5"
]

let url = baseURL.withQueries(query)!
let configuration = URLSessionConfiguration.default
let session = URLSession(configuration: configuration)

let task = session.dataTask(with: url) {
    (data, response, error) in
    if let data = data, let string = String(data: data, encoding: .utf8) {
        print(string)
    }
}

task.resume()
