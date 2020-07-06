# Swift import declaration

[Source](https://nshipster.com/import/)

```swift
import someModule
```

## Example

```swift
// Triathlon Module
func swim() {
    print("🏊‍ Swim 1.5 km")
}

func bike() {
    print("🚴 Cycle 40 km")
}

func run() {
    print("🏃‍ Run 10 km")
}
```

```swift
// Pentathlon Module
func fence() {
    print("🤺 Bout with épées")
}

func swim() {
    print("🏊‍ Swim 200 m")
}

func ride() {
    print("🏇 Complete a show jumping course")
}

func shoot() {
    print("🎯 Shoot 5 targets")
}

func run() {
    print("🏃‍ Run 3 km cross-country")
}
```

```swift
import Triathlon
import Pentathlon

bike() // OK, calls Triathlon.bike
fence() // OK, calls Pentathlon.fence
swim() // Error, ambiguous
```

```swift
import Triathlon
import Pentathlon

Triathlon.swim() // OK, fully-qualified reference to Triathlon.swim
Pentathlon.swim() // OK, fully-qualified reference to Pentathlon.swim
```

## Import individual declarations

```swift
import <Kind> module
```

| Kind      | Description |
| --------- | ----------- |
| struct    | Structure   |
| class     | Class       |
| enum      | Enumeration |
| protocol  | Protocol    |
| typealias | Type Alias  |
| func      | Function    |
| let       | Constant    |
| var       | Variable    |

```swift
import func Pentathlon.swim

swim() // OK, calls Pentathlon.swim
fence() // Error, unresolved identifier
```

## Resolving Symbol Name Collisions

When multiple symbols are referenced by the same name in code, the Swift compiler resolves this reference by consulting the following, in order:

1. Local Declarations
1. Imported Declarations
1. Imported Modules

If any of these have more than one candidate, Swift is unable to resolve the ambiguity and raises a compilation error.