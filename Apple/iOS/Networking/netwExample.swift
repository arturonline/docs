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
                print("Fetch Photo Succes!")
                print(photoInfo)
            } else {
                print("Either no data was returned, or data was not properly decoded.")
            }
        }
    task.resume()
}
