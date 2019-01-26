# User Defaults

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
defaults.set(Date(), forkey: "AppLastOpenedByUser")

let appLastOpen = defaults.object(forkey: "AppLastOpenedByUser")
```
