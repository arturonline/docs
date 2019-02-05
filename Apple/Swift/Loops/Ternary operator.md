# Ternary Conditional Operator

The **ternary conditional operator** is a special operator with three parts, which takes the form `question ? answer1 : answer2`. It’s a shortcut for evaluating one of two expressions based on whether question is true or false. If *question* is true, it evaluates *answer1* and returns its value; otherwise, it evaluates *answer2* and returns its value.

```swift
if question {
    answer1
} else {
    answer2
}
```

```swift
question ? answer1 : answer2
```

## Examples #1

```swift
let num1 = 3
let num2 = 5
var max = num1 > num2 ? num1 : num2
```

## Example # 2

```swift
let contentHeight = 40
let hasHeader = true
let rowHeight: Int
if hasHeader {
    rowHeight = contentHeight + 50
} else {
    rowHeight = contentHeight + 20
}
// rowHeight is equal to 90
```

```swift
let contentHeight = 40
let hasHeader = true
let rowHeight = contentHeight + (hasHeader ? 50 : 20)
// rowHeight is equal to 90
```