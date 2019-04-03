# Optionals

## Null checks on a Dictionary

```Swift
if let constantName = someOptional {
        // constantName has been unwrapped
    } else {
        // constantName is nil
    }
```

```Swift
guard let constantName = someOptional else {
        // constantName is nil
    }
// constantName is accessible hereafter
```

```Swift
var dictionary = dictionary ?? "Default value for missing keys"
```

```Swift
    func take(product: String) -> Bool {
        if let quantity = stocks[product] {
            stocks[product] = quantity - 1
            return true
        } else {
            return false
        }
        guard let quantity = stocks[product] else {
            return false
        }
        stocks[product] = quantity - 1
        return true
    }
```