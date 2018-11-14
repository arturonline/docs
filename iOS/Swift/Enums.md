# Enums

A Swift enum can either have raw values or associated values.

```swift
enum Airport {
    case munich
    case sanFrancisco
    case singapore
}
```

## Raw Values

Traditionally, each enum case was only a label for an Integer value. These labels were only necessary to make the code readable for humans while the computer itself was internally working with those Integers.

In swift, you’re not bound to use Integers for the value that is represented by a particular case. You can use Strings, Characters or even Floats instead.

```Swift
enum Airport: String {
    case munich = "MUC"
    case sanFrancisco = "SFO"
    case singapore = "SIN"
}
```

Whatever the type you choose, the value you assign to a case is called a rawValue.

## Associated Values

Swift allows you to bind one (or several) additional values to an enum case. These values are called associated values.

```Swift
enum Airport {
    case munich
    case sanFrancisco
    case singapore
    case london(airportName: LondonAirportName)
}

enum LondonAirportName {
    case stansted
    case heathrow
    case gatwick
}

var airport: Airport

airport = .london(.heathrow)
```

## Working with enums

```Swift
enum Airport: String {
    case munich = "MUC"
    case sanFrancisco = "SFO"
    case singapore = "SIN"
}

let airport = .sanFrancisco
let airportRawValue = airport.rawValue // "SFO"
```

```Swift
enum Airport {
    case munich
    case sanFrancisco
    case singapore
    case london(airportName: LondonAirportName)

    var cityIdentifier: String {
        switch self {
        case .munich:
            return "MUC"
        case .sanFrancisco:
            return "SFO"
        case .singapore:
            return "SIN"
        case .london:
            return "LON"
        }
    }
}
```

## Enum Extensions

```Swift
enum AppColor:String {
    case AppClearColor
    case AppGrayColor
    case AppWhiteColor
    case PrimaryColor
    case PrimaryColor1
    case PrimaryColor2
    case PrimaryColor3
    case SecondaryColor1
    case ThemeColor
}

extension AppColor {
    var color: UIColor {
        get {
            return UIColor(named: self.rawValue)!
        }
    }
}

self.view.backgroundColor = AppColor.PrimaryColor.color
```

or if you want to add a property to all enums whose raw value is a string:

```Swift
extension RawRepresentable where RawValue == String {
    var description: String {
        return rawValue
    }
}
```