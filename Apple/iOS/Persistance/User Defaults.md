# User Defaults

[Apple Documentation](https://developer.apple.com/documentation/foundation/userdefaults)

```swift
let defaults = UserDefaults.standard
```

## Simple Values

```swift
// save
defaults.set(0.24, forkey: "Volume")

// Retrieve
let volume = defaults.float(forkey: "Volume")
```

## Objects

```swift
// save
defaults.set(Date(), forkey: "AppLastOpenedByUser")

// retrieve
let appLastOpen = defaults.object(forkey: "AppLastOpenedByUser")
```

## Collections

```swift
let array = [1, 2, 3]

// save
defaults.set(array, forkey: "myArray")

// retrieve
let myArray = defaults.array(forkey: "myArray") as! [Int]
```
