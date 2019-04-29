# Unwind Segue

Use unwind segues to implement navigation back to an existing view controller. If you want, for example, go back from VC3 to VC1:

## Step #1

In the view controller you are trying to go back to, (*VC1*) write this code:

```swift
    @IBAction func unwindToVC1(segue:UIStoryboardSegue) { }
```

## Step #2

In the Storyboard, go to the screen you’re trying to unwind from (*VC3*), and control + drag the **view controller** icon to the **Exit icon** located on top.

## Step #3

Select the Unwind segue in the document outline, and then go to the Attributes Inspector and name the identifier of the unwind segue (ex: *unwindtoVC1*)

## Step #4

Finally, write this code where you want the unwind segue action to be triggered, V3 in our case.

```swift
@IBAction func goBackToOneButtonTapped(_ sender: Any) {
    performSegue(withIdentifier: "unwindSegueToVC1", sender: self)
}
```

[Source](https://medium.com/@mimicatcodes/create-unwind-segues-in-swift-3-8793f7d23c6f)