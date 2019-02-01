# Delegation Pattern

## Example #1

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

## Example #2

```swift
// # 1: here is the protocol for creating the delegation
protocol AudioPlayerDelegate: class {
    func playPauseDidTap()
    func playlistDidTap()
}

class AudioPlayerView: UIView {
    //MARK:- IBOutlets
    @IBOutlet weak private var btnPlayPause: UIButton!
    @IBOutlet weak private var btnPlaylist: UIButton!

    // MARK:- Delegate
    weak var delegate: AudioPlayerDelegate?

    // IBActions
    @IBAction private func playPauseTapped(_ sender: AnyObject) {
        delegate?.playPauseDidTap()
    }

    @IBAction private func playlistTapped(_ sender: AnyObject) {
        delegate?.playlistDidTap()
    }
}
```

```swift
class ViewController: UIViewController {
    var audioPlayer: AudioPlayerView?

    override func viewDidLoad() {
        super.viewDidLoad()

        audioPlayer = AudioPlayerView()
        // # 3: the "AudioPlayerView" instance delegate will implemented by my class "ViewController"
        audioPlayer?.delegate = self
    }
}

// # 2: "ViewController" will implement "AudioPlayerDelegate":
extension ViewController: AudioPlayerDelegate {
    // # 4: "ViewController" implements "AudioPlayerDelegate" requirments:
    func playPauseDidTap() {
        print("play/pause tapped!!")
    }

    func playlistDidTap() {
        // note that is should do a different behavior in each viewController...
        print("list tapped!!")
    }
}
```