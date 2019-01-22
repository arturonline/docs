# Delegation Pattern

* [Explanation](https://www.andrewcbancroft.com/2015/04/08/how-delegation-works-a-swift-developer-guide/)

![Delegation pattern](Delegate.png "Delegate Actors")

Example:
[Original link](http://marinbenc.com/why-you-shouldnt-use-delegates-in-swift)

```swift
protocol NetworkServiceDelegate {
    func didCompleteRequest(result: String)
}

class NetworkService {
    var delegate: NetworkServiceDelegate?

    func fetchDataFromUrl(url: String) {
        API.request(.GET, url) { result in
            delegate?.didCompleteRequest(result)
        }
    }
}

class MyViewController: UIViewController, NetworkServiceDelegate {

    let networkService = NetworkService()

    override func viewDidLoad() {
        super.viewDidLoad()
        networkService.delegate = self
    }

    func didCompleteRequest(result: String) {
        print("I got \(result) from the server!")
    }
}
```
