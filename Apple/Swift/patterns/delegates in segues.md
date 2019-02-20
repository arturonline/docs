# Delegates in Segues

[Source](http://www.systeen.com/2016/11/26/use-protocols-delegates-segues-swift-3/)

```swift
protocol SecondViewControllerDelegate: class {

    func editLabelOnFirstView(_ text: String)
}

class SecondViewController: UIViewController {

    weak var delegate: SecondViewControllerDelegate?

    override func viewDidLoad() {
// ...

    @IBAction func closeViewButton(_ sender: Any) {

        let text = "Text From Second View Controller"
        delegate?.editLabelOnFirstView(text)

        self.dismiss(animated: true, completion: nil)
    }
```

```swift
class FirstViewController: UIViewController, SecondViewControllerDelegate {

    @IBOutlet weak var firstLabel: UILabel!
// ...

    func editLabelOnFirstView(_ text: String) {
        firstLabel.text = text
    }

// ...

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {

        let secondViewController = segue.destination as! SecondViewController

        secondViewController.delegate = self

    }
```