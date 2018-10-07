# Snippets

https://medium.com/@abhimuralidharan/higher-order-functions-in-swift-filter-map-reduce-flatmap-1837646a63e8

## Order a Map by this keys

```Swift
var roster = [Int:[String]]()

 var sortedRoster: [Int:[String]] {
    var sorted = [Int:[String]]()
    for (k,v) in Array(roster).sorted(by: { $0.0 > $1.0 }) { //Keys ordered
      sorted[k] = v.sorted(by: {$0 < $1}) // also array ordered
    }
  return sorted // map sorted
  }
```

or

```swift
  var roster = [Int:[String]]()

  var sortedRoster: [Int:[String]] {
    return roster.mapValues({ $0.sorted() })
  }
```

## Add value to array inside map

```Swift
var roster = [Int:[String]]()

func addStudent(_ name: String, grade: Int) {
    var array = roster[grade] ?? []
    array.append(name)
    roster[grade] = array
  }
```

or

```Swift
  func addStudent(_ name: String, grade: Int) {
    roster[grade] = (roster[grade] ?? []) + [name]
  }
```

## Reduce on a Map

```Swift
// let old = [ 1: [ "A", "E", "I", "O", "U" ] ]
// let expected =  ["a": 1, "e": 1, "i": 1, "o": 1, "u": 1 ]

//without reduce

struct ETL {
  static func transform(_ old: [Int: [String]]) -> [String: Int] {
    var result = [String: Int]()
    for (k, v) in old {
      for letter in v {
        result[letter.lowercased()] = k
      }
    }
    return result
  }
}
```

or

```Swift
//With reduce

struct ETL {
  static func transform(_ old: [Int: [String]]) -> [String: Int] {
    return old.reduce(initialValue: [:]) { (result, tupleOfKeyAndValue) in
      for s in tupleOfKeyAndValue.value {
        result[s.lowercased()] = tupleOfKeyAndValue.key
      }
    }
  }
}
```